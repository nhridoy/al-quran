import { useCallback, useEffect, useRef, useState } from "react";
import { useLocationStore } from "../../../store/location";
import { Header } from "../../Header/Header";

const KAABA = { lat: 21.4225, lng: 39.8262 };

// Physics configurations for the snap-back bounce at the end of a turn
const BOUNCE_STIFFNESS = 0.12;
const BOUNCE_DAMPING = 0.6;
const MOVEMENT_THRESHOLD = 0.5; // Degree change threshold to differentiate moving vs stopped

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function bearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function toCompassDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return dirs[index];
}

export default function QiblaFinder() {
  const {
    lat,
    lng,
    loading: geoLoading,
    error: geoError,
    request,
  } = useLocationStore();
  const [heading, setHeading] = useState<number | null>(null);
  const [compassSupported, setCompassSupported] = useState<boolean | null>(
    null,
  );
  const [permissionRequested, setPermissionRequested] =
    useState<boolean>(false);

  const targetHeadingRef = useRef<number | null>(null);
  const currentHeadingRef = useRef<number | null>(null);
  const velocityRef = useRef<number>(0);
  const lastRawHeadingRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const hasCoords = lat !== null && lng !== null;
  const qiblaDirection = hasCoords
    ? bearing(lat, lng, KAABA.lat, KAABA.lng)
    : 0;
  const distanceToKaaba = hasCoords
    ? calculateDistance(lat, lng, KAABA.lat, KAABA.lng)
    : 0;

  const dialRotation = heading === null ? 0 : -heading;
  const needleRotation = heading === null ? 0 : qiblaDirection - heading;

  const angularDiff =
    heading === null
      ? 0
      : ((((qiblaDirection - heading) % 360) + 540) % 360) - 180;
  const isFacingQibla = heading !== null && Math.abs(angularDiff) < 8;

  // Frame Loop Execution Environment
  useEffect(() => {
    const updatePhysics = () => {
      if (
        targetHeadingRef.current !== null &&
        currentHeadingRef.current !== null
      ) {
        let diff = targetHeadingRef.current - currentHeadingRef.current;

        // Shortest path handling over modular 360 boundary limits
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        // Check how fast the sensor target is shifting
        let deviceDelta = 0;
        if (lastRawHeadingRef.current !== null) {
          deviceDelta = targetHeadingRef.current - lastRawHeadingRef.current;
          if (deviceDelta > 180) deviceDelta -= 360;
          if (deviceDelta < -180) deviceDelta += 360;
        }
        lastRawHeadingRef.current = targetHeadingRef.current;

        if (Math.abs(deviceDelta) > MOVEMENT_THRESHOLD) {
          // 1. ACTIVE SPINNING: 1:1 raw snappiness. Kill physics lag and lock visually to sensor.
          currentHeadingRef.current = targetHeadingRef.current;
          // Inject residual velocity directly from current hand speed so it bounces naturally on release
          velocityRef.current = deviceDelta * 0.4;
          setHeading(targetHeadingRef.current);
        } else {
          // 2. STOPPED SPINNING: Trigger spring physics to shake out residual momentum
          const springForce = diff * BOUNCE_STIFFNESS;
          velocityRef.current += springForce;
          velocityRef.current *= BOUNCE_DAMPING;

          let nextHeading = currentHeadingRef.current + velocityRef.current;
          nextHeading = ((nextHeading % 360) + 360) % 360;

          currentHeadingRef.current = nextHeading;
          setHeading(nextHeading);
        }
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let rawHeading: number | null = null;
    const e = event as DeviceOrientationEvent & {
      webkitCompassHeading?: number;
      absolute?: boolean;
    };

    if (
      e.webkitCompassHeading !== undefined &&
      e.webkitCompassHeading !== null
    ) {
      rawHeading = e.webkitCompassHeading;
    } else if (e.absolute === true || e.absolute === undefined) {
      if (e.alpha !== null) {
        rawHeading = (360 - e.alpha) % 360;
      }
    }

    if (rawHeading === null) return;
    setCompassSupported(true);

    if (currentHeadingRef.current === null) {
      currentHeadingRef.current = rawHeading;
      lastRawHeadingRef.current = rawHeading;
      setHeading(rawHeading);
    }

    targetHeadingRef.current = rawHeading;
  }, []);

  const startCompass = async () => {
    setPermissionRequested(true);
    const devEvent = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (typeof devEvent.requestPermission === "function") {
      try {
        const result = await devEvent.requestPermission();
        if (result !== "granted") {
          setCompassSupported(false);
          return;
        }
      } catch {
        setCompassSupported(false);
        return;
      }
    }

    globalThis.addEventListener("deviceorientation", handleOrientation);
  };

  useEffect(() => {
    if (!hasCoords) return;

    const devEvent = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<unknown>;
    };

    if (typeof devEvent.requestPermission !== "function") {
      if ("ondeviceorientationabsolute" in globalThis) {
        globalThis.addEventListener(
          "deviceorientationabsolute",
          handleOrientation,
        );
      } else {
        globalThis.addEventListener("deviceorientation", handleOrientation);
      }
    }

    return () => {
      globalThis.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
      );
      globalThis.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [hasCoords, handleOrientation]);

  return (
    <div className="min-h-screen">
      <Header head="Qibla Finder" showBack />
      <div className="mx-4 space-y-6 pb-8 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Qibla Finder
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Find the direction of the Kaaba in Makkah
          </p>
        </div>

        {!hasCoords && geoLoading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
            <p className="text-sm text-text-muted">
              Detecting your location...
            </p>
          </div>
        )}

        {geoError && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center dark:border-dark-border dark:bg-dark-surface-card">
            <p className="text-sm text-text-muted">
              {geoError}. Location is required.
            </p>
            <button
              type="button"
              onClick={request}
              className="rounded-xl bg-linear-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {hasCoords && (
          <>
            {!permissionRequested &&
              typeof (
                DeviceOrientationEvent as unknown as {
                  requestPermission?: () => Promise<unknown>;
                }
              ).requestPermission === "function" && (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-900/30 dark:bg-amber-950/20">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Compass sensor access is required to point towards the
                    Qibla.
                  </p>
                  <button
                    type="button"
                    onClick={startCompass}
                    className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    Enable Compass
                  </button>
                </div>
              )}

            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full bg-surface-alt dark:bg-dark-surface-alt">
                {/* 1. ROTATING DIAL COMPASS */}
                <div
                  className="absolute inset-0 flex items-center justify-center will-change-transform"
                  style={{ transform: `rotate(${dialRotation}deg)` }}
                >
                  <div className="absolute inset-4 rounded-full border-2 border-border/40 dark:border-dark-border/40" />
                  <span className="absolute top-3 text-sm font-black text-red-500">
                    N
                  </span>
                  <span className="absolute right-3 text-sm font-bold text-text-primary dark:text-dark-text-primary">
                    E
                  </span>
                  <span className="absolute bottom-3 text-sm font-bold text-text-primary dark:text-dark-text-primary">
                    S
                  </span>
                  <span className="absolute left-3 text-sm font-bold text-text-primary dark:text-dark-text-primary">
                    W
                  </span>
                </div>

                {/* 2. STATIONARY LABELS */}
                <div className="absolute inset-16 z-10 flex items-center justify-center rounded-full bg-surface shadow-sm dark:bg-dark-surface-card">
                  <div className="text-center">
                    <p className="text-xl font-black text-text-primary dark:text-dark-text-primary">
                      {qiblaDirection.toFixed(0)}&deg;
                    </p>
                    <p className="text-xs font-semibold text-text-muted">
                      {toCompassDirection(qiblaDirection)}
                    </p>
                  </div>
                </div>

                {/* 3. INDEPENDENT ROTATING QIBLA NEEDLE */}
                <div
                  className="absolute z-20 flex h-full w-full items-center justify-center will-change-transform"
                  style={{ transform: `rotate(${needleRotation}deg)` }}
                >
                  <div className="relative flex h-[82%] w-3 flex-col items-center">
                    <div
                      className={`h-1/2 w-full rounded-t-full shadow-xs ${
                        isFacingQibla
                          ? "bg-green-500 animate-pulse"
                          : "bg-secondary"
                      }`}
                    />
                    <div className="h-1/2 w-1.5 bg-text-muted/30" />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl px-4 py-2 text-center text-sm font-semibold tracking-wide transition-colors ${
                  isFacingQibla
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-surface-alt text-text-muted dark:bg-dark-surface-alt"
                }`}
              >
                {isFacingQibla
                  ? "✓ Facing Qibla!"
                  : heading === null
                    ? "Calibrating Compass Sensor..."
                    : `Turn ${Math.abs(angularDiff).toFixed(0)}° ${angularDiff > 0 ? "Right" : "Left"}`}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card">
              <div className="divide-y divide-border dark:divide-dark-border">
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-text-muted">
                    Your Coordinates
                  </span>
                  <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                    {lat.toFixed(4)}&deg;N, {lng.toFixed(4)}&deg;E
                  </span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-text-muted">
                    Qibla Direction
                  </span>
                  <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                    {qiblaDirection.toFixed(1)}&deg;{" "}
                    {toCompassDirection(qiblaDirection)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-text-muted">
                    Distance to Kaaba
                  </span>
                  <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                    ~{distanceToKaaba.toFixed(0)} km
                  </span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-text-muted">
                    Current Device Heading
                  </span>
                  <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                    {compassSupported === false
                      ? "Not available"
                      : heading === null
                        ? "Calibrating..."
                        : `${heading.toFixed(1)}°`}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

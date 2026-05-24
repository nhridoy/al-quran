import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "../../components/common/Header/Header";
import { useLocationStore } from "../../store/location";

const KAABA = { lat: 21.4225, lng: 39.8262 };
const SMOOTHING = 0.15;

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
  const [sensorTimeout, setSensorTimeout] = useState<boolean>(false);
  const smoothedRef = useRef<number | null>(null);

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

    if (smoothedRef.current === null) {
      smoothedRef.current = rawHeading;
      setHeading(rawHeading);
      return;
    }

    let diff = rawHeading - smoothedRef.current;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const smoothed = smoothedRef.current + diff * SMOOTHING;
    smoothedRef.current = ((smoothed % 360) + 360) % 360;
    setHeading(smoothedRef.current);
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

  // Setup device orientation listening
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

  // NEW: Timeout effect if coordinates are ready but no heading events fire within 5 seconds
  useEffect(() => {
    if (!hasCoords || heading !== null || compassSupported === false) return;

    const timer = setTimeout(() => {
      if (heading === null) {
        setSensorTimeout(true);
        setCompassSupported(false);
      }
    }, 5000); // 5 seconds wait period

    return () => clearTimeout(timer);
  }, [hasCoords, heading, compassSupported]);

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
              {/* Compass Frame Container */}
              <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border border-border/40 bg-surface-alt shadow-inner dark:border-dark-border/40 dark:bg-dark-surface-alt">
                {/* 1. ROTATING DIAL COMPASS (N E S W) */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-out will-change-transform"
                  style={{ transform: `rotate(${dialRotation}deg)` }}
                >
                  <div className="absolute inset-4 rounded-full border border-dashed border-border/60 dark:border-dark-border/40" />
                  <span className="absolute top-3 text-xs font-black tracking-wider text-red-500">
                    N
                  </span>
                  <span className="absolute right-3 text-xs font-bold text-text-primary dark:text-dark-text-primary">
                    E
                  </span>
                  <span className="absolute bottom-3 text-xs font-bold text-text-primary dark:text-dark-text-primary">
                    S
                  </span>
                  <span className="absolute left-3 text-xs font-bold text-text-primary dark:text-dark-text-primary">
                    W
                  </span>
                </div>

                {/* 2. STATIONARY LABELS (Center Text Indicator) */}
                <div className="absolute inset-20 z-30 flex items-center justify-center rounded-full border border-border/30 bg-surface shadow-md dark:border-dark-border/30 dark:bg-dark-surface-card">
                  <div className="text-center">
                    <p className="text-lg font-black tracking-tight text-text-primary dark:text-dark-text-primary">
                      {qiblaDirection.toFixed(0)}&deg;
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      {toCompassDirection(qiblaDirection)}
                    </p>
                  </div>
                </div>

                {/* 3. IMPROVED ROTATING QIBLA NEEDLE */}
                <div
                  className="absolute z-20 flex h-full w-full items-center justify-center transition-transform duration-150 ease-out will-change-transform"
                  style={{ transform: `rotate(${needleRotation}deg)` }}
                >
                  <div className="relative flex h-[82%] w-6 items-center justify-center">
                    {/* Upper Qibla Pointer (3D Diamond/Arrowhead) */}
                    <div className="absolute top-0 bottom-1/2 left-0 right-0 flex flex-col items-center justify-end">
                      <div
                        className={`w-0 h-0 border-l-10 border-r-10 border-b-85 border-l-transparent border-r-transparent transition-all duration-300 drop-shadow-md
                          ${
                            isFacingQibla
                              ? "border-b-green-500 animate-pulse drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                              : "border-b-secondary"
                          }`}
                      />
                    </div>

                    {/* Lower Trailing Needle */}
                    <div className="absolute top-1/2 bottom-0 left-0 right-0 flex flex-col items-center justify-start">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-55 border-l-transparent border-r-transparent border-t-text-muted/20 dark:border-t-dark-text-muted/20" />
                    </div>

                    {/* Center Pivot Pin Ring */}
                    <div className="absolute z-10 h-3 w-3 rounded-full border border-white/20 bg-text-primary shadow-xs dark:bg-dark-text-primary" />
                  </div>
                </div>
              </div>

              {/* Status Indicator Bar */}
              <div
                className={`rounded-xl px-4 py-2 text-center text-sm font-semibold tracking-wide transition-colors ${
                  isFacingQibla
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : sensorTimeout
                      ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                      : "bg-surface-alt text-text-muted dark:bg-dark-surface-alt"
                }`}
              >
                {isFacingQibla
                  ? "✓ Facing Qibla!"
                  : heading !== null
                    ? `Turn ${Math.abs(angularDiff).toFixed(0)}° ${angularDiff > 0 ? "Right" : "Left"}`
                    : sensorTimeout
                      ? "⚠ Compass sensor not detected"
                      : "Calibrating Compass Sensor..."}
              </div>
            </div>

            {/* Bottom Metadata Panel */}
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
                    {compassSupported === false || sensorTimeout
                      ? "Sensor not found / unavailable"
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

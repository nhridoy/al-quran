import { useCallback, useEffect, useRef, useState } from "react";
import { useLocationStore } from "../../../store/location";
import { Header } from "../../Header/Header";

const KAABA = { lat: 21.4225, lng: 39.8262 };
const SMOOTHING = 0.25;

// Haversine formula to accurately calculate distance in km
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth's radius in km
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

function tiltCompensatedHeading(
  alpha: number,
  beta: number,
  gamma: number,
): number {
  const a = (alpha * Math.PI) / 180;
  const b = (beta * Math.PI) / 180;
  const g = (gamma * Math.PI) / 180;
  const x = Math.cos(a) * Math.cos(g) + Math.sin(a) * Math.sin(b) * Math.sin(g);
  const y = Math.sin(a) * Math.cos(g) - Math.cos(a) * Math.sin(b) * Math.sin(g);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function getHeadingFromEvent(event: DeviceOrientationEvent): number | null {
  const e = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
  if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
    return e.webkitCompassHeading;
  }
  if (e.alpha === null) return null;
  if (e.beta !== null && e.gamma !== null) {
    return tiltCompensatedHeading(e.alpha, e.beta, e.gamma);
  }
  return e.alpha;
}

export default function QiblaFinder() {
  const {
    lat,
    lng,
    loading: geoLoading,
    error: geoError,
    request,
  } = useLocationStore();
  const [displayHeading, setDisplayHeading] = useState<number | null>(null);
  const [compassSupported, setCompassSupported] = useState<boolean | null>(
    null,
  );
  const [permissionRequested, setPermissionRequested] =
    useState<boolean>(false);
  const smoothedRef = useRef<number | null>(null);

  const hasCoords = lat !== null && lng !== null;
  const qiblaDirection = hasCoords
    ? bearing(lat, lng, KAABA.lat, KAABA.lng)
    : 0;
  const distanceToKaaba = hasCoords
    ? calculateDistance(lat, lng, KAABA.lat, KAABA.lng)
    : 0;

  const needleRotation =
    displayHeading !== null
      ? ((((qiblaDirection - displayHeading) % 360) + 540) % 360) - 180
      : 0;
  const isFacingQibla =
    displayHeading !== null && Math.abs(needleRotation) < 10;

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const heading = getHeadingFromEvent(event);
    if (heading === null) return;

    setCompassSupported(true);

    if (smoothedRef.current === null) {
      smoothedRef.current = heading;
      setDisplayHeading(heading);
      return;
    }

    const prev = smoothedRef.current;
    let diff = heading - prev;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const smoothed = prev + diff * SMOOTHING;
    smoothedRef.current = ((smoothed % 360) + 360) % 360;
    setDisplayHeading(smoothedRef.current);
  }, []);

  // Dedicated explicit permission trigger for iOS devices
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
    window.addEventListener("deviceorientation", handleOrientation);
  };

  useEffect(() => {
    if (!hasCoords) return;

    const devEvent = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<unknown>;
    };

    // Automatically bind on Android/Desktop where explicit user gesture permissions aren't required
    if (typeof devEvent.requestPermission !== "function") {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
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
              {geoError}. Location is needed to calculate Qibla direction.
            </p>
            <button
              type="button"
              onClick={request}
              className="cursor-pointer rounded-xl bg-linear-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}

        {hasCoords && (
          <>
            {/* Call to action for iOS users who must manually grant permissions via user interaction click */}
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
                    className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
                  >
                    Enable Compass
                  </button>
                </div>
              )}

            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-64 w-64 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-border dark:border-dark-border" />
                <div className="absolute inset-4 rounded-full border-2 border-border/50 dark:border-dark-border/50" />
                <div className="absolute inset-12 rounded-full border border-border/30 dark:border-dark-border/30" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                      {qiblaDirection.toFixed(0)}&deg;
                    </p>
                    <p className="text-xs text-text-muted">
                      {toCompassDirection(qiblaDirection)}
                    </p>
                  </div>
                </div>

                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-text-muted">
                  N
                </span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                  E
                </span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-text-muted">
                  S
                </span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                  W
                </span>

                {/* Transition classes removed to eliminate 360° to 0° wild spinning edge-case bugs */}
                <div
                  className="absolute flex h-full w-full items-center justify-center will-change-transform"
                  style={{ transform: `rotate(${needleRotation}deg)` }}
                >
                  <div className="relative flex h-full w-2 flex-col items-center">
                    <div
                      className={`h-1/2 w-2 rounded-t-full ${isFacingQibla ? "bg-green-500" : "bg-secondary"}`}
                    />
                    <div className="h-1/2 w-2 rounded-b-full bg-text-muted" />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl px-4 py-2 text-center text-sm font-medium ${
                  isFacingQibla
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-surface-alt text-text-muted dark:bg-dark-surface-alt"
                }`}
              >
                {isFacingQibla
                  ? "✓ Facing Qibla!"
                  : displayHeading !== null
                    ? `Rotate ${needleRotation.toFixed(0)}° to face Qibla`
                    : "Point device North to see direction"}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card">
              <div className="divide-y divide-border dark:divide-dark-border">
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-text-muted">Location</span>
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
                  <span className="text-sm text-text-muted">Distance</span>
                  <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                    ~{distanceToKaaba.toFixed(0)} km
                  </span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-text-muted">Compass</span>
                  <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                    {compassSupported === false
                      ? "Not available"
                      : displayHeading !== null
                        ? `${displayHeading.toFixed(1)}°`
                        : "Calibrating..."}
                  </span>
                </div>
              </div>
            </div>

            {compassSupported === false && (
              <div className="rounded-2xl border border-border bg-surface-alt p-4 text-center dark:border-dark-border dark:bg-dark-surface-alt">
                <p className="text-sm text-text-muted">
                  Compass not available on this device. Use the bearing above (
                  {qiblaDirection.toFixed(0)}
                  &deg;) to determine Qibla direction manually.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

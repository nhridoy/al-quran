import {
  PrayerTimes as AdhanPrayerTimes,
  CalculationMethod,
  Coordinates,
  Madhab,
} from "adhan";
import { useEffect, useMemo, useState } from "react";
import { Header } from "../../components/common/Header/Header";
import { useLocationStore } from "../../store/location";
import { useSettings } from "../../store/settings";

interface PrayerEntry {
  key: string;
  name: string;
  nameBn: string;
  time: Date;
  icon: string;
}

const PRAYER_NAMES: {
  key: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
  name: string;
  nameBn: string;
  icon: string;
}[] = [
  { key: "fajr", name: "Fajr", nameBn: "ফজর", icon: "🌅" },
  { key: "sunrise", name: "Sunrise", nameBn: "সূর্যোদয়", icon: "🌄" },
  { key: "dhuhr", name: "Dhuhr", nameBn: "যোহর", icon: "☀️" },
  { key: "asr", name: "Asr", nameBn: "আসর", icon: "🌤️" },
  { key: "maghrib", name: "Maghrib", nameBn: "মাগরিব", icon: "🌇" },
  { key: "isha", name: "Isha", nameBn: "ইশা", icon: "🌙" },
];

function getAdhanMethod(method: string) {
  switch (method) {
    case "ISNA":
      return CalculationMethod.NorthAmerica();
    case "Egypt":
      return CalculationMethod.Egyptian();
    case "UmmAlQura":
      return CalculationMethod.UmmAlQura();
    case "Karachi":
      return CalculationMethod.Karachi();
    default:
      return CalculationMethod.MuslimWorldLeague();
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getCountdown(now: Date, target: Date): string {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function PrayerTimesPage() {
  const settings = useSettings();
  const {
    lat,
    lng,
    loading: geoLoading,
    error: geoError,
    request,
  } = useLocationStore();
  const [now, setNow] = useState(new Date());
  const coords = lat !== null && lng !== null ? { lat, lng } : null;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const times = useMemo(() => {
    if (!coords) return null;
    const coordinates = new Coordinates(coords.lat, coords.lng);
    const params = getAdhanMethod(settings.prayerCalcMethod);
    params.madhab =
      settings.prayerAsrMethod === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
    return new AdhanPrayerTimes(coordinates, now, params);
  }, [coords, settings.prayerCalcMethod, settings.prayerAsrMethod, now]);

  const prayers: PrayerEntry[] = useMemo(() => {
    if (!times) return [];
    return PRAYER_NAMES.map((p) => {
      const time = times[p.key as keyof AdhanPrayerTimes] as Date;
      return { ...p, time };
    });
  }, [times]);

  const nextPrayer = useMemo(() => {
    if (prayers.length === 0) return null;
    const upcoming = prayers.find((p) => p.time > now);
    if (upcoming) return upcoming;
    return prayers[0];
  }, [prayers, now]);

  const currentPrayer = useMemo(() => {
    if (prayers.length === 0) return null;
    let current = prayers[0];
    for (const p of prayers) {
      if (p.time <= now) current = p;
    }
    return current;
  }, [prayers, now]);

  return (
    <div className="min-h-screen">
      <Header head="Prayer Times" showBack />
      <div className="mx-4 space-y-4 pb-8 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Prayer Times
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {!coords && geoLoading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
            <p className="text-sm text-text-muted">
              Requesting location for accurate prayer times...
            </p>
          </div>
        )}

        {geoError && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center dark:border-dark-border dark:bg-dark-surface-card">
            <p className="text-sm text-text-muted">
              {geoError}. Please enable location access.
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

        {coords && nextPrayer && (
          <div className="overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary-light to-secondary p-6 text-white shadow-xl shadow-primary/20">
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">
              Next Prayer
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold">{nextPrayer.name}</span>
              <span className="text-2xl font-semibold text-white/80">
                {formatTime(nextPrayer.time)}
              </span>
            </div>
            {nextPrayer.time > now && (
              <p className="mt-2 text-lg font-semibold text-white/90">
                {getCountdown(now, nextPrayer.time)} remaining
              </p>
            )}
            <p className="mt-1 text-xs text-white/60">
              {coords.lat.toFixed(4)}&deg;N, {coords.lng.toFixed(4)}&deg;E
            </p>
          </div>
        )}

        {prayers.length > 0 && (
          <div className="space-y-2">
            {prayers.map((p) => {
              const isCurrent = currentPrayer?.name === p.name;
              const isNext = nextPrayer?.name === p.name;
              return (
                <div
                  key={p.key}
                  className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                    isCurrent
                      ? "border-accent/30 bg-accent-soft/50 shadow-sm dark:border-accent/20 dark:bg-accent/5"
                      : "border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card"
                  }`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        isNext
                          ? "text-secondary"
                          : "text-text-primary dark:text-dark-text-primary"
                      }`}
                    >
                      {p.name}
                      {isCurrent && (
                        <span className="ml-2 text-[10px] font-medium text-accent">
                          Current
                        </span>
                      )}
                      {isNext && !isCurrent && (
                        <span className="ml-2 text-[10px] font-medium text-secondary">
                          Next
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-text-muted dark:text-dark-text-muted">
                      {p.nameBn}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">
                    {formatTime(p.time)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

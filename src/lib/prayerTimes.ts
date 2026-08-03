import {
  PrayerTimes as AdhanPrayerTimes,
  CalculationMethod,
  type CalculationParameters,
  Coordinates,
  Madhab,
  SunnahTimes,
} from "adhan";

export interface PrayerEntry {
  key: string;
  name: string;
  time: Date;
  icon: string;
}

export const PRAYER_NAMES: {
  key: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
  name: string;
  icon: string;
}[] = [
  { key: "fajr", name: "prayerNames.fajr", icon: "🌅" },
  { key: "sunrise", name: "prayerNames.sunrise", icon: "🌄" },
  { key: "dhuhr", name: "prayerNames.dhuhr", icon: "☀️" },
  { key: "asr", name: "prayerNames.asr", icon: "🌤️" },
  { key: "maghrib", name: "prayerNames.maghrib", icon: "🌇" },
  { key: "isha", name: "prayerNames.isha", icon: "🌙" },
];

// Registry of calculation method factories.
// Open for extension — new methods are added via registerCalculationMethod()
// without modifying this file. Follows OCP + DIP (same pattern as createStore.ts).
const methodRegistry: Record<string, () => CalculationParameters> = {
  ISNA: () => CalculationMethod.NorthAmerica(),
  Egypt: () => CalculationMethod.Egyptian(),
  UmmAlQura: () => CalculationMethod.UmmAlQura(),
  Karachi: () => CalculationMethod.Karachi(),
  MWL: () => CalculationMethod.MuslimWorldLeague(),
};

/** Register a custom calculation method. Callers can extend the registry without modifying this module. */
export function registerCalculationMethod(
  id: string,
  factory: () => CalculationParameters,
): void {
  methodRegistry[id] = factory;
}

export function getAdhanMethod(method: string): CalculationParameters {
  const factory = methodRegistry[method];
  return factory ? factory() : CalculationMethod.MuslimWorldLeague();
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getPrayerTime(
  times: AdhanPrayerTimes,
  key: (typeof PRAYER_NAMES)[number]["key"],
): Date {
  return times[key] as Date;
}

export function getCountdown(now: Date, target: Date): string {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function computePrayerTimes(
  coords: { lat: number; lng: number } | null,
  method: string,
  asrMethod: string,
  now: Date,
): AdhanPrayerTimes | null {
  if (!coords) return null;
  const coordinates = new Coordinates(coords.lat, coords.lng);
  const params = getAdhanMethod(method);
  params.madhab = asrMethod === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  return new AdhanPrayerTimes(coordinates, now, params);
}

export function buildPrayerEntries(
  times: AdhanPrayerTimes | null,
): PrayerEntry[] {
  if (!times) return [];
  return PRAYER_NAMES.map((p) => {
    const time = getPrayerTime(times, p.key);
    return { ...p, time };
  });
}

export function findNextPrayer(
  prayers: PrayerEntry[],
  now: Date,
): PrayerEntry | null {
  if (prayers.length === 0) return null;
  const upcoming = prayers.find((p) => p.time > now);
  if (upcoming) return upcoming;
  return prayers[0];
}

export function findCurrentPrayer(
  prayers: PrayerEntry[],
  now: Date,
  windowEndMap?: Map<string, Date | null>,
): PrayerEntry | null {
  if (prayers.length === 0) return null;
  let current = prayers[0];
  for (const p of prayers) {
    if (p.time <= now) {
      const end = windowEndMap?.get(p.key) ?? null;
      if (end && now > end) continue;
      current = p;
    }
  }
  return current;
}

export function buildPrayerWindowMap(
  prayers: PrayerEntry[],
  times: AdhanPrayerTimes,
): Map<string, Date | null> {
  const map = new Map<string, Date | null>();
  if (prayers.length === 0 || !times) return map;
  const sunnah = new SunnahTimes(times);
  for (let i = 0; i < prayers.length; i++) {
    const p = prayers[i];
    if (p.key === "fajr") {
      map.set(p.key, times.sunrise);
    } else if (p.key === "isha") {
      map.set(p.key, sunnah.middleOfTheNight);
    } else {
      const next = prayers[i + 1];
      map.set(p.key, next?.time ?? null);
    }
  }
  return map;
}

export function getTahajjudTime(times: AdhanPrayerTimes): Date {
  return new SunnahTimes(times).lastThirdOfTheNight;
}

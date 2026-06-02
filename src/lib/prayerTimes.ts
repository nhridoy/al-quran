import {
  PrayerTimes as AdhanPrayerTimes,
  CalculationMethod,
  Coordinates,
  Madhab,
} from "adhan";

export interface PrayerEntry {
  key: string;
  name: string;
  nameBn: string;
  time: Date;
  icon: string;
}

export const PRAYER_NAMES: {
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

export function getAdhanMethod(method: string) {
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
): PrayerEntry | null {
  if (prayers.length === 0) return null;
  let current = prayers[0];
  for (const p of prayers) {
    if (p.time <= now) current = p;
  }
  return current;
}

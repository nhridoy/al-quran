import { create } from "zustand";
import { getAllFromStore, putInStore } from "@/lib/cache";

export const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerKey = (typeof PRAYER_KEYS)[number];
export const PRAYER_NAMES: Record<PrayerKey, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};
export const PRAYER_ICONS: Record<PrayerKey, string> = {
  fajr: "🌅",
  dhuhr: "☀️",
  asr: "🌤️",
  maghrib: "🌇",
  isha: "🌃",
};

export interface PrayerDay {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function emptyDay(date: string): PrayerDay {
  return {
    date,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  };
}

interface PrayerState {
  records: Record<string, PrayerDay>;
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (key: PrayerKey, dateOverride?: string) => Promise<void>;
  getDay: (date: string) => PrayerDay;
  getStreak: () => number;
  getMonthStats: (
    year: number,
    month: number,
  ) => { date: string; count: number }[];
}

export const usePrayerStore = create<PrayerState>((set, get) => ({
  records: {},
  loaded: false,

  load: async () => {
    const all = await getAllFromStore<PrayerDay>("prayer-records");
    const map: Record<string, PrayerDay> = {};
    for (const r of all) map[r.date] = r;
    set({ records: map, loaded: true });
  },

  toggle: async (key, dateOverride?: string) => {
    const k = dateOverride ?? todayKey();
    const current = get().records[k] ?? emptyDay(k);
    const next = { ...current, [key]: !current[key] };
    await putInStore("prayer-records", k, next);
    set({ records: { ...get().records, [k]: next } });
  },

  getDay: (date) => get().records[date] ?? emptyDay(date),

  getStreak: () => {
    const records = get().records;
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const day = records[key];
      if (day) {
        const count = PRAYER_KEYS.filter((k) => day[k]).length;
        if (count >= 5) {
          streak++;
          d.setDate(d.getDate() - 1);
          continue;
        }
      }
      break;
    }
    return streak;
  },

  getMonthStats: (year, month) => {
    const records = get().records;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const stats: { date: string; count: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const day = records[key];
      stats.push({
        date: key,
        count: day ? PRAYER_KEYS.filter((k) => day[k]).length : 0,
      });
    }
    return stats;
  },
}));

export function isCompleteDay(day: PrayerDay): boolean {
  return PRAYER_KEYS.every((k) => day[k]);
}

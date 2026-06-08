import { create } from "zustand";
import { getAllFromStore, putInStore } from "@/lib/cache";

export interface WorshipDay {
  date: string;
  quranRead: boolean;
  morningAdhkar: boolean;
  duha: boolean;
  eveningAdhkar: boolean;
  tahajjud: boolean;
  fasting: boolean;
}

function emptyDay(date: string): WorshipDay {
  return {
    date,
    quranRead: false,
    morningAdhkar: false,
    duha: false,
    eveningAdhkar: false,
    tahajjud: false,
    fasting: false,
  };
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface WorshipState {
  records: Record<string, WorshipDay>;
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (field: keyof WorshipDay, dateOverride?: string) => Promise<void>;
  getDay: (date: string) => WorshipDay;
  getStreak: () => number;
  getMonthStats: (
    year: number,
    month: number,
  ) => { date: string; completion: number }[];
}

export const useWorshipStore = create<WorshipState>((set, get) => ({
  records: {},
  loaded: false,

  load: async () => {
    const all = await getAllFromStore<WorshipDay>("worship-records");
    const map: Record<string, WorshipDay> = {};
    for (const r of all) {
      map[r.date] = r;
    }
    set({ records: map, loaded: true });
  },

  toggle: async (field, dateOverride?: string) => {
    const key = dateOverride ?? todayKey();
    const current = get().records[key] ?? emptyDay(key);
    const next = { ...current, [field]: !current[field] };
    await putInStore("worship-records", key, next);
    set({ records: { ...get().records, [key]: next } });
  },

  getDay: (date) => {
    return get().records[date] ?? emptyDay(date);
  },

  getStreak: () => {
    const records = get().records;
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const day = records[key];
      if (day) {
        const completed = worshipCompletion(day);
        if (completed >= 1) {
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
    const stats: { date: string; completion: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const day = records[key];
      stats.push({
        date: key,
        completion: day ? worshipCompletion(day) : 0,
      });
    }
    return stats;
  },
}));

const WORSHIP_FIELDS: (keyof WorshipDay)[] = [
  "quranRead",
  "morningAdhkar",
  "duha",
  "eveningAdhkar",
  "tahajjud",
  "fasting",
];

export function worshipCompletion(day: WorshipDay): number {
  const total = WORSHIP_FIELDS.length;
  const done = WORSHIP_FIELDS.filter((f) => day[f] === true).length;
  return done / total;
}

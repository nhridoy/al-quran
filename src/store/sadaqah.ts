import { create } from "zustand";
import { deleteFromStore, getAllFromStore, putInStore } from "@/lib/cache";

export interface SadaqahEntry {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  timestamp: number;
}

export const CATEGORIES = [
  "Sadaqah",
  "Zakat",
  "Sponsorship",
  "Emergency",
  "Other",
];

interface SadaqahState {
  entries: SadaqahEntry[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (entry: Omit<SadaqahEntry, "id" | "timestamp">) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getMonthlyTotal: (year: number, month: number) => number;
  getYearlyTotal: (year: number) => number;
  getCategoryTotals: (
    year: number,
    month: number,
  ) => { category: string; total: number }[];
}

export const useSadaqahStore = create<SadaqahState>((set, get) => ({
  entries: [],
  loaded: false,

  load: async () => {
    const all = await getAllFromStore<SadaqahEntry>("sadaqah-records");
    all.sort((a, b) => b.timestamp - a.timestamp);
    set({ entries: all, loaded: true });
  },

  add: async (entry) => {
    const id = `sadaqah-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const record: SadaqahEntry = { ...entry, id, timestamp: Date.now() };
    await putInStore("sadaqah-records", id, record);
    const current = get().entries;
    set({ entries: [record, ...current] });
  },

  remove: async (id) => {
    await deleteFromStore("sadaqah-records", id);
    const current = get().entries;
    set({ entries: current.filter((e) => e.id !== id) });
  },

  getMonthlyTotal: (year, month) => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    return get()
      .entries.filter((e) => e.date.startsWith(prefix))
      .reduce((sum, e) => sum + e.amount, 0);
  },

  getYearlyTotal: (year) => {
    const prefix = `${year}-`;
    return get()
      .entries.filter((e) => e.date.startsWith(prefix))
      .reduce((sum, e) => sum + e.amount, 0);
  },

  getCategoryTotals: (year, month) => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    const monthly = get().entries.filter((e) => e.date.startsWith(prefix));
    return CATEGORIES.map((category) => ({
      category,
      total: monthly
        .filter((e) => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0),
    })).filter((c) => c.total > 0);
  },
}));

import { create } from "zustand";
import { getFromStore, putInStore } from "@/lib/cache";
import { formatDateKey } from "@/lib/date";
import { SURAH_COUNT } from "@/lib/const";

export interface ReadingRecord {
  id: string;
  surahNo: number;
  juzNo: number;
  date: string;
}

const JUZ_COUNT = 30;

interface ReadingState {
  records: ReadingRecord[];
  loaded: boolean;
  load: () => Promise<void>;
  toggleSurah: (surahNo: number, juzNo: number) => Promise<void>;
  isSurahRead: (surahNo: number) => boolean;
  getSurahCount: () => number;
  getJuzCount: () => number;
  getMonthStats: (year: number, month: number) => number;
}

export function formatPercentageRead(count: number): string {
  return `${Math.round((count / SURAH_COUNT) * 100)}%`;
}

export const useReadingStore = create<ReadingState>((set, get) => ({
  records: [],
  loaded: false,

  load: async () => {
    const stored = await getFromStore<ReadingRecord[] | ReadingRecord[][]>(
      "quran-progress",
      "all",
    );
    let all: ReadingRecord[];
    if (Array.isArray(stored)) {
      all =
        stored.length > 0 && Array.isArray(stored[0])
          ? (stored as ReadingRecord[][]).flat()
          : (stored as ReadingRecord[]);
    } else {
      all = [];
    }
    set({ records: all, loaded: true });
  },

  toggleSurah: async (surahNo, juzNo) => {
    const current = get().records;
    const existing = current.find((r) => r.surahNo === surahNo);
    let next: ReadingRecord[];
    if (existing) {
      next = current.filter((r) => r.surahNo !== surahNo);
    } else {
      const date = formatDateKey(new Date());
      const record: ReadingRecord = {
        id: String(surahNo),
        surahNo,
        juzNo,
        date,
      };
      next = [...current, record];
    }
    await putInStore("quran-progress", "all", next);
    set({ records: next });
  },

  isSurahRead: (surahNo) => {
    return get().records.some((r) => r.surahNo === surahNo);
  },

  getSurahCount: () => {
    return get().records.length;
  },

  getJuzCount: () => {
    const juzSet = new Set(get().records.map((r) => r.juzNo));
    return juzSet.size;
  },

  getMonthStats: (year, month) => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    return get().records.filter((r) => r.date.startsWith(prefix)).length;
  },
}));

export { JUZ_COUNT, SURAH_COUNT };

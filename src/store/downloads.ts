import { create } from "zustand";
import { getFromStore, putInStore } from "../lib/db";

interface DownloadItem {
  surahNo: number;
  qariId: string;
  surahName: string;
  totalAyahs: number;
  downloadedAyahs: number;
  progress: number;
}

interface DownloadsState {
  loaded: boolean;
  items: DownloadItem[];
  load: () => Promise<void>;
  add: (item: DownloadItem) => Promise<void>;
  update: (
    surahNo: number,
    qariId: string,
    partial: Partial<DownloadItem>,
  ) => Promise<void>;
  remove: (surahNo: number, qariId: string) => Promise<void>;
  isDownloaded: (surahNo: number, qariId?: string) => boolean;
}

const STORE_KEY = "downloads";

export const useDownloadsStore = create<DownloadsState>((set, get) => ({
  loaded: false,
  items: [],

  load: async () => {
    const saved = await getFromStore<DownloadItem[]>("settings", STORE_KEY);
    if (saved) {
      set({ items: saved, loaded: true });
    } else {
      set({ loaded: true });
    }
  },

  add: async (item) => {
    const items = [...get().items, item];
    await putInStore("settings", STORE_KEY, items);
    set({ items });
  },

  update: async (surahNo, qariId, partial) => {
    const items = get().items.map((i) =>
      i.surahNo === surahNo && i.qariId === qariId ? { ...i, ...partial } : i,
    );
    await putInStore("settings", STORE_KEY, items);
    set({ items });
  },

  remove: async (surahNo, qariId) => {
    const items = get().items.filter(
      (i) => i.surahNo !== surahNo || i.qariId !== qariId,
    );
    await putInStore("settings", STORE_KEY, items);
    set({ items });
  },

  isDownloaded: (surahNo, qariId) => {
    const all = get().items;
    if (qariId) {
      return all.some(
        (i) =>
          i.surahNo === surahNo && i.qariId === qariId && i.progress === 100,
      );
    }
    return all.some((i) => i.surahNo === surahNo && i.progress === 100);
  },
}));

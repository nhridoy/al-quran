import { create } from "zustand";
import { deleteFromStore, getAllFromStore, putInStore } from "../lib/db";

export interface Bookmark {
  id: string;
  surahNo: number;
  ayahNo: number;
  surahName: string;
  enName: string;
  arabicText: string;
  enText?: string;
  bnText?: string;
  timestamp: number;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (bookmark: Omit<Bookmark, "timestamp">) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  loaded: false,

  load: async () => {
    const all = await getAllFromStore<Bookmark>("bookmarks");
    all.sort((a, b) => b.timestamp - a.timestamp);
    set({ bookmarks: all, loaded: true });
  },

  add: async (bookmark) => {
    const entry: Bookmark = { ...bookmark, timestamp: Date.now() };
    await putInStore("bookmarks", entry.id, entry);
    const current = get().bookmarks;
    set({ bookmarks: [entry, ...current] });
  },

  remove: async (id) => {
    await deleteFromStore("bookmarks", id);
    const current = get().bookmarks;
    set({ bookmarks: current.filter((b) => b.id !== id) });
  },
}));

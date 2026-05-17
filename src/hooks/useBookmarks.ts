import { useCallback, useEffect, useState } from "react";
import { deleteFromStore, getAllFromStore, putInStore } from "../lib/db";

export interface Bookmark {
  id: string;
  surahNo: number;
  ayahNo: number;
  surahName: string;
  enName: string;
  arabicText: string;
  timestamp: number;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const refresh = useCallback(async () => {
    const all = await getAllFromStore<Bookmark>("bookmarks");
    all.sort((a, b) => b.timestamp - a.timestamp);
    setBookmarks(all);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBookmark = useCallback(
    async (bookmark: Omit<Bookmark, "timestamp">) => {
      const entry: Bookmark = { ...bookmark, timestamp: Date.now() };
      await putInStore("bookmarks", entry.id, entry);
      await refresh();
    },
    [refresh],
  );

  const removeBookmark = useCallback(
    async (id: string) => {
      await deleteFromStore("bookmarks", id);
      await refresh();
    },
    [refresh],
  );

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks],
  );

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, refresh };
}

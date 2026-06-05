import { useCallback } from "react";
import { useBookmarkStore, useIsBookmarked } from "@/store/bookmarks";
import type { SurahData, Verse } from "@/types";

export function useAyahBookmark(
  ayah: Verse,
  surah?: SurahData,
  surahNo?: number,
) {
  const ayahId = `${surah?.no || surahNo || 0}-${ayah.numberInSurah}`;
  const isBookmarked = useIsBookmarked(ayahId);
  const addBookmark = useBookmarkStore((s) => s.add);
  const removeBookmark = useBookmarkStore((s) => s.remove);

  const handleToggleBookmark = useCallback(() => {
    if (isBookmarked) {
      removeBookmark(ayahId);
    } else if (surah || surahNo) {
      addBookmark({
        id: ayahId,
        surahNo: surah?.no ?? surahNo ?? 0,
        ayahNo: ayah.numberInSurah,
        surahName: surah?.name || "",
        enName: surah?.enName || "",
        arabicText: ayah.text.arText,
        enText: ayah.text.enText,
        bnText: ayah.text.bnText,
      });
    }
  }, [isBookmarked, ayahId, surah, surahNo, ayah, addBookmark, removeBookmark]);

  return { ayahId, isBookmarked, handleToggleBookmark };
}

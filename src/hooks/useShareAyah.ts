import { useCallback } from "react";
import type { SurahData, Verse } from "@/types";

export function useShareAyah(ayah: Verse, surah?: SurahData) {
  const handleShare = useCallback(() => {
    const text = `${ayah.text.arText}\n\n${ayah.text.enText}\n${ayah.text.enTextTransliteration}\n\n— ${surah?.enName || ""} ${ayah.numberInSurah}`;
    if (navigator.share) {
      navigator.share({ title: "Al Quran", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, [ayah, surah]);

  return { handleShare };
}

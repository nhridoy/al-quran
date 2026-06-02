import type { SurahData, Verse } from "@/types";

export interface VerseResult {
  surahNo: number;
  surahName: string;
  enName: string;
  verse: Verse;
}

export function searchSurahs(
  query: string,
  surahList: SurahData[],
  maxResults = 8,
): SurahData[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return surahList
    .filter(
      (surah) =>
        surah.enName.toLowerCase().includes(q) ||
        surah.name.toLowerCase().includes(q) ||
        surah.enNameTranslation.toLowerCase().includes(q) ||
        surah.bnNameTranslation.toLowerCase().includes(q) ||
        `${surah.no}`.includes(q),
    )
    .slice(0, maxResults);
}

export function searchVerses(
  query: string,
  surahs: Record<string, SurahData>,
  maxResults = 30,
): VerseResult[] {
  if (!query) return [];
  const q = query.toLowerCase();
  const results: VerseResult[] = [];
  for (const surah of Object.values(surahs)) {
    for (const verse of surah.verses) {
      if (
        verse.text.arText.toLowerCase().includes(q) ||
        verse.text.enText.toLowerCase().includes(q) ||
        verse.text.bnText.toLowerCase().includes(q)
      ) {
        results.push({
          surahNo: surah.no,
          surahName: surah.name,
          enName: surah.enName,
          verse,
        });
        if (results.length >= maxResults) break;
      }
    }
    if (results.length >= maxResults) break;
  }
  return results;
}

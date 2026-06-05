import type { SurahData } from "@/types";
import type { Track } from "./types";

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function buildPlaylistFromSurahs(surahsData: SurahData[]): Track[] {
  const tracks: Track[] = [];
  for (const surahData of surahsData) {
    for (const verse of surahData.verses) {
      if (!verse.audio?.primary) continue;
      const { primary, secondary, tertiary, alternative } = verse.audio;
      tracks.push({
        id: `${surahData.no}-${verse.numberInSurah}`,
        surahNo: surahData.no,
        ayahNumber: verse.numberInSurah,
        totalNumber: verse.totalNumber,
        surahName: surahData.name,
        enName: surahData.enName,
        arabicText: verse.text.arText,
        translationText: verse.text.enText,
        transliterationText: verse.text.enTextTransliteration,
        audioUrl: primary,
        fallbackUrls: [secondary, tertiary, alternative].filter(
          (u) => u && u !== primary,
        ),
      });
    }
  }
  return tracks;
}

export function buildPlaylistFromSurah(surahData: SurahData): Track[] {
  return buildPlaylistFromSurahs([surahData]);
}

export function createShuffledIndices(
  length: number,
  startIndex: number,
): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  if (startIndex >= 0) {
    const remaining = indices.filter((i) => i !== startIndex);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    return [startIndex, ...remaining];
  }
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

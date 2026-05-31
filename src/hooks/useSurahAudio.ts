import { useCallback } from "react";
import { buildPlaylistFromSurah } from "../components/features/AudioPlayer";
import { getAudioData, mergeAudioWithSurah } from "../lib/db";
import { useSettings } from "../store/settings";
import type { SurahData } from "../types";
import type { Track } from "../components/features/AudioPlayer";

export function useSurahAudio(surah: SurahData | undefined) {
  const reciterId = useSettings((s) => s.reciterId);

  const fetchAudio = useCallback(async (): Promise<Track[]> => {
    if (!surah) return [];
    const audioUrls = await getAudioData(reciterId, surah.no);
    if (audioUrls.length === 0) return [];
    const merged = await mergeAudioWithSurah(surah, audioUrls);
    return buildPlaylistFromSurah(merged);
  }, [reciterId, surah]);

  return { fetchAudio };
}

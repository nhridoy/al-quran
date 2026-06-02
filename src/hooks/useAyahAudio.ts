import { useCallback, useRef } from "react";
import type { Track } from "@/components/features/AudioPlayer";
import {
  useAudioPlayerActions,
  useAudioPlayerState,
} from "@/components/features/AudioPlayer";
import { useSurahAudio } from "@/hooks/useSurahAudio";
import type { SurahData, Verse } from "@/types";

export function useAyahAudio(
  ayah: Verse,
  surah?: SurahData,
  tracklist?: Track[],
  surahNo?: number,
) {
  const { currentTrack, isPlaying } = useAudioPlayerState();
  const { togglePlay, setPlaylist } = useAudioPlayerActions();
  const { fetchAudio } = useSurahAudio(surah);
  const audioPromiseRef = useRef<Promise<Track[]> | null>(null);

  const isCurrentAyah = currentTrack?.totalNumber === ayah.totalNumber;
  const isThisAyahPlaying = isCurrentAyah && isPlaying;

  const handlePlay = useCallback(() => {
    if (isCurrentAyah) {
      togglePlay();
      return;
    }
    if (tracklist && surahNo !== undefined) {
      const idx = tracklist.findIndex(
        (t) => t.surahNo === surahNo && t.ayahNumber === ayah.numberInSurah,
      );
      setPlaylist(tracklist, Math.max(idx, 0));
      return;
    }
    if (!surah) return;
    const idx = ayah.numberInSurah - 1;
    audioPromiseRef.current ??= fetchAudio();
    audioPromiseRef.current.then((tracks) => {
      if (tracks.length > 0) setPlaylist(tracks, idx);
    });
  }, [
    isCurrentAyah,
    togglePlay,
    tracklist,
    surahNo,
    ayah,
    surah,
    setPlaylist,
    fetchAudio,
  ]);

  return { isCurrentAyah, isThisAyahPlaying, handlePlay };
}

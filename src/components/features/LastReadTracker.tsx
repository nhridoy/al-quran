import { useEffect } from "react";
import { AUDIO_INDEX_KEY } from "@/lib/const";
import { useAudioProgressStore } from "@/store/audio";
export default function LastReadTracker() {
  const currentTrack = useAudioProgressStore((s) => s.currentTrack);

  useEffect(() => {
    if (!currentTrack) return;
    localStorage.setItem(
      AUDIO_INDEX_KEY,
      JSON.stringify({
        surahName: currentTrack.enName,
        verseNumber: currentTrack.ayahNumber,
      }),
    );
  }, [currentTrack]);

  return null;
}

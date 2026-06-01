import { useEffect } from "react";
import { useAudioProgressStore } from "@/store/audio";

export default function LastReadTracker() {
  const currentTrack = useAudioProgressStore((s) => s.currentTrack);

  useEffect(() => {
    if (!currentTrack) return;
    localStorage.setItem(
      "currentAudioIndex",
      JSON.stringify({
        surahName: currentTrack.enName,
        verseNumber: currentTrack.ayahNumber,
      }),
    );
  }, [currentTrack]);

  return null;
}

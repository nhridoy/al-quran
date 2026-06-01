import { useEffect } from "react";
import { useAudioProgressStore } from "@/store/audio";

export default function LastReadTracker() {
  const currentTrack = useAudioProgressStore((s) => s.currentTrack);
  const setLastRead = useAudioProgressStore((s) => s.setLastRead);

  useEffect(() => {
    if (!currentTrack) return;
    setLastRead({
      surahName: currentTrack.enName ?? "",
      verseNumber: currentTrack.ayahNumber ?? 0,
    });
  }, [currentTrack, setLastRead]);

  return null;
}

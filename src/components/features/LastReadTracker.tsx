import { useEffect } from "react";
import { useAudioStore } from "@/store/audio";

export default function LastReadTracker() {
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const setLastRead = useAudioStore((s) => s.setLastRead);

  useEffect(() => {
    if (!currentTrack) return;
    setLastRead({
      surahName: currentTrack.enName ?? "",
      verseNumber: currentTrack.ayahNumber ?? 0,
    });
  }, [currentTrack, setLastRead]);

  return null;
}

import { useEffect } from "react";
import { useAudioPlayer } from "./AudioPlayer/index";

export default function LastReadTracker() {
  const { currentTrack } = useAudioPlayer();

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

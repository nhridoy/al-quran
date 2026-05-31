import { useEffect } from "react";
import { useAudioPlayerState } from "./AudioPlayer/index";

export default function LastReadTracker() {
  const { currentTrack } = useAudioPlayerState();

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

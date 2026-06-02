import { memo, useCallback, useEffect, useState } from "react";
import { useAudioVolumeStore } from "@/store/audio";
import {
  useAudioPlayerActions,
  useAudioPlayerState,
} from "./AudioPlayerContext";
import DesktopPlayerContent from "./DesktopPlayerContent";
import MobilePlayerContent from "./MobilePlayerContent";
import TopProgressBar from "./TopProgressBar";

const MemoizedDesktopContent = memo(DesktopPlayerContent);
const MemoizedMobileContent = memo(MobilePlayerContent);

export default function ExpandedPlayer() {
  const [leaving, setLeaving] = useState(false);
  const {
    isExpanded,
    isPlaying,
    isLoading,
    currentTrack,
    isShuffled,
    repeatMode,
  } = useAudioPlayerState();
  const volume = useAudioVolumeStore((s) => s.volume);
  const {
    minimize,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    cycleRepeat,
    setVolume,
    togglePlaylist,
  } = useAudioPlayerActions();

  const handleMinimize = useCallback(() => {
    setLeaving(true);
    setTimeout(() => {
      minimize();
      setLeaving(false);
    }, 300);
  }, [minimize]);

  const handleTogglePlay = useCallback(() => togglePlay(), [togglePlay]);
  const handlePrev = useCallback(() => prev(), [prev]);
  const handleNext = useCallback(() => next(), [next]);
  const handleToggleShuffle = useCallback(
    () => toggleShuffle(),
    [toggleShuffle],
  );
  const handleCycleRepeat = useCallback(() => cycleRepeat(), [cycleRepeat]);
  const handleSetVolume = useCallback((v: number) => setVolume(v), [setVolume]);
  const handleMuteToggle = useCallback(
    () => setVolume(volume === 0 ? 0.7 : 0),
    [setVolume, volume],
  );
  const handleTogglePlaylist = useCallback(
    () => togglePlaylist(),
    [togglePlaylist],
  );

  useEffect(() => {
    if (isExpanded) setLeaving(false);
  }, [isExpanded]);

  if ((!isExpanded && !leaving) || !currentTrack) return null;

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 hidden border-t border-border bg-surface/95 shadow-2xl backdrop-blur-lg dark:border-dark-border dark:bg-dark-surface/95 md:block ${
          leaving
            ? "translate-y-full opacity-0 transition-all duration-300 ease-in-out"
            : "animate-slide-up"
        }`}
      >
        <TopProgressBar />
        <MemoizedDesktopContent
          isPlaying={isPlaying}
          isLoading={isLoading}
          currentTrack={currentTrack}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          volume={volume}
          togglePlay={handleTogglePlay}
          prev={handlePrev}
          next={handleNext}
          toggleShuffle={handleToggleShuffle}
          cycleRepeat={handleCycleRepeat}
          setVolume={handleSetVolume}
          togglePlaylist={handleTogglePlaylist}
          onMinimize={handleMinimize}
          muteToggle={handleMuteToggle}
        />
      </div>

      <div
        className={`fixed inset-0 z-50 flex flex-col md:hidden ${
          leaving
            ? "opacity-0 transition-all duration-300 ease-in-out"
            : "animate-fade-in"
        }`}
      >
        <MemoizedMobileContent
          isPlaying={isPlaying}
          isLoading={isLoading}
          currentTrack={currentTrack}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          togglePlay={handleTogglePlay}
          prev={handlePrev}
          next={handleNext}
          toggleShuffle={handleToggleShuffle}
          cycleRepeat={handleCycleRepeat}
          togglePlaylist={handleTogglePlaylist}
          onMinimize={handleMinimize}
        />
      </div>
    </>
  );
}

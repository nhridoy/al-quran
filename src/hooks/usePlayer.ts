import { useCallback } from "react";
import { useMusic } from "../context/MusicContext";

export const usePlayer = () => {
  const music = useMusic();

  const handlePlayTrack = useCallback(
    (index: number) => {
      music.playTrack(index);
    },
    [music],
  );

  const handleTogglePlayPause = useCallback(() => {
    if (music.isPlaying) {
      music.pause();
    } else {
      music.play();
    }
  }, [music.isPlaying, music.pause, music.play]);

  const handleNextTrack = useCallback(() => {
    music.playNext();
  }, [music]);

  const handlePrevTrack = useCallback(() => {
    music.playPrev();
  }, [music]);

  const handleSeek = useCallback(
    (time: number) => {
      music.setCurrentTime(time);
    },
    [music],
  );

  const handleToggleShuffle = useCallback(() => {
    music.toggleShuffle();
  }, [music]);

  const handleCycleRepeat = useCallback(() => {
    const modes: ("off" | "one" | "all")[] = ["off", "all", "one"];
    const currentIndex = modes.indexOf(music.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    music.setRepeatMode(modes[nextIndex]);
  }, [music]);

  const formatTime = (time: number): string => {
    if (!time || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    // State
    currentTrack: music.currentTrack,
    isPlaying: music.isPlaying,
    currentTime: music.currentTime,
    duration: music.duration,
    isShuffle: music.isShuffle,
    repeatMode: music.repeatMode,
    playlist: music.playlist,
    currentTrackIndex: music.currentTrackIndex,
    isPlayerOpen: music.isPlayerOpen,
    playbackRate: music.playbackRate,

    // Actions
    playTrack: handlePlayTrack,
    togglePlayPause: handleTogglePlayPause,
    playNext: handleNextTrack,
    playPrev: handlePrevTrack,
    seek: handleSeek,
    toggleShuffle: handleToggleShuffle,
    cycleRepeat: handleCycleRepeat,
    setIsPlayerOpen: music.setIsPlayerOpen,
    setPlaybackRate: music.setPlaybackRate,
    setPlaylist: music.setPlaylist,

    // Utilities
    formatTime,
  };
};

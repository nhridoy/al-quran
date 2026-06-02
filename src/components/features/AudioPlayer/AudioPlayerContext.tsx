import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PREV_TRACK_THRESHOLD } from "@/lib/const";
import { useAudioProgressStore, useAudioVolumeStore } from "@/store/audio";
import { createShuffledIndices } from "./audioUtils";
import type {
  AudioPlayerActions,
  AudioPlayerContextType,
  AudioPlayerState,
  RepeatMode,
  Track,
} from "./types";
import { useAudioElement } from "./useAudioElement";

const AudioPlayerStateContext = createContext<AudioPlayerState | null>(null);
const AudioPlayerActionsContext = createContext<AudioPlayerActions | null>(
  null,
);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const isPlayingRef = useRef(false);
  const currentTrackRef = useRef<Track | null>(null);
  const playlistRef = useRef<Track[]>([]);
  const activeIndexRef = useRef(0);
  const repeatModeRef = useRef<RepeatMode>("none");
  const playByIndexRef = useRef<(index: number) => void>(() => {});
  const shuffleIndicesRef = useRef<number[]>([]);
  const shuffleCursorRef = useRef(0);
  const fallbackIndexRef = useRef(0);
  const playGenRef = useRef(0);
  const isShuffleActiveRef = useRef(false);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    currentTrackRef.current = currentTrack;
    useAudioProgressStore.getState().setCurrentTrack(currentTrack);
  }, [currentTrack]);
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);
  useEffect(() => {
    isShuffleActiveRef.current = isShuffleActive;
  }, [isShuffleActive]);

  useAudioElement(audioRef, {
    playByIndexRef,
    currentTrackRef,
    playlistRef,
    activeIndexRef,
    repeatModeRef,
    shuffleIndicesRef,
    shuffleCursorRef,
    fallbackIndexRef,
    playGenRef,
    isPlayingRef,
    setIsPlaying,
    setIsLoading,
  });

  const playByIndex = useCallback((index: number) => {
    const tracks = playlistRef.current;
    if (!tracks[index]) return;
    const track = tracks[index];
    setActiveIndex(index);
    activeIndexRef.current = index;
    setCurrentTrack(track);
    currentTrackRef.current = track;
    fallbackIndexRef.current = 0;
    setIsLoading(true);
    const audio = audioRef.current;
    if (!audio) return;
    const gen = ++playGenRef.current;
    audio.src = track.audioUrl;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        if (playGenRef.current !== gen) return;
        setIsPlaying(true);
        isPlayingRef.current = true;
      })
      .catch(() => {
        if (playGenRef.current !== gen) return;
        setIsPlaying(false);
        isPlayingRef.current = false;
      });
  }, []);

  useEffect(() => {
    playByIndexRef.current = playByIndex;
  }, [playByIndex]);

  const playTrack = useCallback((track: Track) => {
    const tracks = playlistRef.current;
    const foundIndex = tracks.findIndex((t) => t.id === track.id);
    if (foundIndex !== -1) {
      playByIndexRef.current(foundIndex);
      return;
    }
    setPlaylist([track]);
    playlistRef.current = [track];
    setActiveIndex(0);
    activeIndexRef.current = 0;
    setCurrentTrack(track);
    currentTrackRef.current = track;
    fallbackIndexRef.current = 0;
    const audio = audioRef.current;
    if (!audio) return;
    const gen = ++playGenRef.current;
    audio.src = track.audioUrl;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        if (playGenRef.current !== gen) return;
        setIsPlaying(true);
        isPlayingRef.current = true;
      })
      .catch(() => {
        if (playGenRef.current !== gen) return;
        setIsPlaying(false);
        isPlayingRef.current = false;
      });
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrackRef.current) return;
    if (isPlayingRef.current) {
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        })
        .catch(() => {});
    }
  }, []);

  const next = useCallback(() => {
    const tracks = playlistRef.current;
    if (tracks.length === 0) return;
    let nextIndex: number;
    if (isShuffleActiveRef.current) {
      shuffleCursorRef.current++;
      if (shuffleCursorRef.current >= shuffleIndicesRef.current.length) {
        shuffleIndicesRef.current = createShuffledIndices(tracks.length, -1);
        shuffleCursorRef.current = 0;
      }
      nextIndex = shuffleIndicesRef.current[shuffleCursorRef.current];
    } else {
      nextIndex = (activeIndexRef.current + 1) % tracks.length;
    }
    playByIndexRef.current(nextIndex);
  }, []);

  const prev = useCallback(() => {
    const tracks = playlistRef.current;
    if (tracks.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > PREV_TRACK_THRESHOLD) {
      audio.currentTime = 0;
      return;
    }
    let prevIndex: number;
    if (isShuffleActiveRef.current) {
      if (shuffleCursorRef.current > 0) {
        shuffleCursorRef.current--;
      }
      prevIndex = shuffleIndicesRef.current[shuffleCursorRef.current];
    } else {
      prevIndex = (activeIndexRef.current - 1 + tracks.length) % tracks.length;
    }
    playByIndexRef.current(prevIndex);
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      useAudioProgressStore.getState().setCurrentTime(time);
    }
  }, []);

  const updateVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
    useAudioVolumeStore.getState().setVolume(newVolume);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffleActive((prev) => {
      if (!prev) {
        const tracks = playlistRef.current;
        const index = activeIndexRef.current;
        if (tracks.length > 0) {
          shuffleIndicesRef.current = createShuffledIndices(
            tracks.length,
            index,
          );
          shuffleCursorRef.current = 0;
        }
      } else {
        shuffleIndicesRef.current = [];
        shuffleCursorRef.current = 0;
      }
      return !prev;
    });
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "none") return "all";
      if (prev === "all") return "one";
      return "none";
    });
  }, []);

  const updatePlaylist = useCallback((tracks: Track[], startIndex = 0) => {
    setPlaylist(tracks);
    playlistRef.current = tracks;
    if (tracks.length > 0 && tracks[startIndex]) {
      if (shuffleIndicesRef.current.length > 0) {
        shuffleIndicesRef.current = createShuffledIndices(
          tracks.length,
          startIndex,
        );
        shuffleCursorRef.current = 0;
      }
      playByIndexRef.current(startIndex);
    }
  }, []);

  const expand = useCallback(() => setIsExpanded(true), []);
  const minimize = useCallback(() => setIsExpanded(false), []);
  const togglePlaylist = useCallback(() => setShowPlaylist((p) => !p), []);

  const stateValue = useMemo<AudioPlayerState>(
    () => ({
      isExpanded,
      isPlaying,
      isLoading,
      currentTrack,
      playlist,
      currentIndex: activeIndex,
      isShuffled: isShuffleActive,
      repeatMode,
      showPlaylist,
    }),
    [
      isExpanded,
      isPlaying,
      isLoading,
      currentTrack,
      playlist,
      activeIndex,
      isShuffleActive,
      repeatMode,
      showPlaylist,
    ],
  );

  const actionsValue = useMemo<AudioPlayerActions>(
    () => ({
      playTrack,
      togglePlay,
      next,
      prev,
      setVolume: updateVolume,
      seek,
      toggleShuffle,
      cycleRepeat,
      setPlaylist: updatePlaylist,
      expand,
      minimize,
      togglePlaylist,
      setShowPlaylist,
    }),
    [
      playTrack,
      togglePlay,
      next,
      prev,
      updateVolume,
      seek,
      toggleShuffle,
      cycleRepeat,
      updatePlaylist,
      expand,
      minimize,
      togglePlaylist,
    ],
  );

  return (
    <AudioPlayerStateContext.Provider value={stateValue}>
      <AudioPlayerActionsContext.Provider value={actionsValue}>
        {children}
      </AudioPlayerActionsContext.Provider>
    </AudioPlayerStateContext.Provider>
  );
}

export function useAudioPlayerState(): AudioPlayerState {
  const context = useContext(AudioPlayerStateContext);
  if (!context) {
    throw new Error(
      "useAudioPlayerState must be used within AudioPlayerProvider",
    );
  }
  return context;
}

export function useAudioPlayerActions(): AudioPlayerActions {
  const context = useContext(AudioPlayerActionsContext);
  if (!context) {
    throw new Error(
      "useAudioPlayerActions must be used within AudioPlayerProvider",
    );
  }
  return context;
}

export function useAudioPlayer(): AudioPlayerContextType {
  const state = useAudioPlayerState();
  const actions = useAudioPlayerActions();
  return { ...state, ...actions };
}

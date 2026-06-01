import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useAudioProgressStore,
  useAudioVolumeStore,
} from "../../../store/audio";
import type { SurahData } from "../../../types";
import type {
  AudioPlayerActions,
  AudioPlayerContextType,
  AudioPlayerState,
  RepeatMode,
  Track,
} from "./types";

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function buildPlaylistFromSurahs(surahsData: SurahData[]): Track[] {
  const tracks: Track[] = [];
  for (const surahData of surahsData) {
    for (const verse of surahData.verses) {
      if (!verse.audio?.primary) continue;
      const { primary, secondary, tertiary, alternative } = verse.audio;
      tracks.push({
        id: `${surahData.no}-${verse.numberInSurah}`,
        surahNo: surahData.no,
        ayahNumber: verse.numberInSurah,
        totalNumber: verse.totalNumber,
        surahName: surahData.name,
        enName: surahData.enName,
        arabicText: verse.text.arText,
        translationText: verse.text.enText,
        transliterationText: verse.text.enTextTransliteration,
        audioUrl: primary,
        fallbackUrls: [secondary, tertiary, alternative].filter(
          (u) => u && u !== primary,
        ),
      });
    }
  }
  return tracks;
}

export function buildPlaylistFromSurah(surahData: SurahData): Track[] {
  return buildPlaylistFromSurahs([surahData]);
}

function createShuffledIndices(length: number, startIndex: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  if (startIndex >= 0) {
    const remaining = indices.filter((i) => i !== startIndex);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    return [startIndex, ...remaining];
  }
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

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

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.preload = "metadata";

    const handleTimeUpdate = () => {
      useAudioProgressStore.getState().setCurrentTime(audio.currentTime);
    };
    const handleMetadata = () => {
      useAudioProgressStore.getState().setDuration(audio.duration);
    };
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      const track = currentTrackRef.current;
      if (track && fallbackIndexRef.current < track.fallbackUrls.length) {
        const nextUrl = track.fallbackUrls[fallbackIndexRef.current];
        fallbackIndexRef.current++;
        setIsLoading(true);
        const fbGen = ++playGenRef.current;
        audio.src = nextUrl;
        audio
          .play()
          .then(() => {
            if (playGenRef.current !== fbGen) return;
            setIsPlaying(true);
            isPlayingRef.current = true;
          })
          .catch(() => {});
        return;
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsLoading(false);
    };
    const handleEnded = () => {
      const mode = repeatModeRef.current;
      const index = activeIndexRef.current;
      const tracks = playlistRef.current;
      const shuffleOrder = shuffleIndicesRef.current;
      const hasShuffle = shuffleOrder.length > 0;

      const advanceShuffle = () => {
        shuffleCursorRef.current++;
        if (shuffleCursorRef.current >= shuffleOrder.length) {
          shuffleIndicesRef.current = createShuffledIndices(tracks.length, -1);
          shuffleCursorRef.current = 0;
        }
        return shuffleIndicesRef.current[shuffleCursorRef.current];
      };

      if (mode === "one") {
        const repGen = ++playGenRef.current;
        audio.currentTime = 0;
        audio
          .play()
          .then(() => {
            if (playGenRef.current !== repGen) return;
            setIsPlaying(true);
            isPlayingRef.current = true;
          })
          .catch(() => {});
      } else if (mode === "all") {
        const nextIndex = hasShuffle
          ? advanceShuffle()
          : (index + 1) % tracks.length;
        playByIndexRef.current(nextIndex);
      } else if (hasShuffle) {
        shuffleCursorRef.current++;
        if (shuffleCursorRef.current < shuffleOrder.length) {
          playByIndexRef.current(shuffleOrder[shuffleCursorRef.current]);
        } else {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      } else if (index < tracks.length - 1) {
        playByIndexRef.current(index + 1);
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, []);

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
    if (audio && audio.currentTime > 3) {
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

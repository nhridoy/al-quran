import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { AudioPlayerContextType, RepeatMode, Track } from "./types";

const AUDIO_BASE = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";
const VOLUME_STORAGE_KEY = "audioPlayerVolume";

export function getAudioUrl(totalNumber: number): string {
  return `${AUDIO_BASE}/${totalNumber}.mp3`;
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function buildTrack(
  surahNo: number,
  surahName: string,
  enName: string,
  verse: {
    numberInSurah: number;
    totalNumber: number;
    text: string;
    enText: string;
    enTextTransliteration: string;
    audioSecond?: string;
  },
): Track {
  return {
    id: `${surahNo}-${verse.numberInSurah}`,
    surahNo,
    ayahNumber: verse.numberInSurah,
    totalNumber: verse.totalNumber,
    surahName,
    enName,
    arabicText: verse.text,
    translationText: verse.enText,
    transliterationText: verse.enTextTransliteration,
    audioUrl: verse.audioSecond || getAudioUrl(verse.totalNumber),
  };
}

export function buildPlaylistFromSurah(surahData: {
  no: number;
  name: string;
  enName: string;
  verses: Array<{
    numberInSurah: number;
    totalNumber: number;
    text: string;
    enText: string;
    enTextTransliteration: string;
    audioSecond?: string;
  }>;
}): Track[] {
  return surahData.verses.map((verse) =>
    buildTrack(surahData.no, surahData.name, surahData.enName, verse),
  );
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

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({
  children,
  expandOnPlay = false,
}: {
  children: React.ReactNode;
  expandOnPlay?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    return saved ? Number.parseFloat(saved) : 1;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
    audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.preload = "metadata";

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleMetadata = () => setDuration(audio.duration);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
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
        audio.currentTime = 0;
        audio.play().catch(() => {});
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
    setIsLoading(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.audioUrl;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        isPlayingRef.current = true;
      })
      .catch(() => {
        setIsPlaying(false);
        isPlayingRef.current = false;
      });
  }, []);

  useEffect(() => {
    playByIndexRef.current = playByIndex;
  });

  const playTrack = useCallback(
    (track: Track) => {
      const tracks = playlistRef.current;
      const foundIndex = tracks.findIndex((t) => t.id === track.id);
      if (foundIndex !== -1) {
        playByIndex(foundIndex);
        return;
      }
      setPlaylist([track]);
      playlistRef.current = [track];
      setActiveIndex(0);
      activeIndexRef.current = 0;
      setCurrentTrack(track);
      currentTrackRef.current = track;
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = track.audioUrl;
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        })
        .catch(() => {
          setIsPlaying(false);
          isPlayingRef.current = false;
        });
    },
    [playByIndex],
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
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
  }, [isPlaying, currentTrack]);

  const next = useCallback(() => {
    const tracks = playlistRef.current;
    if (tracks.length === 0) return;
    let nextIndex: number;
    if (isShuffleActive) {
      shuffleCursorRef.current++;
      if (shuffleCursorRef.current >= shuffleIndicesRef.current.length) {
        shuffleIndicesRef.current = createShuffledIndices(tracks.length, -1);
        shuffleCursorRef.current = 0;
      }
      nextIndex = shuffleIndicesRef.current[shuffleCursorRef.current];
    } else {
      nextIndex = (activeIndexRef.current + 1) % tracks.length;
    }
    playByIndex(nextIndex);
  }, [isShuffleActive, playByIndex]);

  const prev = useCallback(() => {
    const tracks = playlistRef.current;
    if (tracks.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    let prevIndex: number;
    if (isShuffleActive) {
      if (shuffleCursorRef.current > 0) {
        shuffleCursorRef.current--;
      }
      prevIndex = shuffleIndicesRef.current[shuffleCursorRef.current];
    } else {
      prevIndex = (activeIndexRef.current - 1 + tracks.length) % tracks.length;
    }
    playByIndex(prevIndex);
  }, [isShuffleActive, playByIndex]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const updateVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
    setVolume(newVolume);
    localStorage.setItem(VOLUME_STORAGE_KEY, String(newVolume));
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

  const updatePlaylist = useCallback(
    (tracks: Track[], startIndex = 0) => {
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
        playByIndex(startIndex);
        if (expandOnPlay) setIsExpanded(true);
      }
    },
    [playByIndex, expandOnPlay],
  );

  const expand = useCallback(() => setIsExpanded(true), []);
  const minimize = useCallback(() => setIsExpanded(false), []);
  const togglePlaylist = useCallback(() => setShowPlaylist((p) => !p), []);

  const value: AudioPlayerContextType = {
    isExpanded,
    isPlaying,
    isLoading,
    currentTrack,
    playlist,
    currentIndex: activeIndex,
    volume,
    isShuffled: isShuffleActive,
    repeatMode,
    currentTime,
    duration,
    showPlaylist,
    playTrack,
    togglePlay,
    next,
    prev,
    seek,
    setVolume: updateVolume,
    toggleShuffle,
    cycleRepeat,
    setPlaylist: updatePlaylist,
    expand,
    minimize,
    togglePlaylist,
    setShowPlaylist,
    formatTime,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer(): AudioPlayerContextType {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
}

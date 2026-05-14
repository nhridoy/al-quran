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

export function getAudioUrl(totalNumber: number): string {
  return `${AUDIO_BASE}/${totalNumber}.mp3`;
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function buildTrackFromVerse(
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
    buildTrackFromVerse(surahData.no, surahData.name, surahData.enName, verse),
  );
}

function generateShuffledOrder(length: number, startIndex: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  if (startIndex >= 0) {
    const without = indices.filter((i) => i !== startIndex);
    for (let i = without.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [without[i], without[j]] = [without[j], without[i]];
    }
    return [startIndex, ...without];
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
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylistState] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem("audioPlayerVolume");
    return saved ? Number.parseFloat(saved) : 1;
  });
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const isPlayingRef = useRef(false);
  const currentTrackRef = useRef<Track | null>(null);
  const playlistRef = useRef<Track[]>([]);
  const currentIndexRef = useRef(0);
  const repeatModeRef = useRef<RepeatMode>("none");
  const playAtIndexRef = useRef<(index: number) => void>(() => {});
  const shuffledOrderRef = useRef<number[]>([]);
  const shufflePositionRef = useRef(0);

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
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.preload = "metadata";

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const onEnded = () => {
      const mode = repeatModeRef.current;
      const idx = currentIndexRef.current;
      const pl = playlistRef.current;
      const so = shuffledOrderRef.current;
      const isShuff = so.length > 0;

      const advanceShuffle = () => {
        shufflePositionRef.current++;
        if (shufflePositionRef.current >= so.length) {
          shuffledOrderRef.current = generateShuffledOrder(pl.length, -1);
          shufflePositionRef.current = 0;
        }
        return shuffledOrderRef.current[shufflePositionRef.current];
      };

      if (mode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (mode === "all") {
        if (isShuff && so.length > 0) {
          playAtIndexRef.current(advanceShuffle());
        } else {
          playAtIndexRef.current((idx + 1) % pl.length);
        }
      } else {
        if (isShuff && so.length > 0) {
          shufflePositionRef.current++;
          if (shufflePositionRef.current < so.length) {
            playAtIndexRef.current(so[shufflePositionRef.current]);
          } else {
            setIsPlaying(false);
            isPlayingRef.current = false;
          }
        } else if (idx < pl.length - 1) {
          playAtIndexRef.current(idx + 1);
        } else {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      }
    };
    const onWaiting = () => {
      setIsLoading(true);
    };
    const onCanPlay = () => {
      setIsLoading(false);
    };
    const onError = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const playAtIndex = useCallback((index: number) => {
    const pl = playlistRef.current;
    if (!pl[index]) return;
    const track = pl[index];
    setCurrentIndex(index);
    currentIndexRef.current = index;
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
    playAtIndexRef.current = playAtIndex;
  });

  const playTrack = useCallback(
    (track: Track) => {
      const pl = playlistRef.current;
      const idx = pl.findIndex((t) => t.id === track.id);
      if (idx !== -1) {
        playAtIndex(idx);
      } else {
        setPlaylistState([track]);
        playlistRef.current = [track];
        setCurrentIndex(0);
        currentIndexRef.current = 0;
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
      }
    },
    [playAtIndex],
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
    const pl = playlistRef.current;
    if (pl.length === 0) return;
    let nextIdx: number;
    if (isShuffled) {
      shufflePositionRef.current++;
      if (shufflePositionRef.current >= shuffledOrderRef.current.length) {
        shuffledOrderRef.current = generateShuffledOrder(pl.length, -1);
        shufflePositionRef.current = 0;
      }
      nextIdx = shuffledOrderRef.current[shufflePositionRef.current];
    } else {
      nextIdx = (currentIndexRef.current + 1) % pl.length;
    }
    playAtIndex(nextIdx);
  }, [isShuffled, playAtIndex]);

  const prev = useCallback(() => {
    const pl = playlistRef.current;
    if (pl.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    let prevIdx: number;
    if (isShuffled) {
      if (shufflePositionRef.current > 0) {
        shufflePositionRef.current--;
      }
      prevIdx = shuffledOrderRef.current[shufflePositionRef.current];
    } else {
      prevIdx = (currentIndexRef.current - 1 + pl.length) % pl.length;
    }
    playAtIndex(prevIdx);
  }, [isShuffled, playAtIndex]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = v;
    }
    setVolumeState(v);
    localStorage.setItem("audioPlayerVolume", String(v));
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => {
      if (!prev) {
        const pl = playlistRef.current;
        const idx = currentIndexRef.current;
        if (pl.length > 0) {
          shuffledOrderRef.current = generateShuffledOrder(pl.length, idx);
          shufflePositionRef.current = 0;
        }
      } else {
        shuffledOrderRef.current = [];
        shufflePositionRef.current = 0;
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

  const setPlaylist = useCallback(
    (tracks: Track[], startIndex = 0) => {
      setPlaylistState(tracks);
      playlistRef.current = tracks;
      if (tracks.length > 0 && tracks[startIndex]) {
        if (shuffledOrderRef.current.length > 0) {
          shuffledOrderRef.current = generateShuffledOrder(
            tracks.length,
            startIndex,
          );
          shufflePositionRef.current = 0;
        }
        playAtIndex(startIndex);
        if (expandOnPlay) setIsExpanded(true);
      }
    },
    [playAtIndex, expandOnPlay],
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
    currentIndex,
    volume,
    isShuffled,
    repeatMode,
    currentTime,
    duration,
    showPlaylist,
    playTrack,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    setPlaylist,
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
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return ctx;
}

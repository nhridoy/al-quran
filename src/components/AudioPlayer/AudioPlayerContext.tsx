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

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
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
  const [showPlaylist, setShowPlaylist] = useState(false);

  const isPlayingRef = useRef(false);
  const currentTrackRef = useRef<Track | null>(null);
  const playlistRef = useRef<Track[]>([]);
  const currentIndexRef = useRef(0);
  const repeatModeRef = useRef<RepeatMode>("none");
  const playAtIndexRef = useRef<(index: number) => void>(() => {});

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

      if (mode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (mode === "all") {
        const nextIndex = (idx + 1) % pl.length;
        playAtIndexRef.current(nextIndex);
      } else {
        if (idx < pl.length - 1) {
          playAtIndexRef.current(idx + 1);
        } else {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      }
    };
    const onError = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
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

  useEffect(() => {
    playAtIndexRef.current = playAtIndex;
  });

  const playAtIndex = useCallback(
    (index: number) => {
      if (!playlist[index]) return;
      const track = playlist[index];
      setCurrentIndex(index);
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
    [playlist],
  );

  const playTrack = useCallback(
    (track: Track) => {
      const idx = playlist.findIndex((t) => t.id === track.id);
      if (idx !== -1) {
        playAtIndex(idx);
      } else {
        setPlaylistState([track]);
        setCurrentIndex(0);
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
    [playlist, playAtIndex],
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
    if (playlist.length === 0) return;
    let nextIdx: number;
    if (isShuffled) {
      nextIdx = Math.floor(Math.random() * playlist.length);
      while (nextIdx === currentIndex && playlist.length > 1) {
        nextIdx = Math.floor(Math.random() * playlist.length);
      }
    } else {
      nextIdx = (currentIndex + 1) % playlist.length;
    }
    playAtIndex(nextIdx);
  }, [playlist, currentIndex, isShuffled, playAtIndex]);

  const prev = useCallback(() => {
    if (playlist.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    let prevIdx: number;
    if (isShuffled) {
      prevIdx = Math.floor(Math.random() * playlist.length);
      while (prevIdx === currentIndex && playlist.length > 1) {
        prevIdx = Math.floor(Math.random() * playlist.length);
      }
    } else {
      prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    playAtIndex(prevIdx);
  }, [playlist, currentIndex, isShuffled, playAtIndex]);

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
    setIsShuffled((prev) => !prev);
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
      if (tracks.length > 0) {
        playAtIndex(startIndex);
        setIsExpanded(true);
      }
    },
    [playAtIndex],
  );

  const expand = useCallback(() => setIsExpanded(true), []);
  const minimize = useCallback(() => setIsExpanded(false), []);
  const togglePlaylist = useCallback(() => setShowPlaylist((p) => !p), []);

  const value: AudioPlayerContextType = {
    isExpanded,
    isPlaying,
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

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import type { Verse } from "../types";
import { getAudioErrorMessage, getCorsAudioUrl } from "../utilities/audioUtils";

export type RepeatMode = "off" | "one" | "all";

interface CurrentTrack {
  verse: Verse;
  surahName: string;
  trackIndex: number;
}

interface MusicContextType {
  // Playlist management
  playlist: Verse[];
  currentTrackIndex: number;
  currentTrack: CurrentTrack | null;
  setPlaylist: (verses: Verse[], surahName: string) => void;

  // Playback control
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  playTrack: (index: number) => void;
  playNext: () => void;
  playPrev: () => void;

  // Audio properties
  currentTime: number;
  duration: number;
  setCurrentTime: (time: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;

  // Playback modes
  isShuffle: boolean;
  repeatMode: RepeatMode;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;

  // UI states
  isPlayerOpen: boolean;
  setIsPlayerOpen: (open: boolean) => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playlist, setPlaylistState] = useState<Verse[]>([]);
  const [surahName, setSurahName] = useState<string>("");
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const currentTrack: CurrentTrack | null =
    currentTrackIndex >= 0 && playlist[currentTrackIndex]
      ? {
          verse: playlist[currentTrackIndex],
          surahName,
          trackIndex: currentTrackIndex,
        }
      : null;

  const setPlaylist = useCallback((verses: Verse[], newSurahName: string) => {
    setPlaylistState(verses);
    setSurahName(newSurahName);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().catch(() => {
        // Handle autoplay policy restrictions
      });
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const playTrack = useCallback(
    (index: number) => {
      if (index >= 0 && index < playlist.length) {
        setCurrentTrackIndex(index);
        setCurrentTime(0);
        setIsPlaying(true);
      }
    },
    [playlist.length],
  );

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= playlist.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        return;
      }
    }

    playTrack(nextIndex);
  }, [currentTrackIndex, playlist.length, repeatMode, playTrack]);

  const playPrev = useCallback(() => {
    if (currentTrackIndex > 0) {
      playTrack(currentTrackIndex - 1);
    } else if (repeatMode === "all") {
      playTrack(playlist.length - 1);
    }
  }, [currentTrackIndex, playlist.length, repeatMode, playTrack]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const updateRepeatMode = useCallback((mode: RepeatMode) => {
    setRepeatMode(mode);
  }, []);

  // Handle audio element changes
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeatMode, playNext]);

  // Update audio source and play when currentTrack changes
  React.useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;

      // Set crossOrigin before setting src to handle CORS properly
      audio.crossOrigin = "anonymous";

      // Get CORS-friendly URL
      const audioUrl = getCorsAudioUrl(currentTrack.verse.audioPrimary);

      // Add error handler for detailed CORS debugging
      const handleError = () => {
        const errorMsg = getAudioErrorMessage(audio.error?.code);
        console.error("Audio playback error:", {
          message: errorMsg,
          url: audioUrl,
          errorCode: audio.error?.code,
        });
      };

      audio.addEventListener("error", handleError);
      audio.src = audioUrl;

      if (isPlaying) {
        audio.play().catch((err) => {
          console.error("Playback error:", err?.message);
        });
      }

      return () => {
        audio.removeEventListener("error", handleError);
      };
    }
  }, [currentTrack, isPlaying]);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const value: MusicContextType = {
    playlist,
    currentTrackIndex,
    currentTrack,
    setPlaylist,
    isPlaying,
    play,
    pause,
    playTrack,
    playNext,
    playPrev,
    currentTime,
    duration,
    setCurrentTime: (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    audioRef,
    isShuffle,
    repeatMode,
    toggleShuffle,
    setRepeatMode: updateRepeatMode,
    isPlayerOpen,
    setIsPlayerOpen,
    playbackRate,
    setPlaybackRate,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} crossOrigin="anonymous" />
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return context;
};

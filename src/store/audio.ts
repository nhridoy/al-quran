import { create } from "zustand";
import type { AudioEngine } from "@/components/features/AudioPlayer/audioEngine";
import { createDefaultAudioEngine } from "@/components/features/AudioPlayer/audioEngine";
import { createShuffledIndices } from "@/components/features/AudioPlayer/audioUtils";
import type {
  RepeatMode,
  Track,
} from "@/components/features/AudioPlayer/types";
import { REPEAT_CYCLE } from "@/components/features/AudioPlayer/types";
import {
  AUDIO_INDEX_KEY,
  LAST_READ_KEY,
  PREV_TRACK_THRESHOLD,
  VOLUME_STORAGE_KEY,
} from "@/lib/const";

export interface LastRead {
  surahName: string;
  verseNumber: number;
}

export interface AudioStore {
  isExpanded: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: Track | null;
  playlist: Track[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  showPlaylist: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  lastRead: LastRead | null;

  playTrack: (track: Track) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setPlaylist: (tracks: Track[], startIndex?: number) => void;
  expand: () => void;
  minimize: () => void;
  togglePlaylist: () => void;
  setShowPlaylist: (show: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setLastRead: (lastRead: LastRead | null) => void;
}

export const audioRef: { current: AudioEngine | null } = { current: null };
let playGen = 0;
let shuffleIndices: number[] = [];
let shuffleCursor = 0;
let fallbackIndex = 0;

function loadLastRead(): LastRead | null {
  try {
    const raw =
      localStorage.getItem(LAST_READ_KEY) ||
      localStorage.getItem(AUDIO_INDEX_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastRead;
    if (parsed?.surahName) {
      if (localStorage.getItem(AUDIO_INDEX_KEY)) {
        localStorage.setItem(LAST_READ_KEY, raw);
        localStorage.removeItem(AUDIO_INDEX_KEY);
      }
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function playByIndex(index: number) {
  const state = useAudioStore.getState();
  const track = state.playlist[index];
  if (!track) return;

  useAudioStore.setState({
    currentIndex: index,
    currentTrack: track,
    isLoading: true,
  });
  fallbackIndex = 0;

  const audio = audioRef.current;
  if (!audio) return;

  const gen = ++playGen;
  audio.src = track.audioUrl;
  audio.currentTime = 0;
  audio
    .play()
    .then(() => {
      if (playGen !== gen) return;
      useAudioStore.setState({ isPlaying: true, isLoading: false });
    })
    .catch(() => {
      if (playGen !== gen) return;
      useAudioStore.setState({ isPlaying: false, isLoading: false });
    });
}

let cleanup: (() => void) | null = null;

export function mountAudioEngine() {
  const audio = createDefaultAudioEngine();
  audioRef.current = audio;
  audio.volume = useAudioStore.getState().volume;

  const handleTimeUpdate = () => {
    useAudioStore.getState().setCurrentTime(audio.currentTime);
  };
  const handleMetadata = () => {
    useAudioStore.getState().setDuration(audio.duration);
  };
  const handleWaiting = () => {
    useAudioStore.setState({ isLoading: true });
  };
  const handleCanPlay = () => {
    useAudioStore.setState({ isLoading: false });
  };
  const handleError = () => {
    const state = useAudioStore.getState();
    const track = state.currentTrack;
    if (track && fallbackIndex < track.fallbackUrls.length) {
      const nextUrl = track.fallbackUrls[fallbackIndex];
      fallbackIndex++;
      useAudioStore.setState({ isLoading: true });
      const fbGen = ++playGen;
      audio.src = nextUrl;
      audio
        .play()
        .then(() => {
          if (playGen !== fbGen) return;
          useAudioStore.setState({ isPlaying: true, isLoading: false });
        })
        .catch(() => {});
      return;
    }
    useAudioStore.setState({ isPlaying: false, isLoading: false });
  };
  const handleEnded = () => {
    const state = useAudioStore.getState();
    const mode = state.repeatMode;
    const index = state.currentIndex;
    const tracks = state.playlist;
    const hasShuffle = shuffleIndices.length > 0;

    if (mode === "one") {
      const repGen = ++playGen;
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          if (playGen !== repGen) return;
          useAudioStore.setState({ isPlaying: true });
        })
        .catch(() => {});
    } else if (mode === "all") {
      if (hasShuffle) {
        shuffleCursor++;
        if (shuffleCursor >= shuffleIndices.length) {
          shuffleIndices = createShuffledIndices(tracks.length, -1);
          shuffleCursor = 0;
        }
        playByIndex(shuffleIndices[shuffleCursor]);
      } else {
        playByIndex((index + 1) % tracks.length);
      }
    } else if (hasShuffle) {
      shuffleCursor++;
      if (shuffleCursor < shuffleIndices.length) {
        playByIndex(shuffleIndices[shuffleCursor]);
      } else {
        useAudioStore.setState({ isPlaying: false });
      }
    } else if (index < tracks.length - 1) {
      playByIndex(index + 1);
    } else {
      useAudioStore.setState({ isPlaying: false });
    }
  };

  audio.addEventListener("timeupdate", handleTimeUpdate);
  audio.addEventListener("loadedmetadata", handleMetadata);
  audio.addEventListener("ended", handleEnded);
  audio.addEventListener("waiting", handleWaiting);
  audio.addEventListener("canplay", handleCanPlay);
  audio.addEventListener("error", handleError);

  cleanup = () => {
    audio.removeEventListener("timeupdate", handleTimeUpdate);
    audio.removeEventListener("loadedmetadata", handleMetadata);
    audio.removeEventListener("ended", handleEnded);
    audio.removeEventListener("waiting", handleWaiting);
    audio.removeEventListener("canplay", handleCanPlay);
    audio.removeEventListener("error", handleError);
    audio.destroy();
    audioRef.current = null;
  };
}

export function unmountAudioEngine() {
  cleanup?.();
  cleanup = null;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  isExpanded: false,
  isPlaying: false,
  isLoading: false,
  currentTrack: null,
  playlist: [],
  currentIndex: 0,
  isShuffled: false,
  repeatMode: "none" as RepeatMode,
  showPlaylist: false,
  currentTime: 0,
  duration: 0,
  volume: Number.parseFloat(localStorage.getItem(VOLUME_STORAGE_KEY) ?? "1"),
  lastRead: loadLastRead(),

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setLastRead: (lastRead) => {
    set({ lastRead });
    if (lastRead) {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead));
    } else {
      localStorage.removeItem(LAST_READ_KEY);
    }
  },

  playTrack: (track) => {
    const state = get();
    const foundIndex = state.playlist.findIndex((t) => t.id === track.id);
    if (foundIndex !== -1) {
      playByIndex(foundIndex);
      return;
    }
    set({
      playlist: [track],
      currentIndex: 0,
      currentTrack: track,
      isLoading: true,
    });
    fallbackIndex = 0;
    const audio = audioRef.current;
    if (!audio) return;
    const gen = ++playGen;
    audio.src = track.audioUrl;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        if (playGen !== gen) return;
        set({ isPlaying: true, isLoading: false });
      })
      .catch(() => {
        if (playGen !== gen) return;
        set({ isPlaying: false, isLoading: false });
      });
  },

  togglePlay: () => {
    const state = get();
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;
    if (state.isPlaying) {
      audio.pause();
      set({ isPlaying: false });
    } else {
      audio
        .play()
        .then(() => set({ isPlaying: true }))
        .catch(() => {});
    }
  },

  next: () => {
    const state = get();
    if (state.playlist.length === 0) return;
    let nextIndex: number;
    if (state.isShuffled) {
      shuffleCursor++;
      if (shuffleCursor >= shuffleIndices.length) {
        shuffleIndices = createShuffledIndices(state.playlist.length, -1);
        shuffleCursor = 0;
      }
      nextIndex = shuffleIndices[shuffleCursor];
    } else {
      nextIndex = (state.currentIndex + 1) % state.playlist.length;
    }
    playByIndex(nextIndex);
  },

  prev: () => {
    const state = get();
    if (state.playlist.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > PREV_TRACK_THRESHOLD) {
      audio.currentTime = 0;
      return;
    }
    let prevIndex: number;
    if (state.isShuffled) {
      if (shuffleCursor > 0) shuffleCursor--;
      prevIndex = shuffleIndices[shuffleCursor];
    } else {
      prevIndex =
        (state.currentIndex - 1 + state.playlist.length) %
        state.playlist.length;
    }
    playByIndex(prevIndex);
  },

  setVolume: (volume) => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
    localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
    set({ volume });
  },

  seek: (time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      set({ currentTime: time });
    }
  },

  toggleShuffle: () => {
    const state = get();
    if (!state.isShuffled) {
      if (state.playlist.length > 0) {
        shuffleIndices = createShuffledIndices(
          state.playlist.length,
          state.currentIndex,
        );
        shuffleCursor = 0;
      }
    } else {
      shuffleIndices = [];
      shuffleCursor = 0;
    }
    set({ isShuffled: !state.isShuffled });
  },

  cycleRepeat: () => {
    const state = get();
    const idx = REPEAT_CYCLE.indexOf(state.repeatMode);
    set({ repeatMode: REPEAT_CYCLE[(idx + 1) % REPEAT_CYCLE.length] });
  },

  setPlaylist: (tracks, startIndex = 0) => {
    set({ playlist: tracks });
    if (tracks.length > 0 && tracks[startIndex]) {
      if (shuffleIndices.length > 0) {
        shuffleIndices = createShuffledIndices(tracks.length, startIndex);
        shuffleCursor = 0;
      }
      playByIndex(startIndex);
    }
  },

  expand: () => set({ isExpanded: true }),
  minimize: () => set({ isExpanded: false }),
  togglePlaylist: () => set((s) => ({ showPlaylist: !s.showPlaylist })),
  setShowPlaylist: (show) => set({ showPlaylist: show }),
}));

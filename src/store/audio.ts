import { create } from "zustand";
import {
  AUDIO_INDEX_KEY,
  LAST_READ_KEY,
  VOLUME_STORAGE_KEY,
} from "@/lib/const";

export interface LastRead {
  surahName: string;
  verseNumber: number;
}

interface AudioVolumeState {
  volume: number;
  setVolume: (volume: number) => void;
}

interface AudioProgressState {
  currentTime: number;
  duration: number;
  currentTrack: { enName?: string; ayahNumber?: number } | null;
  lastRead: LastRead | null;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTrack: (
    track: { enName?: string; ayahNumber?: number } | null,
  ) => void;
  setLastRead: (lastRead: LastRead | null) => void;
}

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

const useAudioVolumeStore = create<AudioVolumeState>((set) => ({
  volume: Number.parseFloat(localStorage.getItem(VOLUME_STORAGE_KEY) ?? "1"),
  setVolume: (volume: number) => {
    localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
    set({ volume });
  },
}));

const useAudioProgressStore = create<AudioProgressState>((set) => ({
  currentTime: 0,
  duration: 0,
  currentTrack: null,
  lastRead: loadLastRead(),
  setCurrentTime: (currentTime: number) => set({ currentTime }),
  setDuration: (duration: number) => set({ duration }),
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  setLastRead: (lastRead) => {
    set({ lastRead });
    if (lastRead) {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead));
    } else {
      localStorage.removeItem(LAST_READ_KEY);
    }
  },
}));

export { useAudioProgressStore, useAudioVolumeStore };

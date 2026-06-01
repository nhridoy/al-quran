import { create } from "zustand";
import { VOLUME_STORAGE_KEY } from "@/lib/const";

interface AudioVolumeState {
  volume: number;
  setVolume: (volume: number) => void;
}

interface AudioProgressState {
  currentTime: number;
  duration: number;
  currentTrack: { enName?: string; ayahNumber?: number } | null;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTrack: (
    track: { enName?: string; ayahNumber?: number } | null,
  ) => void;
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
  setCurrentTime: (currentTime: number) => set({ currentTime }),
  setDuration: (duration: number) => set({ duration }),
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
}));

export type { AudioProgressState, AudioVolumeState };
export { useAudioProgressStore, useAudioVolumeStore };

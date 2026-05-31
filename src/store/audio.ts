import { create } from "zustand";
import { VOLUME_STORAGE_KEY } from "../lib/const";

interface AudioVolumeState {
  volume: number;
  setVolume: (volume: number) => void;
}

interface AudioProgressState {
  currentTime: number;
  duration: number;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
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
  setCurrentTime: (currentTime: number) => set({ currentTime }),
  setDuration: (duration: number) => set({ duration }),
}));

export type { AudioProgressState, AudioVolumeState };
export { useAudioProgressStore, useAudioVolumeStore };

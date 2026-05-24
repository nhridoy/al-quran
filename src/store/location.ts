import { create } from "zustand";

interface LocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
  requested: boolean;
  request: () => Promise<void>;
  clear: () => void;
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lng: null,
  loading: false,
  error: null,
  requested: false,

  request: async () => {
    set({ loading: true, error: null, requested: true });
    try {
      const pos = await getCurrentPosition();
      set({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to get location",
        loading: false,
      });
    }
  },

  clear: () => {
    set({ lat: null, lng: null, error: null, requested: false });
  },
}));

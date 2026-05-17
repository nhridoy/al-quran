import { create } from "zustand";
import { getFromStore, putInStore } from "../lib/db";
import type { AppSettings } from "../types";

const SETTINGS_KEY = "appSettings";

const DEFAULTS: AppSettings = {
  theme: "system",
  arabicFontSize: 1.5,
  translationFontSize: 1,
  translationLang: "en",
  qariId: "alafasy",
  prayerCalcMethod: "MWL",
  prayerAsrMethod: "shafii",
  hijriAdjust: 0,
  tajweedEnabled: false,
};

interface SettingsState extends AppSettings {
  loaded: boolean;
  load: () => Promise<void>;
  update: (partial: Partial<AppSettings>) => Promise<void>;
  reset: () => Promise<void>;
}

export const useSettings = create<SettingsState>((set, get) => ({
  ...DEFAULTS,
  loaded: false,

  load: async () => {
    const saved = await getFromStore<AppSettings>("settings", SETTINGS_KEY);
    if (saved) {
      set({ ...saved, loaded: true });
    } else {
      set({ loaded: true });
    }
  },

  update: async (partial) => {
    const current = get();
    const next = { ...current, ...partial };
    await putInStore("settings", SETTINGS_KEY, {
      theme: next.theme,
      arabicFontSize: next.arabicFontSize,
      translationFontSize: next.translationFontSize,
      translationLang: next.translationLang,
      qariId: next.qariId,
      prayerCalcMethod: next.prayerCalcMethod,
      prayerAsrMethod: next.prayerAsrMethod,
      hijriAdjust: next.hijriAdjust,
      tajweedEnabled: next.tajweedEnabled,
    } as AppSettings);
    set(partial);
  },

  reset: async () => {
    await putInStore("settings", SETTINGS_KEY, DEFAULTS);
    set({ ...DEFAULTS });
  },
}));

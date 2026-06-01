import { createPersistedStore } from "@/lib/createStore";
import { putInStore } from "@/lib/db";
import type { AppSettings } from "@/types";

const DEFAULTS: AppSettings = {
  theme: "system",
  arabicFontSize: 1.5,
  translationFontSize: 1,
  translationLang: "en",
  reciterId: "ar.alafasy",
  tafsirId: "en-tafsir-maarif-ul-quran",
  prayerCalcMethod: "MWL",
  prayerAsrMethod: "shafii",
  hijriAdjust: 0,
  tajweedEnabled: false,
  tafsirEnabled: false,
  onboardingComplete: false,
};

export const useSettings = createPersistedStore<
  AppSettings,
  {
    update: (partial: Partial<AppSettings>) => Promise<void>;
    reset: () => Promise<void>;
  }
>({ storeName: "settings", key: "appSettings" }, DEFAULTS, (set, get) => ({
  update: async (partial) => {
    const state = get();
    const { loaded, load, update, reset, ...rest } = state;
    const next = { ...rest, ...partial };
    await putInStore("settings", "appSettings", next satisfies AppSettings);
    set(partial);
  },
  reset: async () => {
    await putInStore("settings", "appSettings", { ...DEFAULTS });
    set({ ...DEFAULTS });
  },
}));

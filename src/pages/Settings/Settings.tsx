import { useCallback, useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import {
  IoBookOutline,
  IoCheckmarkCircle,
  IoColorPaletteOutline,
  IoSettingsOutline,
  IoVolumeHighOutline,
} from "react-icons/io5";
import { MdFormatColorFill, MdOutlineTranslate } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { Header } from "../../components/common/Header/Header";
import { useSurahs } from "../../hooks/useSurahs";
import {
  cacheAllAudioForReciter,
  cacheAllJuzAudioForReciter,
  cacheAllJuzTafsirFor,
  cacheAllTafsirFor,
  clearAudioCache,
  clearTafsirCache,
} from "../../lib/db";
import { useSettings } from "../../store/settings";
import { LANGUAGES, RECITERS, TAFSIR_LIST } from "../../types";

const THEME_OPTIONS = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

const LANG_OPTIONS = [
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
] as const;

const CALC_METHODS = [
  { value: "MWL", label: "Muslim World League" },
  { value: "ISNA", label: "Islamic Society of North America" },
  { value: "Egypt", label: "Egyptian General Authority" },
  { value: "UmmAlQura", label: "Umm al-Qura (Makkah)" },
  { value: "Karachi", label: "University of Islamic Sciences, Karachi" },
] as const;

function SettingCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card">
      <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
            {title}
          </h3>
          <p className="text-xs text-text-muted dark:text-dark-text-muted">
            {description}
          </p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-surface-alt p-0.5 dark:border-dark-border dark:bg-dark-surface-alt">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? "bg-white text-primary shadow-sm dark:bg-dark-surface-card dark:text-secondary-light"
              : "text-text-muted hover:text-text-primary dark:hover:text-dark-text-primary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { refresh } = useSurahs();
  const storeSettings = useSettings();
  const updateSettings = useSettings((s) => s.update);

  const [local, setLocal] = useState({
    theme: storeSettings.theme,
    arabicFontSize: storeSettings.arabicFontSize,
    translationFontSize: storeSettings.translationFontSize,
    translationLang: storeSettings.translationLang,
    reciterId: storeSettings.reciterId,
    tafsirId: storeSettings.tafsirId,
    tajweedEnabled: storeSettings.tajweedEnabled,
    prayerCalcMethod: storeSettings.prayerCalcMethod,
    prayerAsrMethod: storeSettings.prayerAsrMethod,
    hijriAdjust: storeSettings.hijriAdjust,
  });

  const hasChanges =
    local.theme !== storeSettings.theme ||
    local.arabicFontSize !== storeSettings.arabicFontSize ||
    local.translationFontSize !== storeSettings.translationFontSize ||
    local.translationLang !== storeSettings.translationLang ||
    local.reciterId !== storeSettings.reciterId ||
    local.tafsirId !== storeSettings.tafsirId ||
    local.tajweedEnabled !== storeSettings.tajweedEnabled ||
    local.prayerCalcMethod !== storeSettings.prayerCalcMethod ||
    local.prayerAsrMethod !== storeSettings.prayerAsrMethod ||
    local.hijriAdjust !== storeSettings.hijriAdjust;

  const set = useCallback(
    <K extends keyof typeof local>(key: K, value: (typeof local)[K]) => {
      setLocal((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateSettings(local);

      if (local.reciterId !== storeSettings.reciterId) {
        await clearAudioCache();
        await Promise.all([
          cacheAllAudioForReciter(local.reciterId),
          cacheAllJuzAudioForReciter(local.reciterId),
        ]);
      }

      if (local.tafsirId !== storeSettings.tafsirId) {
        await clearTafsirCache();
        await Promise.all([
          cacheAllTafsirFor(local.tafsirId),
          cacheAllJuzTafsirFor(local.tafsirId),
        ]);
      }

      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  }, [local, storeSettings, updateSettings]);

  useEffect(() => {
    setLocal({
      theme: storeSettings.theme,
      arabicFontSize: storeSettings.arabicFontSize,
      translationFontSize: storeSettings.translationFontSize,
      translationLang: storeSettings.translationLang,
      reciterId: storeSettings.reciterId,
      tafsirId: storeSettings.tafsirId,
      tajweedEnabled: storeSettings.tajweedEnabled,
      prayerCalcMethod: storeSettings.prayerCalcMethod,
      prayerAsrMethod: storeSettings.prayerAsrMethod,
      hijriAdjust: storeSettings.hijriAdjust,
    });
  }, [storeSettings]);

  const handleUpdate = useCallback(() => {
    Swal.fire({
      title: "Refresh Data?",
      text: "This will clear the cached data and fetch fresh content.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9345f2",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, refresh!",
      background: "#1a1228",
      color: "#f0ecf8",
    }).then(async (result) => {
      if (result.value) {
        setLoading(true);
        try {
          await refresh();
          toast.success("Data refreshed successfully!");
        } catch {
          toast.error("Failed to refresh data");
        }
        setLoading(false);
      }
    });
  }, [refresh]);

  const filteredTafsirs = TAFSIR_LIST.filter(
    (t) => t.lang === "en" || t.lang === "bn",
  );
  const groupedTafsirs = filteredTafsirs.reduce<
    Record<string, typeof filteredTafsirs>
  >((acc, t) => {
    const langName = LANGUAGES[t.lang] ?? t.lang;
    if (!acc[langName]) acc[langName] = [];
    acc[langName].push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <Header head="Settings" />
      <div className="mx-4 space-y-4 pb-8 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Settings
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Manage application data and preferences
          </p>
        </div>

        {/* Appearance */}
        <SettingCard
          icon={
            <IoColorPaletteOutline className="text-lg text-primary dark:text-secondary-light" />
          }
          title="Appearance"
          description="Theme and font size preferences"
        >
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
                Theme
              </p>
              <SegmentedControl
                options={THEME_OPTIONS}
                value={local.theme}
                onChange={(v) => set("theme", v)}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
                Arabic Font Size: {local.arabicFontSize.toFixed(2)}x
              </p>
              <input
                type="range"
                min="1"
                max="2"
                step="0.125"
                value={local.arabicFontSize}
                onChange={(e) =>
                  set("arabicFontSize", Number.parseFloat(e.target.value))
                }
                className="w-full accent-secondary"
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
                Translation Font Size: {local.translationFontSize.toFixed(2)}x
              </p>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.125"
                value={local.translationFontSize}
                onChange={(e) =>
                  set("translationFontSize", Number.parseFloat(e.target.value))
                }
                className="w-full accent-secondary"
              />
            </div>
          </div>
        </SettingCard>

        {/* Reading */}
        <SettingCard
          icon={
            <MdOutlineTranslate className="text-lg text-primary dark:text-secondary-light" />
          }
          title="Reading"
          description="Language and reciter preferences"
        >
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
                Translation Language
              </p>
              <SegmentedControl
                options={LANG_OPTIONS}
                value={local.translationLang}
                onChange={(v) => set("translationLang", v)}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
                Reciter
              </p>
              <select
                value={local.reciterId}
                onChange={(e) => set("reciterId", e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
              >
                {RECITERS.map((reciter) => (
                  <option key={reciter.identifier} value={reciter.identifier}>
                    {reciter.englishName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdFormatColorFill className="text-base text-text-muted dark:text-dark-text-muted" />
                <p className="text-xs font-medium text-text-primary dark:text-dark-text-primary">
                  Tajweed Color
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={local.tajweedEnabled}
                onClick={() => set("tajweedEnabled", !local.tajweedEnabled)}
                className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
                  local.tajweedEnabled
                    ? "bg-linear-to-r from-primary to-secondary"
                    : "bg-surface-alt dark:bg-dark-surface-alt"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    local.tajweedEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </SettingCard>

        {/* Tafsir */}
        <SettingCard
          icon={
            <IoBookOutline className="text-lg text-primary dark:text-secondary-light" />
          }
          title="Tafsir"
          description="Preferred tafsir/exegesis resource"
        >
          <div>
            <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
              Tafsir Resource
            </p>
            <select
              value={local.tafsirId}
              onChange={(e) => set("tafsirId", e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
            >
              {Object.entries(groupedTafsirs).map(([langName, tafsirs]) => (
                <optgroup key={langName} label={langName}>
                  {tafsirs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.authorName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </SettingCard>

        {/* Prayer */}
        <SettingCard
          icon={
            <IoVolumeHighOutline className="text-lg text-primary dark:text-secondary-light" />
          }
          title="Prayer Times"
          description="Calculation method preferences"
        >
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
                Calculation Method
              </p>
              <select
                value={local.prayerCalcMethod}
                onChange={(e) => set("prayerCalcMethod", e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
              >
                {CALC_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
                Asr Calculation
              </p>
              <SegmentedControl
                options={[
                  { value: "shafii", label: "Shafii" },
                  { value: "hanafi", label: "Hanafi" },
                ]}
                value={local.prayerAsrMethod}
                onChange={(v) => set("prayerAsrMethod", v)}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
                Hijri Date Adjustment: {local.hijriAdjust > 0 ? "+" : ""}
                {local.hijriAdjust} day
                {local.hijriAdjust !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    set("hijriAdjust", Math.max(-3, local.hijriAdjust - 1))
                  }
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface-alt text-sm font-medium text-text-primary transition-colors hover:bg-surface dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
                >
                  −
                </button>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="1"
                  value={local.hijriAdjust}
                  onChange={(e) =>
                    set("hijriAdjust", Number.parseInt(e.target.value, 10))
                  }
                  className="w-full accent-secondary"
                />
                <button
                  type="button"
                  onClick={() =>
                    set("hijriAdjust", Math.min(3, local.hijriAdjust + 1))
                  }
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface-alt text-sm font-medium text-text-primary transition-colors hover:bg-surface dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
                >
                  +
                </button>
              </div>
              <p className="mt-1 text-[11px] text-text-muted">
                Adjust if the displayed date differs from your local observation
              </p>
            </div>
          </div>
        </SettingCard>

        {/* Save / Discard */}
        {hasChanges && (
          <div className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-surface px-5 py-4 dark:border-dark-border dark:bg-dark-surface">
            <button
              type="button"
              onClick={() =>
                setLocal({
                  theme: storeSettings.theme,
                  arabicFontSize: storeSettings.arabicFontSize,
                  translationFontSize: storeSettings.translationFontSize,
                  translationLang: storeSettings.translationLang,
                  reciterId: storeSettings.reciterId,
                  tafsirId: storeSettings.tafsirId,
                  tajweedEnabled: storeSettings.tajweedEnabled,
                  prayerCalcMethod: storeSettings.prayerCalcMethod,
                  prayerAsrMethod: storeSettings.prayerAsrMethod,
                  hijriAdjust: storeSettings.hijriAdjust,
                })
              }
              className="cursor-pointer rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors hover:text-text-muted"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all ${
                saving
                  ? "cursor-not-allowed bg-text-muted"
                  : "bg-linear-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              }`}
            >
              <IoCheckmarkCircle className="text-base" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}

        {/* Data */}
        <SettingCard
          icon={
            <IoSettingsOutline className="text-lg text-primary dark:text-secondary-light" />
          }
          title="Data Settings"
          description="Clear and refresh cached Quran data"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiOutlineTrash className="text-lg text-text-muted dark:text-dark-text-muted" />
              <div>
                <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                  Cached Data
                </p>
                <p className="text-xs text-text-muted dark:text-dark-text-muted">
                  Quran verses and surah data
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all ${
                loading
                  ? "cursor-not-allowed bg-text-muted"
                  : "cursor-pointer bg-linear-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              }`}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </SettingCard>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </div>
  );
}

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
import { toast } from "react-toastify";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSurahs } from "@/hooks/useSurahs";
import { confirm } from "@/lib/confirm";
import { LANGUAGES, RECITERS, TAFSIR_LIST } from "@/lib/const";
import {
  cacheAllAudioForReciter,
  cacheAllJuz,
  cacheAllJuzAudioForReciter,
  cacheAllJuzTafsirFor,
  cacheAllTafsirFor,
  clearAudioCache,
  clearCache,
  clearTafsirCache,
} from "@/lib/db";
import { removeFromCache } from "@/lib/downloadManager";
import { useDownloadsStore } from "@/store/downloads";
import { useSettings } from "@/store/settings";

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
        <Button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          variant="secondary-ghost"
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? "bg-white text-primary shadow-sm dark:bg-dark-surface-card dark:text-secondary-light"
              : "text-text-muted hover:text-text-primary dark:hover:text-dark-text-primary"
          }`}
        >
          {opt.label}
        </Button>
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
    tafsirEnabled: storeSettings.tafsirEnabled,
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
    local.tafsirEnabled !== storeSettings.tafsirEnabled ||
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

      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);

    if (local.reciterId !== storeSettings.reciterId) {
      const oldReciterId = storeSettings.reciterId;
      const oldDownloads = useDownloadsStore
        .getState()
        .items.filter((d) => d.qariId === oldReciterId);
      if (oldDownloads.length > 0) {
        const result = await confirm({
          title: "Delete old reciter's downloads?",
          message: `You have ${oldDownloads.length} surah(s) downloaded for the old reciter. Delete cached audio for the old reciter?`,
          confirmText: "Delete",
          cancelText: "Keep",
        });
        if (result) {
          const urls = oldDownloads.flatMap((d) => d.cachedUrls);
          await removeFromCache(urls);
          for (const d of oldDownloads) {
            await useDownloadsStore.getState().remove(d.surahNo, d.qariId);
          }
        }
      }
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
  }, [local, storeSettings, updateSettings]);

  useEffect(() => {
    setLocal({
      theme: storeSettings.theme,
      arabicFontSize: storeSettings.arabicFontSize,
      translationFontSize: storeSettings.translationFontSize,
      translationLang: storeSettings.translationLang,
      reciterId: storeSettings.reciterId,
      tafsirId: storeSettings.tafsirId,
      tafsirEnabled: storeSettings.tafsirEnabled,
      tajweedEnabled: storeSettings.tajweedEnabled,
      prayerCalcMethod: storeSettings.prayerCalcMethod,
      prayerAsrMethod: storeSettings.prayerAsrMethod,
      hijriAdjust: storeSettings.hijriAdjust,
    });
  }, [storeSettings]);

  const handleUpdate = useCallback(async () => {
    const ok = await confirm({
      title: "Refresh Data?",
      message:
        "This will clear and re-fetch all cached data (surahs, audio, tafsir, juz).",
      confirmText: "Yes, refresh!",
      confirmColor: "#9345f2",
    });
    if (!ok) return;
    setLoading(true);
    try {
      await clearCache();
      await refresh();
      await cacheAllJuz();
      await Promise.all([
        cacheAllAudioForReciter(local.reciterId),
        cacheAllJuzAudioForReciter(local.reciterId),
        cacheAllTafsirFor(local.tafsirId),
        cacheAllJuzTafsirFor(local.tafsirId),
      ]);
      toast.success("Data refreshed successfully!");
    } catch {
      toast.error("Failed to refresh data");
    }
    setLoading(false);
  }, [refresh, local.reciterId, local.tafsirId]);

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
    <PageShell
      head="Settings"
      title="Settings"
      description="Manage application data and preferences"
    >
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
            <Switch
              checked={local.tajweedEnabled}
              onCheckedChange={(v) => set("tajweedEnabled", v)}
            />
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
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-text-primary dark:text-dark-text-primary">
              Show Tafsir Under Verses
            </p>
            <Switch
              checked={local.tafsirEnabled}
              onCheckedChange={(v) => set("tafsirEnabled", v)}
            />
          </div>
        </div>
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
              <Button
                onClick={() =>
                  set("hijriAdjust", Math.max(-3, local.hijriAdjust - 1))
                }
                variant="secondary-ghost"
                size="icon"
                className="rounded-lg border border-border bg-surface-alt text-sm font-medium text-text-primary hover:bg-surface dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
              >
                −
              </Button>
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
              <Button
                onClick={() =>
                  set("hijriAdjust", Math.min(3, local.hijriAdjust + 1))
                }
                variant="secondary-ghost"
                size="icon"
                className="rounded-lg border border-border bg-surface-alt text-sm font-medium text-text-primary hover:bg-surface dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
              >
                +
              </Button>
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
          <Button
            onClick={() =>
              setLocal({
                theme: storeSettings.theme,
                arabicFontSize: storeSettings.arabicFontSize,
                translationFontSize: storeSettings.translationFontSize,
                translationLang: storeSettings.translationLang,
                reciterId: storeSettings.reciterId,
                tafsirId: storeSettings.tafsirId,
                tafsirEnabled: storeSettings.tafsirEnabled,
                tajweedEnabled: storeSettings.tajweedEnabled,
                prayerCalcMethod: storeSettings.prayerCalcMethod,
                prayerAsrMethod: storeSettings.prayerAsrMethod,
                hijriAdjust: storeSettings.hijriAdjust,
              })
            }
            variant="secondary-ghost"
            className="rounded-xl px-5 py-2 text-sm font-semibold text-white hover:text-text-muted"
          >
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="gradient"
            className="rounded-xl px-5 py-2 text-sm font-semibold"
          >
            <IoCheckmarkCircle className="text-base" />
            {saving ? "Saving..." : "Save"}
          </Button>
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
          <Button
            onClick={handleUpdate}
            disabled={loading}
            variant="gradient"
            className="rounded-xl px-4 py-2 text-sm font-semibold"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </SettingCard>
    </PageShell>
  );
}

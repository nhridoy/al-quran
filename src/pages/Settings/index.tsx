import { useCallback, useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { PageShell } from "@/components/common/PageShell/PageShell";
import AppearanceSettings from "@/components/pages/Settings/AppearanceSettings";
import AppLanguageSettings from "@/components/pages/Settings/AppLanguageSettings";
import DataSettings from "@/components/pages/Settings/DataSettings";
import HadithSettings from "@/components/pages/Settings/HadithSettings";
import PrayerSettings from "@/components/pages/Settings/PrayerSettings";
import ReadingSettings from "@/components/pages/Settings/ReadingSettings";
import SaveBar from "@/components/pages/Settings/SaveBar";
import SettingCard from "@/components/pages/Settings/SettingCard";
import TafsirSettings from "@/components/pages/Settings/TafsirSettings";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";
import { confirm } from "@/lib/confirm";
import { LANGUAGES, TAFSIR_LIST } from "@/lib/const";
import {
  handleHadithLangChange,
  handleReciterChange,
  handleTafsirChange,
  handleRefresh as refreshData,
} from "@/lib/settingsCaching";
import { useLocationStore } from "@/store/location";
import { useSettings } from "@/store/settings";

export default function Settings() {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const storeSettings = useSettings();
  const updateSettings = useSettings((s) => s.update);
  const locAddress = useLocationStore((s) => s.address);
  const refreshLocation = useLocationStore((s) => s.refresh);

  const [local, setLocal] = useState({
    theme: storeSettings.theme,
    arabicFontSize: storeSettings.arabicFontSize,
    translationFontSize: storeSettings.translationFontSize,
    translationLang: storeSettings.translationLang,
    reciterId: storeSettings.reciterId,
    tafsirId: storeSettings.tafsirId,
    tafsirEnabled: storeSettings.tafsirEnabled,
    tajweedEnabled: storeSettings.tajweedEnabled,
    hadithLang: storeSettings.hadithLang,
    locale: storeSettings.locale,
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
    local.hadithLang !== storeSettings.hadithLang ||
    local.prayerCalcMethod !== storeSettings.prayerCalcMethod ||
    local.prayerAsrMethod !== storeSettings.prayerAsrMethod ||
    local.hijriAdjust !== storeSettings.hijriAdjust ||
    local.locale !== storeSettings.locale;

  const set = useCallback((key: string, value: unknown) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateSettings(local);

      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("settings.saveFailed"));
    }
    setSaving(false);

    if (local.reciterId !== storeSettings.reciterId) {
      await handleReciterChange(storeSettings.reciterId, local.reciterId);
    }

    if (local.tafsirId !== storeSettings.tafsirId) {
      await handleTafsirChange(storeSettings.tafsirId, local.tafsirId);
    }

    if (local.hadithLang !== storeSettings.hadithLang) {
      await handleHadithLangChange(storeSettings.hadithLang, local.hadithLang);
    }
  }, [local, storeSettings, updateSettings, t]);

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
      hadithLang: storeSettings.hadithLang,
      locale: storeSettings.locale,
      prayerCalcMethod: storeSettings.prayerCalcMethod,
      prayerAsrMethod: storeSettings.prayerAsrMethod,
      hijriAdjust: storeSettings.hijriAdjust,
    });
  }, [storeSettings]);

  const handleUpdate = useCallback(async () => {
    const ok = await confirm({
      title: t("settings.refreshTitle"),
      message: t("settings.refreshMsg"),
      confirmText: t("settings.refreshConfirm"),
      confirmColor: "#9345f2",
    });
    if (!ok) return;
    setLoading(true);
    try {
      await refreshData(local.reciterId, local.tafsirId, local.hadithLang);
      toast.success(t("settings.refreshSuccess"));
    } catch {
      toast.error(t("settings.refreshFailed"));
    }
    setLoading(false);
  }, [local.reciterId, local.tafsirId, local.hadithLang, t]);

  const handleRefreshLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      await refreshLocation();
      const state = useLocationStore.getState();
      if (state.lat !== null) {
        toast.success("Location updated");
      } else {
        toast.error("Could not detect location");
      }
    } catch {
      toast.error("Failed to refresh location");
    }
    setLocationLoading(false);
  }, [refreshLocation]);

  const handleDiscard = useCallback(() => {
    setLocal({
      theme: storeSettings.theme,
      arabicFontSize: storeSettings.arabicFontSize,
      translationFontSize: storeSettings.translationFontSize,
      translationLang: storeSettings.translationLang,
      reciterId: storeSettings.reciterId,
      tafsirId: storeSettings.tafsirId,
      tafsirEnabled: storeSettings.tafsirEnabled,
      tajweedEnabled: storeSettings.tajweedEnabled,
      hadithLang: storeSettings.hadithLang,
      locale: storeSettings.locale,
      prayerCalcMethod: storeSettings.prayerCalcMethod,
      prayerAsrMethod: storeSettings.prayerAsrMethod,
      hijriAdjust: storeSettings.hijriAdjust,
    });
  }, [storeSettings]);

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
      head={t("nav.settings")}
      title={t("nav.settings")}
      description={t("settings.pageDesc")}
    >
      <AppearanceSettings
        theme={local.theme}
        arabicFontSize={local.arabicFontSize}
        translationFontSize={local.translationFontSize}
        onChange={set}
      />
      <AppLanguageSettings locale={local.locale} onChange={set} />
      <ReadingSettings
        translationLang={local.translationLang}
        reciterId={local.reciterId}
        tajweedEnabled={local.tajweedEnabled}
        onChange={set}
      />
      <TafsirSettings
        tafsirEnabled={local.tafsirEnabled}
        tafsirId={local.tafsirId}
        groupedTafsirs={groupedTafsirs}
        onChange={set}
      />
      <HadithSettings hadithLang={local.hadithLang} onChange={set} />
      <PrayerSettings
        prayerCalcMethod={local.prayerCalcMethod}
        prayerAsrMethod={local.prayerAsrMethod}
        hijriAdjust={local.hijriAdjust}
        onChange={set}
      />
      <SaveBar
        hasChanges={hasChanges}
        onDiscard={handleDiscard}
        saving={saving}
        onSave={handleSave}
      />
      <DataSettings loading={loading} onRefresh={handleUpdate} />
      <SettingCard
        icon={
          <IoLocationOutline className="text-lg text-primary dark:text-secondary-light" />
        }
        title="Location"
        description={
          locAddress
            ? `${locAddress.city ?? ""}, ${locAddress.countryName ?? ""}`.replace(
                /^, |, $/g,
                "",
              ) || "Location detected"
            : "Detect your location for prayer times"
        }
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                {locAddress?.city ?? "Unknown location"}
              </p>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                {locAddress?.countryName ?? "Refresh to detect"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefreshLocation}
            disabled={locationLoading}
            variant="gradient"
            className="rounded-xl px-4 py-2 text-sm font-semibold"
          >
            {locationLoading ? "Detecting..." : "Refresh"}
          </Button>
        </div>
      </SettingCard>
    </PageShell>
  );
}

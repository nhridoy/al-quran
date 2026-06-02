import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PageShell } from "@/components/common/PageShell/PageShell";
import AppearanceSettings from "@/components/pages/Settings/AppearanceSettings";
import DataSettings from "@/components/pages/Settings/DataSettings";
import PrayerSettings from "@/components/pages/Settings/PrayerSettings";
import ReadingSettings from "@/components/pages/Settings/ReadingSettings";
import SaveBar from "@/components/pages/Settings/SaveBar";
import TafsirSettings from "@/components/pages/Settings/TafsirSettings";
import { useSurahs } from "@/hooks/useSurahs";
import { confirm } from "@/lib/confirm";
import { LANGUAGES, TAFSIR_LIST } from "@/lib/const";
import {
  handleReciterChange,
  handleTafsirChange,
  handleRefresh as refreshData,
} from "@/lib/reciterService";
import { useSettings } from "@/store/settings";

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

  const set = useCallback((key: string, value: unknown) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  }, []);

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
      await handleReciterChange(storeSettings.reciterId, local.reciterId);
    }

    if (local.tafsirId !== storeSettings.tafsirId) {
      await handleTafsirChange(storeSettings.tafsirId, local.tafsirId);
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
      await refreshData(local.reciterId, local.tafsirId, refresh);
      toast.success("Data refreshed successfully!");
    } catch {
      toast.error("Failed to refresh data");
    }
    setLoading(false);
  }, [refresh, local.reciterId, local.tafsirId]);

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
      head="Settings"
      title="Settings"
      description="Manage application data and preferences"
    >
      <AppearanceSettings
        theme={local.theme}
        arabicFontSize={local.arabicFontSize}
        translationFontSize={local.translationFontSize}
        onChange={set}
      />
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
    </PageShell>
  );
}

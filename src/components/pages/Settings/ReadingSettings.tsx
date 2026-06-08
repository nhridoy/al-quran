import { MdFormatColorFill, MdOutlineTranslate } from "react-icons/md";
import SegmentedControl from "@/components/pages/Settings/SegmentedControl";
import SettingCard from "@/components/pages/Settings/SettingCard";
import { Switch } from "@/components/ui/switch";
import { useLocale } from "@/i18n";
import { RECITERS } from "@/lib/const";

const LANG_OPTIONS = [
  { value: "en", labelKey: "language.en" },
  { value: "bn", labelKey: "language.bn" },
] as const;

interface ReadingSettingsProps {
  translationLang: string;
  reciterId: string;
  tajweedEnabled: boolean;
  onChange: (key: string, value: unknown) => void;
}

export default function ReadingSettings({
  translationLang,
  reciterId,
  tajweedEnabled,
  onChange,
}: ReadingSettingsProps) {
  const { t } = useLocale();

  return (
    <SettingCard
      icon={
        <MdOutlineTranslate className="text-lg text-primary dark:text-secondary-light" />
      }
      title={t("settings.reading")}
      description={t("settings.readingDesc")}
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.translationLang")}
          </p>
          <SegmentedControl
            options={LANG_OPTIONS.map((o) => ({
              value: o.value,
              label: t(o.labelKey),
            }))}
            value={translationLang}
            onChange={(v) => onChange("translationLang", v)}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.reciter")}
          </p>
          <select
            value={reciterId}
            onChange={(e) => onChange("reciterId", e.target.value)}
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
              {t("settings.tajweedColor")}
            </p>
          </div>
          <Switch
            checked={tajweedEnabled}
            onCheckedChange={(v) => onChange("tajweedEnabled", v)}
          />
        </div>
      </div>
    </SettingCard>
  );
}

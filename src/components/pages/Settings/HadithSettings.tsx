import { BiBookOpen } from "react-icons/bi";
import SegmentedControl from "@/components/pages/Settings/SegmentedControl";
import SettingCard from "@/components/pages/Settings/SettingCard";
import { useLocale } from "@/i18n";

const HADITH_LANG_OPTIONS = [
  { value: "en", labelKey: "language.en" },
  { value: "bn", labelKey: "language.bn" },
] as const;

interface HadithSettingsProps {
  hadithLang: string;
  onChange: (key: string, value: unknown) => void;
}

export default function HadithSettings({
  hadithLang,
  onChange,
}: HadithSettingsProps) {
  const { t } = useLocale();

  return (
    <SettingCard
      icon={
        <BiBookOpen className="text-lg text-primary dark:text-secondary-light" />
      }
      title={t("settings.hadith")}
      description={t("settings.hadithDesc")}
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.hadithLang")}
          </p>
          <SegmentedControl
            options={HADITH_LANG_OPTIONS.map((o) => ({
              value: o.value,
              label: t(o.labelKey),
            }))}
            value={hadithLang}
            onChange={(v) => onChange("hadithLang", v)}
          />
        </div>
      </div>
    </SettingCard>
  );
}

import { HiOutlineLanguage } from "react-icons/hi2";
import SegmentedControl from "@/components/pages/Settings/SegmentedControl";
import SettingCard from "@/components/pages/Settings/SettingCard";
import type { AppLocale } from "@/i18n";
import { useLocale } from "@/i18n";

const LANGUAGE_OPTIONS = [
  { value: "en" as AppLocale, label: "English" },
  { value: "bn" as AppLocale, label: "বাংলা" },
];

interface AppLanguageSettingsProps {
  locale: AppLocale;
  onChange: (key: string, value: unknown) => void;
}

export default function AppLanguageSettings({
  locale,
  onChange,
}: AppLanguageSettingsProps) {
  const { t } = useLocale();

  return (
    <SettingCard
      icon={
        <HiOutlineLanguage className="text-lg text-primary dark:text-secondary-light" />
      }
      title={t("settings.locale")}
      description={t("settings.localeDesc")}
    >
      <SegmentedControl
        options={LANGUAGE_OPTIONS}
        value={locale}
        onChange={(v) => onChange("locale", v)}
      />
    </SettingCard>
  );
}

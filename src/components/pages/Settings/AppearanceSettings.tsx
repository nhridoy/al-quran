import { IoColorPaletteOutline } from "react-icons/io5";
import SegmentedControl from "@/components/pages/Settings/SegmentedControl";
import SettingCard from "@/components/pages/Settings/SettingCard";
import { useLocale } from "@/i18n";

const THEME_OPTIONS = [
  { value: "system", label: "settings.themeSystem" },
  { value: "light", label: "settings.themeLight" },
  { value: "dark", label: "settings.themeDark" },
] as const;

interface AppearanceSettingsProps {
  theme: string;
  arabicFontSize: number;
  translationFontSize: number;
  onChange: (key: string, value: unknown) => void;
}

export default function AppearanceSettings({
  theme,
  arabicFontSize,
  translationFontSize,
  onChange,
}: AppearanceSettingsProps) {
  const { t } = useLocale();

  return (
    <SettingCard
      icon={
        <IoColorPaletteOutline className="text-lg text-primary dark:text-secondary-light" />
      }
      title={t("settings.appearance")}
      description={t("settings.appearanceDesc")}
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.theme")}
          </p>
          <SegmentedControl
            options={THEME_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
            value={theme}
            onChange={(v) => onChange("theme", v)}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.arabicFontSize", { size: arabicFontSize.toFixed(2) })}
          </p>
          <input
            type="range"
            min="1"
            max="2"
            step="0.125"
            value={arabicFontSize}
            onChange={(e) =>
              onChange("arabicFontSize", Number.parseFloat(e.target.value))
            }
            className="w-full accent-secondary"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.translationFontSize", {
              size: translationFontSize.toFixed(2),
            })}
          </p>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.125"
            value={translationFontSize}
            onChange={(e) =>
              onChange("translationFontSize", Number.parseFloat(e.target.value))
            }
            className="w-full accent-secondary"
          />
        </div>
      </div>
    </SettingCard>
  );
}

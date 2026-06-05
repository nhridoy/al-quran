import { IoColorPaletteOutline } from "react-icons/io5";
import SegmentedControl from "@/components/pages/Settings/SegmentedControl";
import SettingCard from "@/components/pages/Settings/SettingCard";

const THEME_OPTIONS = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
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
  return (
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
            value={theme}
            onChange={(v) => onChange("theme", v)}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            Arabic Font Size: {arabicFontSize.toFixed(2)}x
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
            Translation Font Size: {translationFontSize.toFixed(2)}x
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

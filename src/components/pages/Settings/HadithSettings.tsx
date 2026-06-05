import { BiBookOpen } from "react-icons/bi";
import SegmentedControl from "@/components/pages/Settings/SegmentedControl";
import SettingCard from "@/components/pages/Settings/SettingCard";

const HADITH_LANG_OPTIONS = [
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
] as const;

interface HadithSettingsProps {
  hadithLang: string;
  onChange: (key: string, value: unknown) => void;
}

export default function HadithSettings({
  hadithLang,
  onChange,
}: HadithSettingsProps) {
  return (
    <SettingCard
      icon={
        <BiBookOpen className="text-lg text-primary dark:text-secondary-light" />
      }
      title="Hadith"
      description="Hadith language preferences"
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            Hadith Language
          </p>
          <SegmentedControl
            options={HADITH_LANG_OPTIONS}
            value={hadithLang}
            onChange={(v) => onChange("hadithLang", v)}
          />
        </div>
      </div>
    </SettingCard>
  );
}

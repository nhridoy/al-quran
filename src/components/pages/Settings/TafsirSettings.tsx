import { IoBookOutline } from "react-icons/io5";
import SettingCard from "@/components/pages/Settings/SettingCard";
import { Switch } from "@/components/ui/switch";

interface TafsirSettingsProps {
  tafsirEnabled: boolean;
  tafsirId: string;
  groupedTafsirs: Record<
    string,
    { id: string; name: string; authorName: string }[]
  >;
  onChange: (key: string, value: unknown) => void;
}

export default function TafsirSettings({
  tafsirEnabled,
  tafsirId,
  groupedTafsirs,
  onChange,
}: TafsirSettingsProps) {
  return (
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
            checked={tafsirEnabled}
            onCheckedChange={(v) => onChange("tafsirEnabled", v)}
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
          Tafsir Resource
        </p>
        <select
          value={tafsirId}
          onChange={(e) => onChange("tafsirId", e.target.value)}
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
  );
}

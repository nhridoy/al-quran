import { IoBookOutline } from "react-icons/io5";
import SettingCard from "@/components/pages/Settings/SettingCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLocale } from "@/i18n";

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
  const { t } = useLocale();

  return (
    <SettingCard
      icon={
        <IoBookOutline className="text-lg text-primary dark:text-secondary-light" />
      }
      title={t("settings.tafsir")}
      description={t("settings.tafsirDesc")}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.tafsirShow")}
          </p>
          <Switch
            checked={tafsirEnabled}
            onCheckedChange={(v) => onChange("tafsirEnabled", v)}
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
          {t("settings.tafsirResource")}
        </p>
        <Select value={tafsirId} onValueChange={(v) => onChange("tafsirId", v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {Object.entries(groupedTafsirs).map(([langName, tafsirs]) => (
              <SelectGroup key={langName}>
                <SelectLabel>{langName}</SelectLabel>
                {tafsirs.map((tsr) => (
                  <SelectItem key={tsr.id} value={tsr.id}>
                    {tsr.name} — {tsr.authorName}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
    </SettingCard>
  );
}

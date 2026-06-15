import { IoVolumeHighOutline } from "react-icons/io5";
import SegmentedControl from "@/components/pages/Settings/SegmentedControl";
import SettingCard from "@/components/pages/Settings/SettingCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/i18n";

interface PrayerSettingsProps {
  prayerCalcMethod: string;
  prayerAsrMethod: string;
  hijriAdjust: number;
  onChange: (key: string, value: unknown) => void;
}

export default function PrayerSettings({
  prayerCalcMethod,
  prayerAsrMethod,
  hijriAdjust,
  onChange,
}: PrayerSettingsProps) {
  const { t } = useLocale();

  const calcMethods = [
    { value: "MWL", label: t("settings.calcMwl") },
    { value: "ISNA", label: t("settings.calcIsna") },
    { value: "Egypt", label: t("settings.calcEgypt") },
    { value: "UmmAlQura", label: t("settings.calcUmmAlQura") },
    { value: "Karachi", label: t("settings.calcKarachi") },
  ];

  return (
    <SettingCard
      icon={
        <IoVolumeHighOutline className="text-lg text-primary dark:text-secondary-light" />
      }
      title={t("settings.prayerTimes")}
      description={t("settings.prayerTimesDesc")}
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.calcMethod")}
          </p>
          <Select
            value={prayerCalcMethod}
            onValueChange={(v) => onChange("prayerCalcMethod", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {calcMethods.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.asrCalc")}
          </p>
          <SegmentedControl
            options={[
              { value: "shafii", label: t("settings.asrShafii") },
              { value: "hanafi", label: t("settings.asrHanafi") },
            ]}
            value={prayerAsrMethod}
            onChange={(v) => onChange("prayerAsrMethod", v)}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            {t("settings.hijriAdjust", { n: hijriAdjust })}
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={() =>
                onChange("hijriAdjust", Math.max(-3, hijriAdjust - 1))
              }
              variant="secondary-ghost"
              size="icon"
              className="rounded-lg border border-border bg-surface-alt text-sm font-medium text-text-primary hover:bg-surface dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
            >
              −
            </Button>
            <input
              type="range"
              min="-3"
              max="3"
              step="1"
              value={hijriAdjust}
              onChange={(e) =>
                onChange("hijriAdjust", Number.parseInt(e.target.value, 10))
              }
              className="w-full accent-secondary"
            />
            <Button
              onClick={() =>
                onChange("hijriAdjust", Math.min(3, hijriAdjust + 1))
              }
              variant="secondary-ghost"
              size="icon"
              className="rounded-lg border border-border bg-surface-alt text-sm font-medium text-text-primary hover:bg-surface dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
            >
              +
            </Button>
          </div>
          <p className="mt-1 text-[11px] text-text-muted">
            {t("settings.hijriAdjustDesc")}
          </p>
        </div>
      </div>
    </SettingCard>
  );
}

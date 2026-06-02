import { IoVolumeHighOutline } from "react-icons/io5";
import SegmentedControl from "@/components/pages/Settings/SegmentedControl";
import SettingCard from "@/components/pages/Settings/SettingCard";
import { Button } from "@/components/ui/button";

const CALC_METHODS = [
  { value: "MWL", label: "Muslim World League" },
  { value: "ISNA", label: "Islamic Society of North America" },
  { value: "Egypt", label: "Egyptian General Authority" },
  { value: "UmmAlQura", label: "Umm al-Qura (Makkah)" },
  { value: "Karachi", label: "University of Islamic Sciences, Karachi" },
] as const;

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
  return (
    <SettingCard
      icon={
        <IoVolumeHighOutline className="text-lg text-primary dark:text-secondary-light" />
      }
      title="Prayer Times"
      description="Calculation method preferences"
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            Calculation Method
          </p>
          <select
            value={prayerCalcMethod}
            onChange={(e) => onChange("prayerCalcMethod", e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
          >
            {CALC_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            Asr Calculation
          </p>
          <SegmentedControl
            options={[
              { value: "shafii", label: "Shafii" },
              { value: "hanafi", label: "Hanafi" },
            ]}
            value={prayerAsrMethod}
            onChange={(v) => onChange("prayerAsrMethod", v)}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-text-primary dark:text-dark-text-primary">
            Hijri Date Adjustment: {hijriAdjust > 0 ? "+" : ""}
            {hijriAdjust} day
            {hijriAdjust !== 1 ? "s" : ""}
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
            Adjust if the displayed date differs from your local observation
          </p>
        </div>
      </div>
    </SettingCard>
  );
}

import { useMemo } from "react";
import { PRAYER_ICONS, PRAYER_NAMES, usePrayerStore } from "@/store/prayer";

export const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

interface PrayerGridProps {
  readOnly?: boolean;
  date?: string;
}

export default function PrayerGrid({
  readOnly = false,
  date,
}: PrayerGridProps) {
  const records = usePrayerStore((s) => s.records);
  const loaded = usePrayerStore((s) => s.loaded);
  const loadPrayers = usePrayerStore((s) => s.load);
  const toggle = usePrayerStore((s) => s.toggle);

  const dateKey = useMemo(() => {
    if (date) return date;
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, [date]);

  const day = useMemo(
    () =>
      records[dateKey] ?? {
        date: dateKey,
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
      },
    [records, dateKey],
  );

  if (!loaded) {
    loadPrayers();
    return null;
  }

  const Tag = readOnly ? "div" : "button";

  return (
    <div className="flex gap-2">
      {PRAYER_KEYS.map((key) => {
        const active = day[key] === true;

        return (
          <Tag
            key={key}
            {...(!readOnly
              ? {
                  type: "button" as const,
                  onClick: () => toggle(key, date),
                }
              : {})}
            className={`relative flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-2.5 text-xs font-medium min-w-0 transition-all duration-200 ${
              active
                ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                : "border-dashed border-border bg-transparent text-text-muted dark:border-dark-border dark:text-dark-text-muted"
            } ${
              readOnly
                ? "cursor-default"
                : "cursor-pointer hover:border-solid hover:border-primary hover:bg-primary/5 hover:text-primary dark:hover:border-primary dark:hover:bg-primary/5"
            }`}
          >
            <span className="text-lg">{PRAYER_ICONS[key]}</span>
            <span className="truncate">{PRAYER_NAMES[key]}</span>

            <span
              className={`text-[10px] leading-none transition-all duration-200 ${
                active ? "text-white/80" : "text-border dark:text-dark-border"
              }`}
            >
              {active ? "✓" : "○"}
            </span>
          </Tag>
        );
      })}
    </div>
  );
}

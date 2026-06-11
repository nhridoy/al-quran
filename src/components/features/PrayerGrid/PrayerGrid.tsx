import { useMemo } from "react";
import { PrayerIcon } from "@/components/ui/icons/prayer-icon";
import { formatDateKey } from "@/lib/date";
import { PRAYER_NAMES, usePrayerStore } from "@/store/prayer";

export const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

interface PrayerGridProps {
  readOnly?: boolean;
  date?: string;
  title?: string;
}

export default function PrayerGrid({
  readOnly = false,
  date,
  title,
}: PrayerGridProps) {
  const records = usePrayerStore((s) => s.records);
  const loaded = usePrayerStore((s) => s.loaded);
  const loadPrayers = usePrayerStore((s) => s.load);
  const toggle = usePrayerStore((s) => s.toggle);

  const dateKey = useMemo(() => {
    if (date) return date;
    return formatDateKey(new Date());
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

  const completedCount = useMemo(
    () => PRAYER_KEYS.filter((k) => day[k]).length,
    [day],
  );

  if (!loaded) {
    loadPrayers();
    return null;
  }

  const Tag = readOnly ? "div" : "button";

  return (
    <div>
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[11px] font-semibold tracking-[0.15em] text-white/50 uppercase">
            {title}
          </h2>
          <span className="text-[10px] text-white/40 tabular-nums">
            Prayers — {completedCount}/5
          </span>
        </div>
      )}
      <div className="flex gap-2">
        {PRAYER_KEYS.map((key) => {
          const active = day[key] === true;

          return (
            <Tag
              key={key}
              {...(readOnly
                ? {}
                : {
                    type: "button" as const,
                    onClick: () => toggle(key, date),
                  })}
              className={`relative flex flex-1 flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium min-w-0 transition-all duration-200 ${
                active
                  ? "bg-white/8 ring-1 ring-white/15 shadow-sm shadow-white/4"
                  : `bg-white/3 ring-1 ring-white/6 ${readOnly ? "" : "hover:bg-white/6"}`
              } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                  active
                    ? "bg-secondary text-white shadow-sm shadow-secondary/30"
                    : "bg-white/6 text-white/30 ring-1 ring-white/8"
                }`}
              >
                {active ? (
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                  </svg>
                ) : (
                  <PrayerIcon prayerKey={key} className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-center text-[10px] font-medium leading-tight tracking-wide uppercase ${
                  active ? "text-white/80" : "text-white/40"
                }`}
              >
                {PRAYER_NAMES[key]}
              </span>
              {!active && (
                <span className="text-[8px] text-white/20 uppercase tracking-wider">
                  {readOnly ? "—" : "Tap"}
                </span>
              )}
              {active && (
                <span className="text-[8px] text-secondary/60 uppercase tracking-wider">
                  Done
                </span>
              )}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

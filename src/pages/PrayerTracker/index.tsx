import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { PageShell } from "@/components/common/PageShell/PageShell";
import PrayerGrid, {
  PRAYER_KEYS,
} from "@/components/features/PrayerGrid/PrayerGrid";
import { useLocale } from "@/i18n";
import { formatDate, formatDateKey, formatMonthYear, getDaysInMonth, getTodayKey } from "@/lib/date";
import { type PrayerDay, usePrayerStore } from "@/store/prayer";

function computeStreak(records: Record<string, PrayerDay>): number {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = formatDateKey(d);
    const day = records[key];
    if (day) {
      const done = PRAYER_KEYS.filter((k) => day[k]).length;
      if (done >= 5) {
        streak++;
        d.setDate(d.getDate() - 1);
        continue;
      }
    }
    break;
  }
  return streak;
}

function computeMonthStats(
  records: Record<string, PrayerDay>,
  year: number,
  month: number,
): { date: string; count: number }[] {
  const daysInMonth = getDaysInMonth(new Date(year, month));
  const stats: { date: string; count: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const key = formatDateKey(new Date(year, month, d));
    const day = records[key];
    stats.push({
      date: key,
      count: day ? PRAYER_KEYS.filter((k) => day[k]).length : 0,
    });
  }
  return stats;
}

export default function PrayerTracker() {
  const records = usePrayerStore((s) => s.records);
  const loaded = usePrayerStore((s) => s.loaded);
  const loadRecords = usePrayerStore((s) => s.load);
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const { t } = useLocale();

  useEffect(() => {
    if (!loaded) loadRecords();
  }, [loaded, loadRecords]);

  const streak = useMemo(() => computeStreak(records), [records]);
  const monthStats = useMemo(
    () => computeMonthStats(records, viewYear, viewMonth),
    [records, viewYear, viewMonth],
  );
  const selectedKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);
  const todayKey = useMemo(() => getTodayKey(), []);

  const goPrevDay = useCallback(() => {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }, []);

  const goNextDay = useCallback(() => {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }, []);

  const goToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const isToday = selectedKey === todayKey;

  if (!loaded) {
    return (
      <PageShell head={t("prayerTracker.pageTitle")} showBack>
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-muted">{t("common.loading")}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell head={t("prayerTracker.pageTitle")} showBack>
      {/* Streak */}
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-4 text-white">
        <FaCheckCircle className="text-2xl" />
        <div>
          <p className="text-sm font-semibold">{t("prayerTracker.streak")}</p>
          <p className="text-2xl font-bold">
            {t("prayerTracker.days", { n: streak })}
          </p>
        </div>
      </div>

      {/* Date navigator */}
      <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <button
          type="button"
          onClick={goPrevDay}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-alt dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
        >
          ←
        </button>
        <button
          type="button"
          onClick={goToday}
          className="text-center text-sm font-semibold text-text dark:text-dark-text"
        >
          {formatDate(selectedDate, "EEE, MMM d, yyyy")}
          {!isToday && (
            <span className="ml-2 text-xs text-primary">
              {t("prayerTracker.today")}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={goNextDay}
          disabled={isToday}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-alt disabled:opacity-30 dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
        >
          →
        </button>
      </div>

      {/* Prayers for selected date */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <PrayerGrid date={selectedKey} />
      </div>

      {/* Monthly heatmap */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-text-muted dark:text-dark-text-muted">
            {t("prayerTracker.monthly")}
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear((y) => y - 1);
                } else {
                  setViewMonth((m) => m - 1);
                }
              }}
              className="rounded-lg px-2 py-1 text-text-secondary hover:bg-surface-alt dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
            >
              ←
            </button>
            <span className="font-medium text-text dark:text-dark-text">
              {formatMonthYear(new Date(viewYear, viewMonth))}
            </span>
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear((y) => y + 1);
                } else {
                  setViewMonth((m) => m + 1);
                }
              }}
              className="rounded-lg px-2 py-1 text-text-secondary hover:bg-surface-alt dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-semibold text-text-muted dark:text-dark-text-muted"
            >
              {d}
            </div>
          ))}
          {(() => {
            const firstDay = new Date(viewYear, viewMonth, 1).getDay();
            const cells: React.ReactNode[] = [];
            for (let i = 0; i < firstDay; i++) {
              cells.push(<div key={`e-${i}`} />);
            }
            for (const stat of monthStats) {
              const dayNum = Number.parseInt(stat.date.split("-")[2], 10);
              const cellDate = stat.date;
              const isCellToday = cellDate === todayKey;
              const isSelected = cellDate === selectedKey;
              const intensity =
                stat.count === 0
                  ? "bg-surface-alt dark:bg-dark-surface-alt"
                  : stat.count >= 5
                    ? "bg-primary"
                    : stat.count >= 3
                      ? "bg-primary/60"
                      : "bg-primary/30";
              cells.push(
                <button
                  key={stat.date}
                  type="button"
                  onClick={() => {
                    const parts = stat.date.split("-").map(Number);
                    setSelectedDate(new Date(parts[0], parts[1] - 1, parts[2]));
                    setViewYear(parts[0]);
                    setViewMonth(parts[1] - 1);
                  }}
                  title={t("prayerTracker.prayerCount", {
                    date: stat.date,
                    count: stat.count,
                  })}
                  className={`aspect-square rounded-md text-center text-[10px] leading-[2.2] ${isCellToday ? "ring-2 ring-secondary" : ""} ${isSelected ? "ring-2 ring-primary" : ""} ${intensity} ${stat.count > 0 ? "text-white" : "text-text-muted dark:text-dark-text-muted"} cursor-pointer transition-all hover:scale-110`}
                >
                  {dayNum}
                </button>,
              );
            }
            return cells;
          })()}
        </div>

        <div className="mt-3 flex items-center gap-3 text-[10px] text-text-muted dark:text-dark-text-muted">
          <span>{t("prayerTracker.missed")}</span>
          <div className="h-3 w-3 rounded bg-surface-alt dark:bg-dark-surface-alt" />
          <div className="h-3 w-3 rounded bg-primary/30" />
          <div className="h-3 w-3 rounded bg-primary/60" />
          <div className="h-3 w-3 rounded bg-primary" />
          <span>{t("prayerTracker.all")}</span>
        </div>
      </div>
    </PageShell>
  );
}

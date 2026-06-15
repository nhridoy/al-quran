import { useCallback, useEffect, useMemo, useState } from "react";
import { MdChecklist } from "react-icons/md";
import { PageShell } from "@/components/common/PageShell/PageShell";
import PrayerGrid from "@/components/features/PrayerGrid/PrayerGrid";
import { useLocale } from "@/i18n";
import { formatDate, formatDateKey, formatMonthYear } from "@/lib/date";
import { type PrayerDay, usePrayerStore } from "@/store/prayer";
import { useSadaqahStore } from "@/store/sadaqah";
import { useWorshipStore, type WorshipDay } from "@/store/worship";

const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

const EXTRA_ITEMS: { key: keyof WorshipDay; icon: string }[] = [
  { key: "quranRead", icon: "📖" },
  { key: "morningAdhkar", icon: "🌅" },
  { key: "duha", icon: "☀️" },
  { key: "eveningAdhkar", icon: "🌆" },
  { key: "tahajjud", icon: "⭐" },
  { key: "fasting", icon: "🌙" },
];

function computeHolisticStreak(
  prayerRecords: Record<string, PrayerDay>,
  worshipRecords: Record<string, WorshipDay>,
  sadaqahEntries: { date: string }[],
): number {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = formatDateKey(d);
    const pDay = prayerRecords[key];
    const hasPrayer = pDay && PRAYER_KEYS.some((k) => pDay[k]);
    const wDay = worshipRecords[key];
    const hasWorship = wDay && EXTRA_ITEMS.some((item) => wDay[item.key]);
    const hasCharity = sadaqahEntries.some((e) => e.date.startsWith(key));
    if (hasPrayer || hasWorship || hasCharity) {
      streak++;
      d.setDate(d.getDate() - 1);
      continue;
    }
    break;
  }
  return streak;
}

function computeHolisticMonthStats(
  prayerRecords: Record<string, PrayerDay>,
  worshipRecords: Record<string, WorshipDay>,
  sadaqahEntries: { date: string }[],
  year: number,
  month: number,
): { date: string; completion: number }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const stats: { date: string; completion: number }[] = [];
  const totalItems = PRAYER_KEYS.length + EXTRA_ITEMS.length + 1;

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    let done = 0;

    const pDay = prayerRecords[key];
    if (pDay) {
      for (const k of PRAYER_KEYS) {
        if (pDay[k]) done++;
      }
    }

    const wDay = worshipRecords[key];
    if (wDay) {
      for (const item of EXTRA_ITEMS) {
        if (wDay[item.key]) done++;
      }
    }

    if (sadaqahEntries.some((e) => e.date.startsWith(key))) done++;

    stats.push({ date: key, completion: done / totalItems });
  }
  return stats;
}

export default function DailyLog() {
  const prayerRecords = usePrayerStore((s) => s.records);
  const prayerLoaded = usePrayerStore((s) => s.loaded);
  const loadPrayer = usePrayerStore((s) => s.load);

  const sadaqahEntries = useSadaqahStore((s) => s.entries);
  const sadaqahLoaded = useSadaqahStore((s) => s.loaded);
  const loadSadaqah = useSadaqahStore((s) => s.load);

  const worshipRecords = useWorshipStore((s) => s.records);
  const worshipLoaded = useWorshipStore((s) => s.loaded);
  const loadWorship = useWorshipStore((s) => s.load);
  const toggleWorship = useWorshipStore((s) => s.toggle);

  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const { t } = useLocale();
  const allLoaded = prayerLoaded && sadaqahLoaded && worshipLoaded;

  useEffect(() => {
    if (!prayerLoaded) loadPrayer();
    if (!sadaqahLoaded) loadSadaqah();
    if (!worshipLoaded) loadWorship();
  }, [
    prayerLoaded,
    sadaqahLoaded,
    worshipLoaded,
    loadPrayer,
    loadSadaqah,
    loadWorship,
  ]);

  const selectedKey = formatDateKey(selectedDate);
  const todayKey = formatDateKey(new Date());
  const isToday = selectedKey === todayKey;

  const selectedWorshipDay = useMemo(
    () =>
      worshipRecords[selectedKey] ?? {
        date: selectedKey,
        quranRead: false,
        morningAdhkar: false,
        duha: false,
        eveningAdhkar: false,
        tahajjud: false,
        fasting: false,
      },
    [worshipRecords, selectedKey],
  );

  const selectedSadaqahTotal = useMemo(
    () =>
      sadaqahEntries
        .filter((e) => e.date.startsWith(selectedKey))
        .reduce((sum, e) => sum + e.amount, 0),
    [sadaqahEntries, selectedKey],
  );

  const streak = useMemo(
    () => computeHolisticStreak(prayerRecords, worshipRecords, sadaqahEntries),
    [prayerRecords, worshipRecords, sadaqahEntries],
  );

  const monthStats = useMemo(
    () =>
      computeHolisticMonthStats(
        prayerRecords,
        worshipRecords,
        sadaqahEntries,
        viewYear,
        viewMonth,
      ),
    [prayerRecords, worshipRecords, sadaqahEntries, viewYear, viewMonth],
  );

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

  if (!allLoaded) {
    return (
      <PageShell head={t("dailyLog.pageTitle")} showBack>
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-muted">{t("common.loading")}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell head={t("dailyLog.pageTitle")} showBack>
      {/* Streak */}
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-4 text-white">
        <MdChecklist className="text-2xl" />
        <div>
          <p className="text-sm font-semibold">{t("dailyLog.streak")}</p>
          <p className="text-2xl font-bold">
            {t("dailyLog.days", { n: streak })}
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
              {t("dailyLog.today")}
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

      {/* Prayer Summary (read-only) */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <PrayerGrid
          readOnly
          date={selectedKey}
          title={t("home.prayerTracker")}
        />
      </div>

      {/* Charity Summary (read-only) */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
          {t("dailyLog.charity")}
        </h2>
        <p className="text-sm text-text dark:text-dark-text">
          {selectedSadaqahTotal > 0
            ? t("dailyLog.charityGiven", {
                val: selectedSadaqahTotal.toFixed(2),
              })
            : t("dailyLog.noCharity")}
        </p>
      </div>

      {/* Worship Extras (toggleable) */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
          {t("dailyLog.extraWorship")}
        </h2>
        <div className="space-y-1">
          {EXTRA_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleWorship(item.key, selectedKey)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                selectedWorshipDay[item.key]
                  ? "bg-primary/5 dark:bg-primary/10"
                  : "hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs transition-colors ${
                  selectedWorshipDay[item.key]
                    ? "border-primary bg-primary text-white"
                    : "border-border dark:border-dark-border"
                }`}
              >
                {selectedWorshipDay[item.key] ? "✓" : ""}
              </span>
              <span className="text-sm">{item.icon}</span>
              <span className="text-sm font-medium text-text dark:text-dark-text">
                {t(`dailyLog.${item.key}`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Monthly heatmap */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-text-muted dark:text-dark-text-muted">
            {t("dailyLog.monthly")}
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
                stat.completion === 0
                  ? "bg-surface-alt dark:bg-dark-surface-alt"
                  : stat.completion >= 0.75
                    ? "bg-primary"
                    : stat.completion >= 0.5
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
                  title={`${stat.date}: ${Math.round(stat.completion * 100)}%`}
                  className={`aspect-square rounded-md text-center text-[10px] leading-[2.2] ${isCellToday ? "ring-2 ring-secondary" : ""} ${isSelected ? "ring-2 ring-primary" : ""} ${intensity} ${stat.completion > 0 ? "text-white" : "text-text-muted dark:text-dark-text-muted"} cursor-pointer transition-colors hover:bg-white/10 dark:hover:bg-white/10`}
                >
                  {dayNum}
                </button>,
              );
            }
            return cells;
          })()}
        </div>

        <div className="mt-3 flex items-center gap-3 text-[10px] text-text-muted dark:text-dark-text-muted">
          <span>{t("dailyLog.less")}</span>
          <div className="h-3 w-3 rounded bg-surface-alt dark:bg-dark-surface-alt" />
          <div className="h-3 w-3 rounded bg-primary/30" />
          <div className="h-3 w-3 rounded bg-primary/60" />
          <div className="h-3 w-3 rounded bg-primary" />
          <span>{t("dailyLog.more")}</span>
        </div>
      </div>
    </PageShell>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  BiBell,
  BiCheck,
  BiPlus,
  BiSolidBell,
  BiSolidTrash,
  BiTargetLock,
} from "react-icons/bi";
import { IoTrendingUp } from "react-icons/io5";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { useLocale } from "@/i18n";
import { SURAH_COUNT } from "@/lib/const";
import { getSurahList } from "@/lib/db";
import { formatPercentageRead, useReadingStore } from "@/store/reading";
import type { GoalMetric, GoalPeriod } from "@/store/readingGoals";
import { computeStreak, useReadingGoalsStore } from "@/store/readingGoals";
import type { SurahHeader } from "@/types";

const SURAH_TO_JUZ: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3,
  3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8,
  8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 12,
  12, 13, 13, 13, 14, 15, 15, 15, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 19,
  19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 22, 22, 22, 23, 23, 23, 23, 23, 24,
  24, 24,
];

export default function ReadingGoals() {
  const { goals, loaded, load, addGoal, deleteGoal } = useReadingGoalsStore();
  const records = useReadingStore((s) => s.records);
  const readingLoaded = useReadingStore((s) => s.loaded);
  const toggleSurah = useReadingStore((s) => s.toggleSurah);
  const [surahs, setSurahs] = useState<SurahHeader[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    if (!loaded) load();
    if (!readingLoaded) useReadingStore.getState().load();
    getSurahList().then(setSurahs);
  }, [loaded, readingLoaded, load]);

  const isRead = useMemo(
    () => new Set(records.map((r) => r.surahNo)),
    [records],
  );

  const surahCount = isRead.size;
  const pct = useMemo(() => formatPercentageRead(surahCount), [surahCount]);

  const juzProgress = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const surahsInJuz = SURAH_TO_JUZ.map((j, idx) =>
        j === i + 1 ? idx + 1 : -1,
      ).filter((s) => s !== -1);
      const complete = surahsInJuz.filter((s) => isRead.has(s)).length;
      return { juz: i + 1, total: surahsInJuz.length, complete };
    });
  }, [isRead]);

  const streak = useMemo(() => computeStreak(records), [records]);

  const [showForm, setShowForm] = useState(false);
  const [metric, setMetric] = useState<GoalMetric>("surahs");
  const [target, setTarget] = useState(1);
  const [period, setPeriod] = useState<GoalPeriod>("daily");
  const [label, setLabel] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("18:00");

  const METRIC_LABELS: Record<GoalMetric, string> = {
    surahs: t("goals.metricSurahs"),
    juz: t("goals.metricJuz"),
    pages: t("goals.metricPages"),
    minutes: t("goals.metricMinutes"),
  };

  const PERIOD_LABELS: Record<GoalPeriod, string> = {
    daily: t("goals.periodDaily"),
    weekly: t("goals.periodWeekly"),
    monthly: t("goals.periodMonthly"),
  };

  const handleAdd = async () => {
    await addGoal({
      metric,
      target,
      period,
      label:
        label ||
        t("goals.defaultLabel", {
          period: PERIOD_LABELS[period],
          target,
          metric: METRIC_LABELS[metric],
        }),
      reminderTime: reminderEnabled ? reminderTime : null,
      reminderEnabled,
    });
    setShowForm(false);
    setLabel("");
    setMetric("surahs");
    setTarget(1);
    setPeriod("daily");
    setReminderEnabled(false);
    setReminderTime("18:00");
  };

  const todayCount = useMemo(
    () =>
      records.filter((r) => r.date === new Date().toISOString().slice(0, 10))
        .length,
    [records],
  );

  return (
    <PageShell head={t("goals.pageTitle")} showBack>
      {/* Combined header: streak + overall progress */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IoTrendingUp className="text-2xl" />
            <div>
              <p className="text-sm font-semibold">{t("goals.headerTitle")}</p>
              <p className="mt-0.5 text-2xl font-bold">{pct}</p>
              <p className="text-[10px] text-white/80">
                {t("quranProgress.surahCount", {
                  n: surahCount,
                  m: SURAH_COUNT,
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{todayCount}</p>
            <p className="text-[10px] text-white/80">{t("goals.today")}</p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: pct }}
          />
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-white/80">
          <BiCheck className="text-xs" />
          {streak > 0
            ? t("goals.streakActive", { streak })
            : t("goals.streakInactive")}
        </div>
      </div>

      {/* Juz progress */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
          {t("quranProgress.perJuz")}
        </h2>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {juzProgress.map((j) => (
            <div
              key={j.juz}
              className={`flex flex-col items-center rounded-xl px-2 py-2 text-center ${
                j.complete === j.total
                  ? "bg-primary/10"
                  : "bg-surface-alt dark:bg-dark-surface-alt"
              }`}
              title={t("quranProgress.juzLabel", {
                n: j.juz,
                completed: j.complete,
                total: j.total,
              })}
            >
              <span
                className={`text-[10px] font-bold ${
                  j.complete === j.total
                    ? "text-primary"
                    : "text-text-muted dark:text-dark-text-muted"
                }`}
              >
                {j.juz}
              </span>
              <div className="mt-1 h-1 w-full rounded-full bg-border dark:bg-dark-border">
                <div
                  className={`h-full rounded-full transition-all ${
                    j.complete === j.total ? "bg-primary" : "bg-primary/40"
                  }`}
                  style={{
                    width: `${(j.complete / j.total) * 100}%`,
                  }}
                />
              </div>
              <span className="mt-0.5 text-[8px] text-text-muted dark:text-dark-text-muted">
                {j.complete}/{j.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add goal button */}
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm font-medium transition-all ${
          showForm
            ? "border-primary bg-primary/5 text-primary"
            : "border-border text-text-muted hover:border-primary hover:text-primary dark:border-dark-border dark:text-dark-text-muted"
        }`}
      >
        <BiPlus className="text-base" />
        {showForm ? t("common.cancel") : t("goals.newGoal")}
      </button>

      {/* Add goal form */}
      {showForm && (
        <div className="space-y-4 rounded-2xl border border-border bg-surface-alt p-5 dark:border-dark-border dark:bg-dark-surface-alt">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-text-muted">
                {t("goals.metric")}
              </p>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as GoalMetric)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary"
              >
                {Object.entries(METRIC_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-text-muted">
                {t("goals.period")}
              </p>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as GoalPeriod)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary"
              >
                {Object.entries(PERIOD_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-text-muted">
                {t("goals.target")}
              </p>
              <input
                type="number"
                min={1}
                max={114}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary"
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-text-muted">
                {t("goals.label")}
              </p>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={t("goals.labelPlaceholder")}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`text-lg ${reminderEnabled ? "text-primary" : "text-text-muted"}`}
              >
                {reminderEnabled ? <BiSolidBell /> : <BiBell />}
              </button>
              {reminderEnabled && (
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-primary outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary"
                />
              )}
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-light"
            >
              {t("goals.saveGoal")}
            </button>
          </div>
        </div>
      )}

      {/* Goals list */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-text-muted">
          <BiTargetLock className="text-3xl" />
          <p className="text-sm font-medium">{t("goals.noGoals")}</p>
          <p className="text-xs">{t("goals.noGoalsSubtitle")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {goals.map((g) => {
            const progress =
              g.metric === "surahs" ? Math.min(todayCount, g.target) : 0;
            const pctGoal =
              g.target > 0 ? Math.round((progress / g.target) * 100) : 0;
            return (
              <div
                key={g.id}
                className="rounded-2xl border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                      {g.label}
                    </p>
                    <p className="text-xs text-text-muted">
                      {PERIOD_LABELS[g.period]} &middot;{" "}
                      {METRIC_LABELS[g.metric]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {g.reminderEnabled && (
                      <span className="text-xs text-text-muted">
                        <BiSolidBell className="inline" /> {g.reminderTime}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteGoal(g.id)}
                      className="text-sm text-text-muted transition-colors hover:text-error"
                    >
                      <BiSolidTrash />
                    </button>
                  </div>
                </div>

                {g.metric === "surahs" && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>
                        {t("goals.progressToday", {
                          progress,
                          target: g.target,
                        })}
                      </span>
                      <span>{pctGoal}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-alt dark:bg-dark-surface-alt">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                        style={{ width: `${pctGoal}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {streak > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/10 dark:text-amber-300">
          <BiCheck className="text-lg" />
          <span>{t("goals.streakInfo", { streak })}</span>
        </div>
      )}

      {/* Surah grid */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
          {t("quranProgress.surahs")}
        </h2>
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6">
          {surahs.map((surah) => {
            const read = isRead.has(surah.no);
            return (
              <button
                key={surah.no}
                type="button"
                onClick={() =>
                  toggleSurah(surah.no, SURAH_TO_JUZ[surah.no - 1])
                }
                className={`flex flex-col items-center rounded-xl px-2 py-2 text-center transition-colors ${
                  read
                    ? "bg-primary/10 ring-1 ring-primary"
                    : "bg-surface-alt hover:bg-surface-alt/80 dark:bg-dark-surface-alt dark:hover:bg-dark-surface-alt/80"
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    read ? "text-primary" : "text-text dark:text-dark-text"
                  }`}
                >
                  {surah.enName}
                </span>
                <span className="text-[9px] text-text-muted dark:text-dark-text-muted">
                  {surah.no}
                </span>
                <span
                  className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] ${
                    read
                      ? "bg-primary text-white"
                      : "bg-border dark:bg-dark-border"
                  }`}
                >
                  {read ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

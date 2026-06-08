import { useEffect, useMemo, useState } from "react";
import {
  BiBell,
  BiCheck,
  BiPlus,
  BiSolidBell,
  BiSolidTrash,
  BiTargetLock,
} from "react-icons/bi";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { useLocale } from "@/i18n";
import { useReadingStore } from "@/store/reading";
import type { GoalMetric, GoalPeriod } from "@/store/readingGoals";
import { computeStreak, useReadingGoalsStore } from "@/store/readingGoals";

export default function ReadingGoals() {
  const { goals, loaded, load, addGoal, deleteGoal } = useReadingGoalsStore();
  const records = useReadingStore((s) => s.records);
  const readingLoaded = useReadingStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) load();
    if (!readingLoaded) useReadingStore.getState().load();
  }, [loaded, readingLoaded, load]);

  const streak = useMemo(() => computeStreak(records), [records]);

  const [showForm, setShowForm] = useState(false);
  const [metric, setMetric] = useState<GoalMetric>("surahs");
  const [target, setTarget] = useState(1);
  const [period, setPeriod] = useState<GoalPeriod>("daily");
  const [label, setLabel] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("18:00");

  const { t } = useLocale();

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
      {/* Streak card */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{t("goals.headerTitle")}</p>
            <p className="mt-1 text-xs text-white/80">
              {streak > 0
                ? t("goals.streakActive", { streak })
                : t("goals.streakInactive")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{todayCount}</p>
            <p className="text-[10px] text-white/80">{t("goals.today")}</p>
          </div>
        </div>
      </div>

      {/* Add button */}
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

      {/* Add form */}
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
        <div className="flex flex-col items-center gap-2 py-16 text-text-muted">
          <BiTargetLock className="text-3xl" />
          <p className="text-sm font-medium">{t("goals.noGoals")}</p>
          <p className="text-xs">{t("goals.noGoalsSubtitle")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {goals.map((g) => {
            const progress =
              g.metric === "surahs" ? Math.min(todayCount, g.target) : 0;
            const pct =
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

                {/* Progress bar */}
                {g.metric === "surahs" && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>
                        {t("goals.progressToday", {
                          progress,
                          target: g.target,
                        })}
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-alt dark:bg-dark-surface-alt">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                        style={{ width: `${pct}%` }}
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
    </PageShell>
  );
}

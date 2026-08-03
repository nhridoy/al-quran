import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { useLocale } from "@/i18n";
import { getHijriParts } from "@/lib/date";
import { useSettings } from "@/store/settings";

function useTaraweehData() {
  const hijriAdjust = useSettings((s) => s.hijriAdjust);
  const now = new Date();
  const { year, month, day } = getHijriParts(now, hijriAdjust);
  const isRamadan = month === 9;
  const ramadanDay = isRamadan ? day : 1;
  const hijriYear = year;

  const storageKey = `taraweeh-${hijriYear}`;
  const [data, setDataRaw] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  });

  const setData = (next: Record<string, number>) => {
    setDataRaw(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const getRakat = (day: number) => data[String(day)] ?? 0;
  const setRakat = (day: number, val: number) => {
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    setData({ ...data, [String(day)]: val });
  };

  const totalRakat = Object.values(data).reduce((a, b) => a + b, 0);
  const completedDays = Object.values(data).filter((v) => v > 0).length;

  return {
    ramadanDay,
    hijriYear,
    isRamadan,
    getRakat,
    setRakat,
    totalRakat,
    completedDays,
  };
}

const TARGET_OPTIONS = [8, 12, 20];

export default function TaraweehTracker() {
  const {
    ramadanDay,
    hijriYear,
    isRamadan,
    getRakat,
    setRakat,
    totalRakat,
    completedDays,
  } = useTaraweehData();
  const [target, setTarget] = useState(() => {
    const saved = localStorage.getItem("taraweeh-target");
    return saved ? Number(saved) : 20;
  });
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const { t } = useLocale();

  const updateTarget = (t: number) => {
    setTarget(t);
    localStorage.setItem("taraweeh-target", String(t));
  };

  const totalPossible = completedDays * target;
  const percentComplete =
    totalPossible > 0 ? Math.round((totalRakat / totalPossible) * 100) : 0;

  return (
    <PageShell head={t("taraweeh.pageTitle")} showBack>
      <div className="rounded-2xl bg-gradient-to-r from-amber-700 to-orange-500 px-5 pb-5 pt-4 text-white">
        <div className="flex items-center gap-2">
          <span className="ramadan-crescent text-xl">🌙</span>
          <p className="text-sm font-semibold">{t("taraweeh.headerTitle")}</p>
        </div>
        <p className="mt-1 text-xs text-white/80">
          {isRamadan
            ? t("taraweeh.ramadanActive", { year: hijriYear, day: ramadanDay })
            : t("taraweeh.lastRecorded", { year: hijriYear })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl border border-border bg-surface p-3 dark:border-dark-border dark:bg-dark-surface-card">
          <p className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            {totalRakat}
          </p>
          <p className="text-[10px] text-text-muted">
            {t("taraweeh.totalRakats")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 dark:border-dark-border dark:bg-dark-surface-card">
          <p className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            {completedDays}/30
          </p>
          <p className="text-[10px] text-text-muted">{t("taraweeh.days")}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 dark:border-dark-border dark:bg-dark-surface-card">
          <p className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            {percentComplete}%
          </p>
          <p className="text-[10px] text-text-muted">{t("taraweeh.goal")}</p>
        </div>
      </div>

      {/* Target selector */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-surface-alt px-4 py-3 dark:border-dark-border dark:bg-dark-surface-alt">
        <p className="text-xs font-medium text-text-muted">
          {t("taraweeh.dailyTarget")}
        </p>
        <div className="flex gap-2">
          {TARGET_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateTarget(opt)}
              className={`rounded-lg border-2 px-3 py-1 text-xs font-semibold transition-all ${
                target === opt
                  ? "border-amber-600 bg-amber-600 text-white"
                  : "border-dashed border-border text-text-muted hover:border-amber-600 hover:text-amber-600 dark:border-dark-border dark:text-dark-text-muted"
              }`}
            >
              {opt === 8
                ? t("taraweeh.target8")
                : opt === 12
                  ? t("taraweeh.target12")
                  : t("taraweeh.target20")}
            </button>
          ))}
        </div>
      </div>

      {/* Day grid */}
      <div className="space-y-2">
        {days.map((day) => {
          const rakat = getRakat(day);
          const isToday = isRamadan && day === ramadanDay;
          return (
            <div
              key={day}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-all ${
                isToday
                  ? "border-amber-500 bg-amber-50 ring-2 ring-amber-400 dark:border-amber-500 dark:bg-amber-900/20 dark:ring-amber-600"
                  : rakat > 0
                    ? "border-amber-400/40 bg-amber-50 dark:border-amber-600/30 dark:bg-amber-900/15"
                    : "border-border bg-surface dark:border-dark-border dark:bg-dark-surface"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                  {t("taraweeh.day", { day })}
                </p>
                <p className="text-[10px] text-text-muted">
                  {isToday
                    ? t("taraweeh.today")
                    : isRamadan && day < ramadanDay
                      ? t("taraweeh.past")
                      : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRakat(day, rakat - 2)}
                  className="flex size-8 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-amber-600 hover:text-amber-600 dark:border-dark-border dark:text-dark-text-muted"
                >
                  <BiMinus />
                </button>
                <span className="w-10 text-center text-sm font-bold text-text-primary dark:text-dark-text-primary">
                  {rakat}
                </span>
                <button
                  type="button"
                  onClick={() => setRakat(day, rakat + 2)}
                  className="flex size-8 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-amber-600 hover:text-amber-600 dark:border-dark-border dark:text-dark-text-muted"
                >
                  <BiPlus />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!isRamadan && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 px-5 py-8 text-center dark:border-amber-800/30 dark:bg-amber-900/10">
          <span className="text-3xl">🌙</span>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            {t("taraweeh.notRamadan")}
          </p>
        </div>
      )}
    </PageShell>
  );
}

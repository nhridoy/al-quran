import { useMemo, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import LocationGate from "@/components/common/LocationGate/LocationGate";
import {
  GREGORIAN_MONTHS,
  getIslamicEvent,
  getIslamicMonthName,
  parseHijriParts,
} from "@/data/islamicEvents";
import { useLocale } from "@/i18n";
import { formatDate, isToday } from "@/lib/date";
import { computePrayerTimes, formatTime } from "@/lib/prayerTimes";
import { useLocationStore } from "@/store/location";
import { useSettings } from "@/store/settings";

function formatDuration(fajr: Date, maghrib: Date): string {
  const diff = maghrib.getTime() - fajr.getTime();
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}

export default function FastingCalendar() {
  const { t } = useLocale();
  const { lat, lng } = useLocationStore();
  const { prayerCalcMethod, prayerAsrMethod } = useSettings();
  const hijriAdjust = useSettings((s) => s.hijriAdjust);
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const days = useMemo(() => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const result: Date[] = [];
    for (let d = 1; d <= lastDay; d++) {
      result.push(new Date(year, month, d));
    }
    return result;
  }, [year, month]);

  const dayTimes = useMemo(
    () =>
      days.map((date) => {
        const times = computePrayerTimes(
          lat != null && lng != null ? { lat, lng } : null,
          prayerCalcMethod,
          prayerAsrMethod,
          date,
        );
        if (!times) return null;
        return {
          date,
          fajr: times.fajr as Date,
          maghrib: times.maghrib as Date,
        };
      }),
    [days, lat, lng, prayerCalcMethod, prayerAsrMethod],
  );

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6 md:px-6 md:py-10">
      {/* Month navigator */}
      <div className="flex items-center justify-between rounded-2xl bg-surface px-5 py-3 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <button
          type="button"
          onClick={prevMonth}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-alt hover:text-text dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
        >
          <BiChevronLeft className="text-lg" />
          <span className="hidden sm:inline">
            {GREGORIAN_MONTHS[month === 0 ? 11 : month - 1]}
          </span>
        </button>

        <div className="text-center">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-transparent text-base font-semibold text-text dark:text-dark-text focus:outline-none"
          >
            {GREGORIAN_MONTHS.map((name, i) => (
              <option key={name} value={i}>
                {name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="ml-1 w-16 bg-transparent text-base font-semibold text-text dark:text-dark-text focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-alt hover:text-text dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
        >
          <span className="hidden sm:inline">
            {GREGORIAN_MONTHS[month === 11 ? 0 : month + 1]}
          </span>
          <BiChevronRight className="text-lg" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-text-muted dark:text-dark-text-muted">
        <span>
          {t("fastingCalendar.title", { month: GREGORIAN_MONTHS[month], year })}
        </span>
        <span>{t("fastingCalendar.header")}</span>
      </div>

      {/* Fasting list */}
      <LocationGate>
        <div className="space-y-2">
          {dayTimes.map((entry, idx) => {
            if (!entry) return null;
            const date = days[idx];
            const h = parseHijriParts(date, hijriAdjust);
            const event = getIslamicEvent(h.month, h.day);
            const today = isToday(date);

            return (
              <div
                key={date.toISOString()}
                className={`rounded-2xl px-5 py-3 shadow-sm ring-1 transition-colors ${
                  today
                    ? "bg-primary text-white ring-primary/30"
                    : event
                      ? "bg-surface ring-border dark:bg-dark-surface dark:ring-dark-border"
                      : "bg-surface ring-border dark:bg-dark-surface dark:ring-dark-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        today
                          ? "bg-white/20 text-white"
                          : "bg-surface-alt text-text dark:bg-dark-surface-alt dark:text-dark-text"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          today ? "text-white" : "text-text dark:text-dark-text"
                        }`}
                      >
                        {formatDate(date, "EEE, MMM d")}
                      </p>
                      <p
                        className={`text-xs ${
                          today
                            ? "text-white/80"
                            : "text-text-muted dark:text-dark-text-muted"
                        }`}
                      >
                        {h.day} {getIslamicMonthName(h.month)} {h.year}{" "}
                        {t("hijriCalendar.ah")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={`text-[10px] ${
                          today
                            ? "text-white/70"
                            : "text-text-muted dark:text-dark-text-muted"
                        }`}
                      >
                        {t("fastingCalendar.sehri")}
                      </p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          today ? "text-white" : "text-text dark:text-dark-text"
                        }`}
                      >
                        {formatTime(entry.fajr)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-[10px] ${
                          today
                            ? "text-white/70"
                            : "text-text-muted dark:text-dark-text-muted"
                        }`}
                      >
                        {t("fastingCalendar.iftar")}
                      </p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          today ? "text-white" : "text-text dark:text-dark-text"
                        }`}
                      >
                        {formatTime(entry.maghrib)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-[10px] ${
                          today
                            ? "text-white/70"
                            : "text-text-muted dark:text-dark-text-muted"
                        }`}
                      >
                        {t("fastingCalendar.fast")}
                      </p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          today
                            ? "text-white"
                            : "text-primary dark:text-secondary-light"
                        }`}
                      >
                        {formatDuration(entry.fajr, entry.maghrib)}
                      </p>
                    </div>
                  </div>
                </div>

                {event && !today && (
                  <div className="mt-2 flex items-center gap-2 border-t border-border pt-2 dark:border-dark-border">
                    <span className="text-xs text-primary dark:text-secondary-light">
                      {event.type === "festival" ? "🎉 " : "📌 "}
                      {event.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </LocationGate>
    </div>
  );
}

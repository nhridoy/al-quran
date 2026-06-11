import { useMemo, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import {
  GREGORIAN_MONTHS,
  getIslamicEvent,
  getIslamicMonthName,
  getUpcomingDatedEvents,
  parseHijriParts,
} from "@/data/islamicEvents";
import { useLocale } from "@/i18n";
import {
  computePrayerTimes,
  formatTime,
  getPrayerTime,
  PRAYER_NAMES,
} from "@/lib/prayerTimes";
import { useLocationStore } from "@/store/location";
import { useSettings } from "@/store/settings";

import { formatDate, isToday } from "@/lib/date";

function buildEmptyCells(count: number) {
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    cells.push(<div key={`ec-${i}`} />);
  }
  return cells;
}

export default function HijriCalendar() {
  const { t } = useLocale();
  const { lat, lng } = useLocationStore();
  const { prayerCalcMethod, prayerAsrMethod } = useSettings();
  const hijriAdjust = useSettings((s) => s.hijriAdjust);
  const now = useMemo(() => new Date(), []);
  const todayHijri = useMemo(
    () => parseHijriParts(now, hijriAdjust),
    [now, hijriAdjust],
  );
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const result: Date[] = [];
    for (let d = 1; d <= lastDay; d++) {
      result.push(new Date(year, month, d));
    }
    return result;
  }, [year, month]);

  const firstDayOffset = useMemo(
    () => new Date(year, month, 1).getDay(),
    [year, month],
  );

  const monthDaysEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const events: {
      date: Date;
      hijri: { year: number; month: number; day: number };
      name: string;
      nameBn: string;
      type: string;
      daysUntil: number;
    }[] = [];
    for (const date of days) {
      const h = parseHijriParts(date, hijriAdjust);
      const ev = getIslamicEvent(h.month, h.day);
      if (ev) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const diff = Math.round((d.getTime() - now.getTime()) / 86400000);
        events.push({ date, hijri: h, ...ev, daysUntil: diff });
      }
    }
    events.sort((a, b) => a.daysUntil - b.daysUntil);
    return events;
  }, [days, hijriAdjust]);

  const upcomingEvents = useMemo(
    () => getUpcomingDatedEvents(todayHijri, 6),
    [todayHijri],
  );

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const selectedPrayers = useMemo(() => {
    if (!selectedDate) return null;
    const times = computePrayerTimes(
      lat != null && lng != null ? { lat, lng } : null,
      prayerCalcMethod,
      prayerAsrMethod,
      selectedDate,
    );
    if (!times) return null;
    return PRAYER_NAMES.map((p) => ({
      key: p.key,
      name: p.name,
      time: getPrayerTime(times, p.key),
    }));
  }, [selectedDate, lat, lng, prayerCalcMethod, prayerAsrMethod]);

  const selectedHijri = useMemo(
    () => (selectedDate ? parseHijriParts(selectedDate, hijriAdjust) : null),
    [selectedDate, hijriAdjust],
  );

  const selectedEvent = useMemo(
    () =>
      selectedHijri
        ? getIslamicEvent(selectedHijri.month, selectedHijri.day)
        : undefined,
    [selectedHijri],
  );

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
            onChange={(e) => {
              setMonth(Number(e.target.value));
              setSelectedDate(null);
            }}
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
            onChange={(e) => {
              setYear(Number(e.target.value));
              setSelectedDate(null);
            }}
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

      {/* Grid */}
      <div>
        <div className="mb-1 grid grid-cols-7 gap-1">
          {(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const).map(
            (d) => (
              <div
                key={d}
                className="py-1 text-center text-xs font-semibold text-text-muted dark:text-dark-text-muted"
              >
                {t(`hijriCalendar.${d.toLowerCase()}`)}
              </div>
            ),
          )}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {buildEmptyCells(firstDayOffset)}

          {days.map((date) => {
            const h = parseHijriParts(date, hijriAdjust);
            const event = getIslamicEvent(h.month, h.day);
            const today = isToday(date);
            const selected =
              selectedDate &&
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();

            return (
              <button
                type="button"
                key={date.toISOString()}
                onClick={() =>
                  setSelectedDate((prev) =>
                    prev &&
                    prev.getDate() === date.getDate() &&
                    prev.getMonth() === date.getMonth() &&
                    prev.getFullYear() === date.getFullYear()
                      ? null
                      : date,
                  )
                }
                className={`flex flex-col items-center rounded-xl px-1 py-2 text-center transition-colors ${
                  today
                    ? "bg-primary text-white shadow-sm"
                    : selected
                      ? "ring-2 ring-primary bg-primary/5 dark:ring-secondary-light dark:bg-primary/10"
                      : event
                        ? "bg-primary/5 dark:bg-primary/10"
                        : "hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
                }`}
              >
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    today ? "text-white" : "text-text dark:text-dark-text"
                  }`}
                >
                  {date.getDate()}
                </span>
                <span
                  className={`text-[10px] tabular-nums ${
                    today
                      ? "text-white/80"
                      : "text-text-muted dark:text-dark-text-muted"
                  }`}
                >
                  {h.day} {getIslamicMonthName(h.month)}
                </span>
                {event && (
                  <span
                    className={`mt-0.5 text-[9px] ${
                      event.type === "festival"
                        ? "text-secondary"
                        : "text-primary"
                    }`}
                  >
                    ●
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date detail */}
      {selectedDate && (
        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text dark:text-dark-text">
                {formatDate(selectedDate, "EEE, MMM d, yyyy")}
              </p>
              {selectedHijri && (
                <p className="text-xs text-primary dark:text-secondary-light">
                  {selectedHijri.day} {getIslamicMonthName(selectedHijri.month)}{" "}
                  {selectedHijri.year} {t("hijriCalendar.ah")}
                </p>
              )}
            </div>
          </div>

          {selectedEvent && (
            <div className="mt-3 rounded-xl bg-primary/5 px-4 py-3 dark:bg-primary/10">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold ${
                    selectedEvent.type === "festival"
                      ? "text-secondary"
                      : "text-primary"
                  }`}
                >
                  {selectedEvent.type === "festival" ? "🎉" : "📌"}{" "}
                  {selectedEvent.name}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">
                {selectedEvent.nameBn}
              </p>
            </div>
          )}

          {selectedPrayers && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
                {t("hijriCalendar.prayerTimes")}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedPrayers
                  .filter((p) => p.key !== "sunrise")
                  .map((p) => (
                    <div
                      key={p.key}
                      className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl bg-surface-alt px-3 py-2 text-xs dark:bg-dark-surface-alt"
                    >
                      <span className="font-medium text-text-secondary dark:text-dark-text-secondary">
                        {t(p.name)}
                      </span>
                      <span className="tabular-nums text-text dark:text-dark-text">
                        {formatTime(p.time)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {selectedHijri && selectedHijri.month === 9 && (
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-secondary/5 px-4 py-3 dark:bg-secondary/10">
              <span className="text-sm">🌙</span>
              <div>
                <p className="text-xs font-medium text-secondary">
                  {t("hijriCalendar.ramadan")}
                </p>
                <p className="text-xs text-text-muted dark:text-dark-text-muted">
                  {t("hijriCalendar.fastingDay", { n: selectedHijri.day })}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Events this month */}
      {monthDaysEvents.length > 0 && (
        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
            {t("hijriCalendar.eventsThisMonth")}
          </h2>
          <div className="space-y-3">
            {monthDaysEvents.map((ev) => (
              <div
                key={`${ev.hijri.month}-${ev.hijri.day}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="shrink-0 text-lg">
                    {ev.type === "festival" ? "🎉" : "📌"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text dark:text-dark-text truncate">
                      {ev.name}
                    </p>
                    <p className="text-xs text-text-muted dark:text-dark-text-muted truncate">
                      {formatDate(ev.date, "EEE, MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-text-muted/60 dark:text-dark-text-muted/60">
                      {ev.hijri.day} {getIslamicMonthName(ev.hijri.month)}{" "}
                      {ev.hijri.year} {t("hijriCalendar.ah")}
                    </p>
                  </div>
                </div>
                <div
                  className={`shrink-0 ml-3 text-xs font-semibold ${
                    ev.daysUntil === 0
                      ? "text-secondary"
                      : ev.daysUntil < 0
                        ? "text-text-muted/50 dark:text-dark-text-muted/50"
                        : "text-text-muted dark:text-dark-text-muted"
                  }`}
                >
                  {ev.daysUntil === 0
                    ? t("hijriCalendar.today")
                    : ev.daysUntil === 1
                      ? t("hijriCalendar.tomorrow")
                      : ev.daysUntil > 0
                        ? t("hijriCalendar.days", { n: ev.daysUntil })
                        : t("hijriCalendar.daysAgo", {
                            n: Math.abs(ev.daysUntil),
                          })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
            {t("hijriCalendar.upcomingEvents")}
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((ev) => (
              <div
                key={`upcoming-${ev.month}-${ev.day}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="shrink-0 text-lg">
                    {ev.type === "festival" ? "🎉" : "📌"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text dark:text-dark-text truncate">
                      {ev.name}
                    </p>
                    <p className="text-xs text-text-muted dark:text-dark-text-muted truncate">
                      {formatDate(ev.gregorianDate, "EEE, MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-text-muted/60 dark:text-dark-text-muted/60">
                      {ev.day} {getIslamicMonthName(ev.month)} {ev.hijriYear}{" "}
                      {t("hijriCalendar.ah")}
                    </p>
                  </div>
                </div>
                <div
                  className={`shrink-0 ml-3 text-xs font-semibold ${
                    ev.daysUntil === 0
                      ? "text-secondary"
                      : "text-text-muted dark:text-dark-text-muted"
                  }`}
                >
                  {ev.daysUntil === 0
                    ? t("hijriCalendar.today")
                    : ev.daysUntil === 1
                      ? t("hijriCalendar.tomorrow")
                      : t("hijriCalendar.days", { n: ev.daysUntil })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

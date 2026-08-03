import { format as dfFormat } from "date-fns";
import { bn } from "date-fns/locale/bn";
import { enUS } from "date-fns/locale/en-US";
import { toHijriDate } from "date-fns-hijri";
import { ISLAMIC_MONTHS } from "@/data/islamicEvents";

const LOCALE_MAP = { en: enUS, bn } as const;
type AppLocale = keyof typeof LOCALE_MAP;

const MONTH_NAMES = ISLAMIC_MONTHS as unknown as { en: string; bn: string }[];

function hijriMonthName(month: number, locale: AppLocale): string {
  return MONTH_NAMES[month - 1]?.[locale === "bn" ? "bn" : "en"] ?? "";
}

function adjustDate(date: Date, adjust: number): Date {
  if (!adjust) return date;
  const d = new Date(date);
  d.setDate(d.getDate() + adjust);
  return d;
}

export function getHijriParts(
  date: Date,
  adjust = 0,
): {
  year: number;
  month: number;
  day: number;
} {
  const h = toHijriDate(adjustDate(date, adjust));
  return h
    ? { year: h.hy, month: h.hm, day: h.hd }
    : { year: 0, month: 0, day: 0 };
}

export function getHijriMonth(date: Date, adjust = 0): number {
  return toHijriDate(adjustDate(date, adjust))?.hm ?? 0;
}

export function isRamadan(date: Date, adjust = 0): boolean {
  return getHijriMonth(date, adjust) === 9;
}

export function formatHijri(
  date: Date,
  locale: AppLocale = "en",
  adjust = 0,
): string {
  const { year, month, day } = getHijriParts(date, adjust);
  return `${hijriMonthName(month, locale)} ${day}, ${year} AH`;
}

export function formatDate(
  date: Date,
  formatStr: string,
  locale: AppLocale = "en",
): string {
  return dfFormat(date, formatStr, { locale: LOCALE_MAP[locale] });
}

export function formatDateLong(date: Date, locale: AppLocale = "en"): string {
  return dfFormat(date, "EEEE, MMMM d, yyyy", {
    locale: LOCALE_MAP[locale],
  });
}

export function formatDateShort(date: Date, locale: AppLocale = "en"): string {
  return dfFormat(date, "MMM d, yyyy", { locale: LOCALE_MAP[locale] });
}

export function formatDateKey(date: Date): string {
  return dfFormat(date, "yyyy-MM-dd");
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function formatMonthYear(date: Date, locale: AppLocale = "en"): string {
  return dfFormat(date, "MMMM yyyy", { locale: LOCALE_MAP[locale] });
}

export { getDaysInMonth, isToday } from "date-fns";

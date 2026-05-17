import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

interface HijriDate {
  day: number;
  month: string;
  year: number;
}

const MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

function gregToHijri(date: Date): HijriDate {
  const g = new Date(date);
  const day = g.getDate();
  const month = g.getMonth() + 1;
  const year = g.getFullYear();

  const jd1 =
    Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
    Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
    Math.floor(
      (3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4,
    ) +
    day -
    32075;

  const jd = jd1 - 1948440 + 10632;
  const n = Math.floor((jd - 1) / 10631);
  const r = jd - 10631 * n;
  const n2 =
    Math.floor((r + 354 + 1) / 354) +
    Math.floor((29 * r + 1) / 23633) +
    Math.floor((r - 1) / 10631) -
    Math.floor(r / 10631) +
    Math.floor(r / 2957) -
    Math.floor(r / 11831) +
    Math.floor(r / 3664) -
    Math.floor(r / 23632) +
    Math.floor(r / 11830) +
    1;

  const n3 = n2 - 1;
  const r2 = r - (Math.floor((354 * n3 + 29) / 30) + n3 * 354);
  const hMonth = Math.ceil((r2 + 1) / 30) + 1;
  const hDay = r2 - (Math.floor(((hMonth - 1) * 30) / 1) + 1) + 1;
  const hYear = 30 * n + n2 - 1;

  const adjustedDay = hDay > 30 ? 30 : hDay < 1 ? 1 : hDay;
  const adjustedMonth = hMonth > 12 ? 12 : hMonth < 1 ? 1 : hMonth;

  return {
    day: adjustedDay,
    month: MONTHS[adjustedMonth - 1] || "",
    year: Math.max(hYear, 1),
  };
}

export default function HijriDate() {
  const [hijri, setHijri] = useState<HijriDate | null>(null);

  useEffect(() => {
    setHijri(gregToHijri(new Date()));
  }, []);

  const greg = new Date();
  const gregStr = greg.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!hijri) return null;

  return (
    <div className="rounded-xl bg-linear-to-br from-primary/5 to-secondary/5 p-4 dark:from-primary/10 dark:to-secondary/10">
      <div className="mb-1 flex items-center gap-2">
        <FaCalendarAlt className="text-xs text-secondary" />
        <p className="text-xs font-medium text-text-muted dark:text-dark-text-muted">
          Islamic Date
        </p>
      </div>
      <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
        {hijri.day} {hijri.month} {hijri.year} AH
      </p>
      <p className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">
        {gregStr}
      </p>
    </div>
  );
}

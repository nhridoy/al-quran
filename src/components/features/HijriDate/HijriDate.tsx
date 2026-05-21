import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useSettings } from "../../../store/settings";

interface HijriDate {
  day: number;
  month: string;
  year: number;
}

function gregToHijri(date: Date, adjust = 0): HijriDate {
  const d = new Date(date);
  d.setDate(d.getDate() + adjust);
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const parts = formatter.formatToParts(d);
  const day = Number.parseInt(
    parts.find((p) => p.type === "day")?.value || "0",
    10,
  );
  const month = parts.find((p) => p.type === "month")?.value || "";
  const year = Number.parseInt(
    (parts.find((p) => p.type === "year")?.value || "0").replace(/\D/g, ""),
    10,
  );
  return { day, month, year };
}

export default function HijriDate() {
  const hijriAdjust = useSettings((s) => s.hijriAdjust);
  const [hijri, setHijri] = useState<HijriDate | null>(null);

  useEffect(() => {
    setHijri(gregToHijri(new Date(), hijriAdjust));
  }, [hijriAdjust]);

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




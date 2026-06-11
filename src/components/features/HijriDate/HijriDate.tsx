import { useMemo } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useSettings } from "@/store/settings";
import { formatHijri, formatDateLong } from "@/lib/date";

export default function HijriDate() {
  const hijriAdjust = useSettings((s) => s.hijriAdjust);
  const hijriStr = useMemo(
    () => formatHijri(new Date(), "en", hijriAdjust),
    [hijriAdjust],
  );

  return (
    <div className="rounded-xl bg-linear-to-br from-primary/5 to-secondary/5 p-4 dark:from-primary/10 dark:to-secondary/10">
      <div className="mb-1 flex items-center gap-2">
        <FaCalendarAlt className="text-xs text-secondary" />
        <p className="text-xs font-medium text-text-muted dark:text-dark-text-muted">
          Islamic Date
        </p>
      </div>
      <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
        {hijriStr}
      </p>
      <p className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">
        {formatDateLong(new Date())}
      </p>
    </div>
  );
}

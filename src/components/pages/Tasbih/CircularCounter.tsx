import { useLocale } from "@/i18n";

interface CircularCounterProps {
  progress: number;
}

export default function CircularCounter({ progress }: CircularCounterProps) {
  return (
    <svg
      className="absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 256 256"
      aria-hidden="true"
    >
      <circle
        cx="128"
        cy="128"
        r="118"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-border dark:text-dark-border"
      />
      <circle
        cx="128"
        cy="128"
        r="118"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={2 * Math.PI * 118}
        strokeDashoffset={2 * Math.PI * 118 * (1 - progress)}
        className="text-secondary transition-all duration-300"
      />
    </svg>
  );
}

export function CounterContent({
  arabic,
  count,
  target,
}: {
  arabic: string;
  count: number;
  target: number;
}) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col items-center">
      <p className="font-arabic text-3xl leading-relaxed text-text-primary dark:text-dark-text-primary">
        {arabic}
      </p>
      <p className="mt-2 text-5xl font-bold text-primary dark:text-secondary-light">
        {count}
      </p>
      <p className="mt-1 text-sm text-text-muted">
        {t("tasbih.ofTarget", { n: target })}
      </p>
      {count >= target && count > 0 && (
        <p className="mt-2 rounded-full bg-success/10 px-3 py-0.5 text-xs font-medium text-success">
          {t("tasbih.completed")}
        </p>
      )}
    </div>
  );
}

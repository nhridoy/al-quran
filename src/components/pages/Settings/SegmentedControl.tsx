import { Button } from "@/components/ui/button";

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-surface-alt p-0.5 dark:border-dark-border dark:bg-dark-surface-alt">
      {options.map((opt) => (
        <Button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          variant="secondary-ghost"
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? "bg-white text-primary shadow-sm dark:bg-dark-surface-card dark:text-secondary-light"
              : "text-text-muted hover:text-text-primary dark:hover:text-dark-text-primary"
          }`}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

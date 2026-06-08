import { memo } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "@/i18n";
import type { HadithEntry } from "@/types";

interface HadithItemProps {
  item: HadithEntry;
}

export default memo(function HadithItem({ item }: HadithItemProps) {
  const { t } = useLocale();
  return (
    <AccordionItem
      value={String(item.hadithIndex)}
      className="overflow-hidden rounded-2xl border border-border bg-surface not-last:border-b-0 dark:border-dark-border dark:bg-dark-surface-card"
    >
      <AccordionTrigger className="[&_[data-slot=accordion-trigger-icon]]:hidden p-4 text-left transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
              {item.bookHadithIndex}
            </div>
            <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
              {t("hadith.hadithIndex", { index: item.bookHadithIndex })}
            </span>
          </div>
          <span className="text-xs text-text-muted transition-transform group-aria-expanded/accordion-trigger:rotate-180">
            ▾
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-3 border-t border-border p-4 pb-4 dark:border-dark-border">
        <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          {item.text}
        </p>
        {item.grades.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.grades.map((g) => (
              <span
                key={`${g.id}-${g.grade}`}
                className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                {g.grade}
              </span>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
});

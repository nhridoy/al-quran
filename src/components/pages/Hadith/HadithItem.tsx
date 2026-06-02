import { memo } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getPreferredText, type Hadith } from "@/hooks/useHadith";
import { useSettings } from "@/store/settings";

interface HadithItemProps {
  item: Hadith;
  activeLang: string;
}

const HadithItem = memo(function HadithItem({
  item,
  activeLang,
}: HadithItemProps) {
  const translationLang = useSettings((s) => s.translationLang);
  const { text: displayText, lang: actualLang } = getPreferredText(
    item.text,
    activeLang,
  );
  const altText =
    actualLang !== "ar" && item.text.ar ? item.text.ar : undefined;

  return (
    <AccordionItem
      key={item._id}
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
              Hadith {item.bookHadithIndex}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {actualLang !== translationLang && (
              <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                {actualLang}
              </span>
            )}
            <span className="text-xs text-text-muted transition-transform group-aria-expanded/accordion-trigger:rotate-180">
              ▾
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-3 border-t border-border p-4 pb-4 dark:border-dark-border">
        <p
          dir={
            actualLang === "ar" ||
            actualLang === "ar-diacritics" ||
            actualLang === "ur"
              ? "rtl"
              : "ltr"
          }
          className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary"
        >
          {displayText}
        </p>
        {altText && (
          <div className="border-t border-border pt-3 dark:border-dark-border">
            <p
              dir="rtl"
              className="font-arabic text-lg leading-loose text-text-primary dark:text-dark-text-primary"
            >
              {altText}
            </p>
          </div>
        )}
        {item.grades.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.grades.map((g) => (
              <span
                key={`${g.name}-${g.grade}`}
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

export default HadithItem;

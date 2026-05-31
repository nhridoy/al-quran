import { useCallback, useMemo, useState } from "react";
import {
  BiChevronLeft,
  BiChevronRight,
  BiErrorCircle,
  BiRefresh,
} from "react-icons/bi";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Header } from "../../components/common/Header/Header";
import {
  getPreferredText,
  PAGE_SIZE,
  useHadithPage,
} from "../../hooks/useHadith";
import { useSettings } from "../../store/settings";

const LANG_LABELS: Record<string, string> = {
  en: "English",
  bn: "বাংলা",
  ar: "العربية",
  "ar-diacritics": "العربية (مشكولة)",
  fr: "Français",
  tr: "Türkçe",
  ur: "اردو",
  id: "Bahasa Indonesia",
  ta: "தமிழ்",
  ru: "Русский",
};

export default function HadithBook() {
  const { slug, bookIndex } = useParams();
  const bi = bookIndex ? Number.parseInt(bookIndex, 10) : undefined;
  const [page, setPage] = useState(1);
  const [displayLang, setDisplayLang] = useState<string | null>(null);
  const translationLang = useSettings((s) => s.translationLang);
  const { data, loading, error, refetch } = useHadithPage(slug, bi, page);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const availableLangs = useMemo(() => {
    if (!data) return [translationLang];
    const langs = new Set<string>();
    langs.add(translationLang);
    langs.add("en");
    for (const h of data.items) {
      for (const key of Object.keys(h.text)) {
        langs.add(key);
      }
    }
    return Array.from(langs);
  }, [data, translationLang]);

  const activeLang = displayLang || translationLang;

  const handlePrev = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (data) {
      setPage((p) => Math.min(Math.ceil(data.total / PAGE_SIZE), p + 1));
    }
  }, [data]);

  return (
    <div className="min-h-screen">
      <Header head="Hadith" showBack />
      <div className="mx-4 space-y-3 pb-8 md:mx-6">
        {data && (
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-text-muted">
              {data.total.toLocaleString()} hadith
            </p>
            <div className="flex items-center gap-2">
              {totalPages > 1 && (
                <p className="text-xs text-text-muted">
                  Page {page} of {totalPages}
                </p>
              )}
              {availableLangs.length > 1 && (
                <select
                  value={activeLang}
                  onChange={(e) => setDisplayLang(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-secondary dark:border-dark-border dark:bg-dark-surface-card dark:text-dark-text-primary"
                >
                  {availableLangs.map((l) => (
                    <option key={l} value={l}>
                      {LANG_LABELS[l] || l}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={`skel-${n}`}
                className="h-24 animate-pulse rounded-2xl bg-surface-alt dark:bg-dark-surface-alt"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface-card">
            <BiErrorCircle className="text-4xl text-red-400" />
            <p className="text-sm text-text-muted">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="btn-primary flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
            >
              <BiRefresh className="text-base" />
              Try Again
            </button>
          </div>
        ) : data && data.items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface-card">
            <p className="text-sm text-text-muted">No hadith found.</p>
          </div>
        ) : (
          data && (
            <Accordion className="gap-2">
              {data.items.map((h) => {
                const { text: displayText, lang: actualLang } =
                  getPreferredText(h.text, activeLang);
                const altText =
                  actualLang !== "ar" && h.text.ar ? h.text.ar : undefined;
                return (
                  <AccordionItem
                    key={h._id}
                    value={String(h.hadithIndex)}
                    className="overflow-hidden rounded-2xl border border-border bg-surface not-last:border-b-0 dark:border-dark-border dark:bg-dark-surface-card"
                  >
                    <AccordionTrigger className="[&_[data-slot=accordion-trigger-icon]]:hidden p-4 text-left transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
                            {h.bookHadithIndex}
                          </div>
                          <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                            Hadith {h.bookHadithIndex}
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
                      {h.grades.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {h.grades.map((g) => (
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
              })}
            </Accordion>
          )
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={page <= 1}
              className="flex cursor-pointer items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40 dark:text-dark-text-primary dark:hover:bg-dark-surface-alt"
            >
              <BiChevronLeft className="text-lg" />
              Previous
            </button>
            <span className="text-xs text-text-muted">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={page >= totalPages}
              className="flex cursor-pointer items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40 dark:text-dark-text-primary dark:hover:bg-dark-surface-alt"
            >
              Next
              <BiChevronRight className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

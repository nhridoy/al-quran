import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { PageShell } from "@/components/common/PageShell/PageShell";
import PaginationBar from "@/components/common/PaginationBar";
import { SkeletonLoader } from "@/components/common/SkeletonLoader/SkeletonLoader";
import HadithItem from "@/components/pages/Hadith/HadithItem";
import { Accordion } from "@/components/ui/accordion";
import { PAGE_SIZE, useHadithPage } from "@/hooks/useHadith";
import { useSettings } from "@/store/settings";

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
    <PageShell head="Hadith" showBack className="space-y-3">
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
        <SkeletonLoader count={5} height="h-24" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface-card">
          <p className="text-sm text-text-muted">No hadith found.</p>
        </div>
      ) : (
        data && (
          <Accordion className="gap-2">
            {data.items.map((h) => (
              <HadithItem key={h._id} item={h} activeLang={activeLang} />
            ))}
          </Accordion>
        )
      )}

      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </PageShell>
  );
}

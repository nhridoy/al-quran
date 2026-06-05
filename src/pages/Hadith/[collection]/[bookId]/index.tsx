import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { SkeletonLoader } from "@/components/common/SkeletonLoader/SkeletonLoader";
import HadithItem from "@/components/pages/Hadith/HadithItem";
import { Accordion } from "@/components/ui/accordion";
import { useEditions, useHadithPage } from "@/hooks/useHadith";
import { useSettings } from "@/store/settings";

export default function HadithBook() {
  const { slug, bookIndex } = useParams();
  const bi = bookIndex ? Number.parseInt(bookIndex, 10) : undefined;
  const hadithLang = useSettings((s) => s.hadithLang);
  const { data, loading, error, refetch } = useHadithPage(slug, bi, hadithLang);
  const { editions } = useEditions();
  const edition = editions.find((e) => e.slug === slug);
  const hasSelectedLang =
    edition?.availableLanguages.includes(hadithLang) ?? true;
  const languageName = hadithLang === "bn" ? "Bengali" : "English";

  const items = useMemo(() => data?.items ?? [], [data]);

  return (
    <PageShell head="Hadith" showBack className="space-y-3">
      {loading ? (
        <SkeletonLoader count={5} height="h-24" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !data ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface-card">
          <p className="text-sm text-text-muted">No data available.</p>
        </div>
      ) : (
        <>
          {!hasSelectedLang && edition && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/30 dark:text-amber-300">
              <p className="text-xs">
                This collection is not available in {languageName}. Showing
                English version.
              </p>
            </div>
          )}

          <p className="text-sm text-text-muted mb-2">
            {data.total.toLocaleString()} hadith
          </p>

          <Accordion className="gap-2">
            {items.map((h) => (
              <HadithItem key={h.id} item={h} />
            ))}
          </Accordion>
        </>
      )}
    </PageShell>
  );
}

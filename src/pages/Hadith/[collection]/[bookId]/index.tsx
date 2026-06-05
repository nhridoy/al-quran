import { useCallback, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
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
  const [searchQuery, setSearchQuery] = useState("");
  const hadithLang = useSettings((s) => s.hadithLang);
  const { data, loading, error, refetch } = useHadithPage(slug, bi, hadithLang);
  const { editions } = useEditions();
  const edition = editions.find((e) => e.slug === slug);
  const hasSelectedLang =
    edition?.availableLanguages.includes(hadithLang) ?? true;
  const languageName = hadithLang === "bn" ? "Bengali" : "English";

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim() || !data) return data?.items || [];
    const lowerQuery = searchQuery.toLowerCase();
    return data.items.filter((h) =>
      (h.text || "").toLowerCase().includes(lowerQuery),
    );
  }, [data, searchQuery]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

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
          <div className="relative mb-4">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search in this book..."
              className="w-full rounded-2xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none focus:ring-1 focus:ring-secondary dark:border-dark-border dark:bg-dark-surface-card dark:text-dark-text-primary"
            />
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {data.total.toLocaleString()} hadith
              {searchQuery && ` · ${filteredItems.length} matches`}
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface-card">
              <p className="text-sm text-text-muted">
                No hadith found for "{searchQuery}"
              </p>
            </div>
          ) : (
            <Accordion className="gap-2">
              {filteredItems.map((h) => (
                <HadithItem key={h.id} item={h} />
              ))}
            </Accordion>
          )}
        </>
      )}
    </PageShell>
  );
}

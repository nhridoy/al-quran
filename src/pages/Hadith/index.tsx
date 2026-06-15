import { useEffect, useMemo, useState } from "react";
import { BiBookOpen, BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useEditions } from "@/hooks/useHadith";
import { useLocale } from "@/i18n";
import { searchAllHadiths } from "@/lib/db";
import { useSettings } from "@/store/settings";
import type { HadithSearchResult } from "@/types";

const SUPPORTED_LANGUAGES = ["en", "bn"];

function getEditionName(name: Record<string, string>, lang: string): string {
  return name[lang] || name.en || "";
}

export default function HadithCollections() {
  const navigate = useNavigate();
  const { editions, loading, error, refetch } = useEditions();
  const { t } = useLocale();
  const hadithLang = useSettings((s) => s.hadithLang);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HadithSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    searchAllHadiths(debouncedQuery, hadithLang).then((results) => {
      if (!cancelled) {
        setSearchResults(results);
        setSearching(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, hadithLang]);

  const filteredEditions = useMemo(
    () =>
      editions.filter((e) =>
        SUPPORTED_LANGUAGES.some((l) => e.availableLanguages.includes(l)),
      ),
    [editions],
  );

  const isSearching = searchQuery.trim().length > 0;

  return (
    <PageShell
      head={t("hadith.pageTitle")}
      showBack
      title={t("hadith.pageTitle")}
      description={t("hadith.subtitle")}
    >
      <div className="relative mb-6">
        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("hadith.searchPlaceholder")}
          className="rounded-2xl bg-surface pl-10 focus:ring-1 focus:ring-secondary dark:bg-dark-surface-card"
        />
      </div>

      {isSearching ? (
        searching ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface-card">
            <p className="text-sm text-text-muted">
              {t("hadith.noResults", { query: searchQuery })}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-text-muted mb-3">
              {t("hadith.results", {
                n: searchResults.length,
                query: debouncedQuery,
              })}
            </p>
            {searchResults.map((result) => (
              <button
                type="button"
                key={result.hadith.id}
                onClick={() =>
                  navigate(
                    `/hadith/${result.editionSlug}/books/${result.bookIndex}`,
                  )
                }
                className="w-full rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:border-secondary/30 hover:shadow-md dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
              >
                <p className="text-xs text-text-muted mb-1.5">
                  {result.bookName}
                  {" · "}
                  {result.editionName}
                  {" · "}
                  {t("hadith.hadithNumber", {
                    n: result.hadith.bookHadithIndex,
                  })}
                </p>
                <p className="text-sm leading-relaxed text-text-primary dark:text-dark-text-primary line-clamp-3">
                  {result.hadith.text}
                </p>
              </button>
            ))}
          </div>
        )
      ) : loading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-surface-alt dark:bg-dark-surface-alt"
            />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filteredEditions.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface-card">
          <p className="text-sm text-text-muted">{t("hadith.noEditions")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredEditions.map((edition) => (
            <Button
              key={edition.slug}
              onClick={() => navigate(`/hadith/${edition.slug}`)}
              variant="secondary-ghost"
              className="w-full justify-start h-auto gap-4 rounded-2xl border border-border bg-surface p-5 text-left hover:border-secondary/30 hover:shadow-md dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                <BiBookOpen className="text-lg text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                  {getEditionName(edition.name, hadithLang)}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {edition.hadithCount.toLocaleString()} {t("hadith.hadith")}
                  {" · "}
                  {edition.bookCount} {t("hadith.books")}
                  {!edition.availableLanguages.includes(hadithLang) && (
                    <>
                      {" · "}
                      <span className="text-amber-500">
                        {t("hadith.englishOnly")}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <span className="text-xs text-secondary">&rarr;</span>
            </Button>
          ))}
        </div>
      )}
    </PageShell>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { SkeletonLoader } from "@/components/common/SkeletonLoader/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { useEditionBooks, useEditions } from "@/hooks/useHadith";
import { useLocale } from "@/i18n";
import { useSettings } from "@/store/settings";

function getBookName(name: Record<string, string>, lang: string): string {
  return name[lang] || name.en || "";
}

export default function HadithBooks() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const hadithLang = useSettings((s) => s.hadithLang);
  const { books, loading, error, refetch } = useEditionBooks(slug, hadithLang);
  const { t } = useLocale();
  const { editions } = useEditions();
  const edition = editions.find((e) => e.slug === slug);
  const hasSelectedLang =
    edition?.availableLanguages.includes(hadithLang) ?? true;
  const languageName = hadithLang === "bn" ? "Bengali" : "English";

  return (
    <PageShell
      head={t("hadith.books")}
      showBack
      title={
        slug
          ? slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : t("hadith.books")
      }
      description={t("hadith.selectBook")}
    >
      {loading ? (
        <SkeletonLoader count={6} height="h-16" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <>
          {!hasSelectedLang && edition && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/30 dark:text-amber-300">
              <p className="text-xs">
                {t("hadith.unavailable", { languageName })}
              </p>
            </div>
          )}
          <div className="space-y-2">
            {books.map((book) => (
              <Button
                key={book.id}
                onClick={() =>
                  navigate(`/hadith/${slug}/books/${book.bookIndex}`)
                }
                variant="secondary-ghost"
                className="w-full justify-start h-auto gap-4 rounded-2xl border border-border bg-surface p-4 text-left hover:border-secondary/30 hover:shadow-md dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
                  {book.bookIndex}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {getBookName(book.name, hadithLang)}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {book.hadithCount} {t("hadith.hadith")}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}

import { BiBookOpen } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { Button } from "@/components/ui/button";
import { useEditions } from "@/hooks/useHadith";
import { useSettings } from "@/store/settings";

function getEditionName(name: Record<string, string>, lang: string): string {
  return name[lang] || name.en || name.ar || "";
}

export default function HadithCollections() {
  const navigate = useNavigate();
  const { editions, loading, error, refetch } = useEditions();
  const translationLang = useSettings((s) => s.translationLang);

  return (
    <PageShell
      head="Hadith Collections"
      showBack
      title="Hadith Collections"
      description="Browse major hadith collections"
    >
      {loading ? (
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
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {editions.map((edition) => (
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
                  {getEditionName(edition.name, translationLang)}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {edition.hadithCount.toLocaleString()} hadith
                  {" · "}
                  {edition.bookCount} books
                  {" · "}
                  {edition.availableLanguages.includes("bn")
                    ? "বাংলা"
                    : edition.availableLanguages.slice(0, 4).join(", ")}
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

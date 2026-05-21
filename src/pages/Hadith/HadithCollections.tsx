import { BiBookOpen, BiErrorCircle, BiRefresh } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useEditions } from "../../hooks/useHadith";
import { useSettings } from "../../store/settings";
import { Header } from "../../components/common/Header/Header";

function getEditionName(name: Record<string, string>, lang: string): string {
  return name[lang] || name.en || name.ar || "";
}

export default function HadithCollections() {
  const navigate = useNavigate();
  const { editions, loading, error, refetch } = useEditions();
  const translationLang = useSettings((s) => s.translationLang);

  return (
    <div className="min-h-screen">
      <Header head="Hadith Collections" showBack />
      <div className="mx-4 space-y-4 pb-8 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Hadith Collections
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Browse major hadith collections
          </p>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {editions.map((edition) => (
              <button
                key={edition.slug}
                type="button"
                onClick={() => navigate(`/hadith/${edition.slug}`)}
                className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface p-5 text-left transition-all hover:border-secondary/30 hover:shadow-md dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
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
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


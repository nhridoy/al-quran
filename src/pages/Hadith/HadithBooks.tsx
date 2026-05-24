import { BiBookAlt, BiErrorCircle, BiRefresh } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/common/Header/Header";
import { useEditionBooks } from "../../hooks/useHadith";
import { useSettings } from "../../store/settings";

function getBookName(name: Record<string, string>, lang: string): string {
  return name[lang] || name.en || name.ar || `Book`;
}

export default function HadithBooks() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { books, loading, error, refetch } = useEditionBooks(slug);
  const translationLang = useSettings((s) => s.translationLang);

  return (
    <div className="min-h-screen">
      <Header head="Books" showBack />
      <div className="mx-4 space-y-4 pb-8 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            {slug
              ? slug
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")
              : "Books"}
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Select a book to read hadith
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-surface-alt dark:bg-dark-surface-alt"
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
          <div className="space-y-2">
            {books.map((book) => (
              <button
                key={book._id}
                type="button"
                onClick={() =>
                  navigate(`/hadith/${slug}/books/${book.bookIndex}`)
                }
                className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface p-4 text-left transition-all hover:border-secondary/30 hover:shadow-md dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
                  {book.bookIndex}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {getBookName(book.name, translationLang)}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {book.hadithCount} hadith
                  </p>
                </div>
                <BiBookAlt className="text-base text-text-muted" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

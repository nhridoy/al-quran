import { BiBookAlt } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { SkeletonLoader } from "@/components/common/SkeletonLoader/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { useEditionBooks } from "@/hooks/useHadith";
import { useSettings } from "@/store/settings";

function getBookName(name: Record<string, string>, lang: string): string {
  return name[lang] || name.en || name.ar || `Book`;
}

export default function HadithBooks() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { books, loading, error, refetch } = useEditionBooks(slug);
  const translationLang = useSettings((s) => s.translationLang);

  return (
    <PageShell
      head="Books"
      showBack
      title={
        slug
          ? slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : "Books"
      }
      description="Select a book to read hadith"
    >
      {loading ? (
        <SkeletonLoader count={6} height="h-16" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <div className="space-y-2">
          {books.map((book) => (
            <Button
              key={book._id}
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
                  {getBookName(book.name, translationLang)}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {book.hadithCount} hadith
                </p>
              </div>
              <BiBookAlt className="text-base text-text-muted" />
            </Button>
          ))}
        </div>
      )}
    </PageShell>
  );
}

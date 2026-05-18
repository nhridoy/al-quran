import { useCallback, useState } from "react";
import {
  BiChevronLeft,
  BiChevronRight,
  BiErrorCircle,
  BiRefresh,
} from "react-icons/bi";
import { useParams } from "react-router-dom";
import { PAGE_SIZE, useHadithPage } from "../../../hooks/useHadith";
import { Header } from "../../Header/Header";

export default function HadithBook() {
  const { bookId } = useParams();
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data, loading, error, refetch } = useHadithPage(bookId, page);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const handlePrev = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
    setExpanded(null);
  }, []);

  const handleNext = useCallback(() => {
    if (data) {
      setPage((p) => Math.min(Math.ceil(data.total / PAGE_SIZE), p + 1));
      setExpanded(null);
    }
  }, [data]);

  return (
    <div className="min-h-screen">
      <Header head={data?.bookName || bookId || "Hadith"} showBack />
      <div className="mx-4 space-y-3 pb-8 md:mx-6">
        {data && (
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {data.total.toLocaleString()} hadith
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-text-muted">
                Page {page} of {totalPages}
              </p>
            )}
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
        ) : data && data.hadiths.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface-card">
            <p className="text-sm text-text-muted">No hadith found.</p>
          </div>
        ) : (
          data && (
            <div className="space-y-2">
              {data.hadiths.map((h) => {
                const isOpen = expanded === h.number;
                return (
                  <div
                    key={h.number}
                    className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card"
                  >
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : h.number)}
                      className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
                          {h.number}
                        </div>
                        <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                          Hadith {h.number}
                        </span>
                      </div>
                      <span
                        className={`text-xs text-text-muted transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>
                    {isOpen && (
                      <div className="space-y-3 border-t border-border p-4 dark:border-dark-border">
                        <p
                          dir="rtl"
                          className="font-arabic text-lg leading-loose text-text-primary dark:text-dark-text-primary"
                        >
                          {h.arab}
                        </p>
                        <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                          {h.id}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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

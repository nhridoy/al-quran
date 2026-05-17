import { useCallback } from "react";
import { BiBookmark, BiTrash } from "react-icons/bi";
import { FaQuran } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useBookmarkStore } from "../../../store/bookmarks";
import { Header } from "../../Header/Header";

export default function Bookmarks() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const remove = useBookmarkStore((s) => s.remove);
  const navigate = useNavigate();

  const grouped = bookmarks.reduce<Record<string, typeof bookmarks>>(
    (acc, b) => {
      const key = `${b.surahNo} - ${b.enName}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(b);
      return acc;
    },
    {},
  );

  const handleNavigate = useCallback(
    (surahNo: number, ayahNo?: number) => {
      navigate(
        ayahNo ? `/surah/${surahNo}?ayah=${ayahNo}` : `/surah/${surahNo}`,
      );
    },
    [navigate],
  );

  return (
    <div className="min-h-screen">
      <Header head="Bookmarks" showBack />
      <div className="mx-4 space-y-6 pb-8 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Bookmarks
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            {bookmarks.length} ayah{bookmarks.length !== 1 ? "s" : ""}{" "}
            bookmarked
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-alt dark:bg-dark-surface-alt">
              <BiBookmark className="text-2xl text-text-muted" />
            </div>
            <p className="text-sm font-medium text-text-muted dark:text-dark-text-muted">
              No bookmarks yet
            </p>
            <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
              Tap the bookmark icon on any ayah to save it here
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([key, items]) => (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card"
            >
              <button
                type="button"
                onClick={() => handleNavigate(items[0].surahNo)}
                className="flex w-full cursor-pointer items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-surface-alt dark:border-dark-border dark:hover:bg-dark-surface-alt"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                  <FaQuran className="text-xs text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {items[0].enName}
                  </p>
                  <p className="text-xs text-text-muted dark:text-dark-text-muted">
                    {items.length} ayah{items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-xs text-secondary">View &rarr;</span>
              </button>

              <div className="divide-y divide-border dark:divide-dark-border">
                {items.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleNavigate(b.surahNo, b.ayahNo)}
                      className="flex-1 cursor-pointer text-left"
                    >
                      <p className="font-arabic text-right text-lg leading-relaxed text-text-primary dark:text-dark-text-primary">
                        {b.arabicText}
                      </p>
                      {b.enText && (
                        <p className="mt-0.5 text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                          {b.enText}
                        </p>
                      )}
                      {b.bnText && (
                        <p className="text-[11px] leading-relaxed text-text-muted dark:text-dark-text-muted">
                          {b.bnText}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-text-muted">
                        Ayah {b.ayahNo}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(b.id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-alt hover:text-error dark:hover:bg-dark-surface-alt"
                      aria-label="Remove bookmark"
                      title="Remove bookmark"
                    >
                      <BiTrash className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { BiBookmark, BiSearch, BiTrash } from "react-icons/bi";
import { FaQuran } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Header } from "../../components/common/Header/Header";
import { confirm } from "../../lib/confirm";
import { useBookmarkStore } from "../../store/bookmarks";

export default function Bookmarks() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const remove = useBookmarkStore((s) => s.remove);
  const clearBySurah = useBookmarkStore((s) => s.clearBySurah);
  const clearAll = useBookmarkStore((s) => s.clearAll);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return bookmarks;
    const q = search.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.enName.toLowerCase().includes(q) ||
        b.surahName.includes(q) ||
        b.arabicText.toLowerCase().includes(q) ||
        b.enText?.toLowerCase().includes(q) ||
        b.bnText?.toLowerCase().includes(q) ||
        `${b.ayahNo}` === q ||
        `${b.surahNo}` === q,
    );
  }, [search, bookmarks]);

  const grouped = useMemo(
    () =>
      filtered.reduce<Record<string, typeof filtered>>((acc, b) => {
        const key = `${b.surahNo} - ${b.enName}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(b);
        return acc;
      }, {}),
    [filtered],
  );

  const handleClearSurah = async (surahNo: number, enName: string) => {
    const ok = await confirm({
      title: `Clear ${enName}?`,
      message: "Remove all bookmarks in this surah",
      confirmText: "Clear",
    });
    if (ok) clearBySurah(surahNo);
  };

  const handleClearAll = async () => {
    const ok = await confirm({
      title: "Clear All Bookmarks?",
      message: `Remove all ${bookmarks.length} bookmarks`,
      confirmText: "Clear All",
    });
    if (ok) clearAll();
  };

  return (
    <div className="min-h-screen">
      <Header head="Bookmarks" showBack />
      <div className="mx-4 space-y-4 pb-8 md:mx-6">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
              Bookmarks
            </h2>
            <p className="text-sm text-text-muted dark:text-dark-text-muted">
              {bookmarks.length} ayah{bookmarks.length === 1 ? "" : "s"}{" "}
              bookmarked
            </p>
          </div>
          {bookmarks.length > 0 && (
            <Button
              variant="danger"
              className="rounded-xl px-3 py-1.5 text-xs font-medium"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
        </div>

        {bookmarks.length > 0 && (
          <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-9 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
            />
          </div>
        )}

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
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <BiSearch className="mb-2 text-2xl text-text-muted" />
            <p className="text-sm font-medium text-text-muted">
              No matching bookmarks
            </p>
          </div>
        ) : (
          <Accordion className="space-y-4">
            {Object.entries(grouped).map(([key, items]) => (
              <AccordionItem
                key={key}
                value={key}
                className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card"
              >
                <AccordionTrigger className="flex w-full items-center gap-3 border-b border-border p-4 text-left text-sm font-medium transition-colors hover:bg-surface-alt hover:no-underline dark:border-dark-border dark:hover:bg-dark-surface-alt [&>[data-slot=accordion-trigger-icon]]:hidden">
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary-ghost"
                      size="icon-xs"
                      className="rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/surah/${items[0].surahNo}`);
                      }}
                      aria-label="Go to surah"
                    >
                      <IoOpenOutline className="text-xs" />
                    </Button>
                    <Button
                      variant="danger"
                      size="icon-xs"
                      className="rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearSurah(items[0].surahNo, items[0].enName);
                      }}
                      aria-label="Clear surah bookmarks"
                    >
                      <BiTrash className="text-xs" />
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-0 pb-0">
                  <div className="divide-y divide-border dark:divide-dark-border">
                    {items.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center gap-3 px-4 py-4"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              b.ayahNo
                                ? `/surah/${b.surahNo}?ayah=${b.ayahNo}`
                                : `/surah/${b.surahNo}`,
                            )
                          }
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
                        <Button
                          variant="danger"
                          size="icon"
                          className="rounded-lg"
                          onClick={() => remove(b.id)}
                          aria-label="Remove bookmark"
                        >
                          <BiTrash className="text-sm" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}

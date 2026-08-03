import { useMemo, useState } from "react";
import { BiBookmark, BiSearch } from "react-icons/bi";
import { PageShell } from "@/components/common/PageShell/PageShell";
import SurahGroupItem from "@/components/pages/Bookmarks/SurahGroupItem";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/i18n";
import { confirm } from "@/lib/confirm";
import { useBookmarkStore } from "@/store/bookmarks";

export default function Bookmarks() {
  const { t } = useLocale();
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const remove = useBookmarkStore((s) => s.remove);
  const clearBySurah = useBookmarkStore((s) => s.clearBySurah);
  const clearAll = useBookmarkStore((s) => s.clearAll);
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
      title: t("bookmarks.clearSurahTitle", { enName }),
      message: t("bookmarks.clearSurahMessage"),
      confirmText: t("bookmarks.clearSurahConfirm"),
    });
    if (ok) clearBySurah(surahNo);
  };

  const handleClearAll = async () => {
    const ok = await confirm({
      title: t("bookmarks.clearAllTitle"),
      message: t("bookmarks.clearAllMessage", { n: bookmarks.length }),
      confirmText: t("bookmarks.clearAllConfirm"),
    });
    if (ok) clearAll();
  };

  return (
    <PageShell head={t("bookmarks.pageTitle")} showBack>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            {t("bookmarks.headerTitle")}
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            {t("bookmarks.ayahsBookmarked", { n: bookmarks.length })}
          </p>
        </div>
        {bookmarks.length > 0 && (
          <Button
            variant="danger"
            className="rounded-xl px-3 py-1.5 text-xs font-medium"
            onClick={handleClearAll}
          >
            {t("bookmarks.clearAllButton")}
          </Button>
        )}
      </div>

      {bookmarks.length > 0 && (
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted" />
          <Input
            placeholder={t("bookmarks.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-alt dark:bg-dark-surface-alt">
            <BiBookmark className="text-2xl text-text-muted" />
          </div>
          <p className="text-sm font-medium text-text-muted dark:text-dark-text-muted">
            {t("bookmarks.noBookmarksYet")}
          </p>
          <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
            {t("bookmarks.noBookmarksHint")}
          </p>
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <BiSearch className="mb-2 text-2xl text-text-muted" />
          <p className="text-sm font-medium text-text-muted">
            {t("bookmarks.noMatchingBookmarks")}
          </p>
        </div>
      ) : (
        <Accordion className="space-y-4">
          {Object.entries(grouped).map(([key, items]) => (
            <SurahGroupItem
              key={key}
              items={items}
              onClearSurah={handleClearSurah}
              onRemove={remove}
            />
          ))}
        </Accordion>
      )}
    </PageShell>
  );
}

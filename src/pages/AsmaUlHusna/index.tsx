import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Fragment, useCallback, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import namesData from "@/data/asmaUlHusna.json";
import { useLocale } from "@/i18n";

interface NameEntry {
  id: number;
  arabic: string;
  transliteration: string;
  meaningEn: string;
  meaningBn: string;
}

type FilterMode = "all" | "memorized" | "not-memorized";

function loadMemorized(): Set<number> {
  try {
    const raw = localStorage.getItem("asma-memorized");
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveMemorized(ids: Set<number>) {
  localStorage.setItem("asma-memorized", JSON.stringify([...ids]));
}

export default function AsmaUlHusna() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<NameEntry | null>(null);
  const [memorized, setMemorized] = useState<Set<number>>(loadMemorized);
  const [filter, setFilter] = useState<FilterMode>("all");

  const toggleMemorized = useCallback((id: number) => {
    setMemorized((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveMemorized(next);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    let list = namesData as NameEntry[];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) =>
          n.arabic.includes(q) ||
          n.transliteration.toLowerCase().includes(q) ||
          n.meaningEn.toLowerCase().includes(q) ||
          n.meaningBn.includes(q),
      );
    }
    if (filter === "memorized") return list.filter((n) => memorized.has(n.id));
    if (filter === "not-memorized")
      return list.filter((n) => !memorized.has(n.id));
    return list;
  }, [query, filter, memorized]);

  const pct = Math.round((memorized.size / 99) * 100);

  return (
    <Fragment>
      <PageShell
        head={t("asmaUlHusna.pageTitle")}
        showBack
        title={t("asmaUlHusna.title")}
        description={t("asmaUlHusna.subtitle")}
        className="space-y-0"
      >
        {/* Progress bar */}
        <div className="mb-4 rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {t("asmaUlHusna.memorized")}
            </p>
            <p className="text-sm font-bold">
              {t("asmaUlHusna.progress", { n: memorized.size, pct })}
            </p>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Search + filter */}
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("asmaUlHusna.searchPlaceholder")}
              className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-9 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
            />
          </div>
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as FilterMode)}
          >
            <SelectTrigger className="w-[130px] rounded-xl border-border bg-surface-alt text-xs text-text focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value="all">{t("asmaUlHusna.filterAll")}</SelectItem>
              <SelectItem value="memorized">
                {t("asmaUlHusna.filterDone")}
              </SelectItem>
              <SelectItem value="not-memorized">
                {t("asmaUlHusna.filterLeft")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 pb-8 md:grid-cols-3">
          {filtered.map((name) => {
            const isMemorized = memorized.has(name.id);
            return (
              <Button
                key={name.id}
                variant="ghost"
                onClick={() => setSelected(name)}
                className={`relative h-auto w-full flex-col gap-0 rounded-2xl border p-4 text-center transition-all duration-200 hover:shadow-sm active:translate-y-0 ${
                  isMemorized
                    ? "border-primary/40 bg-primary/5 dark:border-primary/30 dark:bg-primary/10"
                    : "border-border bg-surface hover:border-secondary/30 dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMemorized(name.id);
                  }}
                  className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all ${
                    isMemorized
                      ? "bg-primary text-white shadow-sm"
                      : "border border-dashed border-border text-text-muted hover:border-primary hover:text-primary dark:border-dark-border"
                  }`}
                >
                  {isMemorized ? "✓" : "○"}
                </button>
                <p className="font-arabic text-xl leading-relaxed text-text-primary dark:text-dark-text-primary">
                  {name.arabic}
                </p>
                <p className="mt-1 text-xs font-medium text-secondary dark:text-secondary-light">
                  {name.transliteration}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-text-muted dark:text-dark-text-muted">
                  {name.meaningEn}
                </p>
              </Button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-text-muted">
            <p className="text-sm font-medium">{t("asmaUlHusna.noNames")}</p>
          </div>
        )}
      </PageShell>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay className="bg-black/60 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 shadow-2xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 dark:bg-dark-surface-card">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-text-muted hover:bg-surface-alt hover:text-text-primary dark:hover:bg-dark-surface-alt"
              aria-label={t("common.cancel")}
            >
              <IoClose className="size-5" />
            </Button>

            {selected && (
              <div className="flex flex-col items-center text-center">
                <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/10 to-secondary/10 text-xs font-bold text-primary dark:from-primary/20 dark:to-secondary/20 dark:text-secondary-light">
                  {selected.id}
                </div>
                <p className="font-arabic mt-3 text-3xl leading-relaxed text-text-primary dark:text-dark-text-primary">
                  {selected.arabic}
                </p>
                <p className="mt-2 text-base font-medium text-secondary dark:text-secondary-light">
                  {selected.transliteration}
                </p>

                <button
                  type="button"
                  onClick={() => toggleMemorized(selected.id)}
                  className={`mt-4 flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-xs font-medium transition-all ${
                    memorized.has(selected.id)
                      ? "border-primary bg-primary text-white"
                      : "border-dashed border-border text-text-muted hover:border-primary hover:text-primary dark:border-dark-border"
                  }`}
                >
                  {memorized.has(selected.id)
                    ? t("asmaUlHusna.memorizedLabel")
                    : t("asmaUlHusna.markMemorized")}
                </button>

                <div className="mt-6 w-full space-y-3 border-t border-border pt-4 dark:border-dark-border">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {t("asmaUlHusna.englishMeaning")}
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-primary dark:text-dark-text-primary">
                      {selected.meaningEn}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      বাংলা অর্থ
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-primary dark:text-dark-text-primary">
                      {selected.meaningBn}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </Fragment>
  );
}

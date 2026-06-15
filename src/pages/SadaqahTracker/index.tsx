import { useEffect, useMemo, useState } from "react";
import { FaHandHoldingHeart } from "react-icons/fa";
import { PageShell } from "@/components/common/PageShell/PageShell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/i18n";
import { formatDateKey, formatMonthYear } from "@/lib/date";
import { CATEGORIES, useSadaqahStore } from "@/store/sadaqah";

export default function SadaqahTracker() {
  const entries = useSadaqahStore((s) => s.entries);
  const loaded = useSadaqahStore((s) => s.loaded);
  const loadRecords = useSadaqahStore((s) => s.load);
  const add = useSadaqahStore((s) => s.add);
  const remove = useSadaqahStore((s) => s.remove);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Sadaqah");
  const [note, setNote] = useState("");
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());

  const { t } = useLocale();

  useEffect(() => {
    if (!loaded) loadRecords();
  }, [loaded, loadRecords]);

  const monthlyTotal = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
    return entries
      .filter((e) => e.date.startsWith(prefix))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries, viewYear, viewMonth]);

  const yearlyTotal = useMemo(() => {
    const prefix = `${viewYear}-`;
    return entries
      .filter((e) => e.date.startsWith(prefix))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries, viewYear]);

  const categoryTotals = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
    const monthly = entries.filter((e) => e.date.startsWith(prefix));
    return CATEGORIES.map((cat) => ({
      category: cat,
      total: monthly
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0),
    })).filter((c) => c.total > 0);
  }, [entries, viewYear, viewMonth]);

  const monthEntries = useMemo(
    () =>
      entries.filter((e) =>
        e.date.startsWith(
          `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`,
        ),
      ),
    [entries, viewYear, viewMonth],
  );

  const handleAdd = () => {
    const amt = Number.parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) return;
    const date = formatDateKey(new Date());
    add({ amount: amt, category, note, date });
    setAmount("");
    setNote("");
  };

  if (!loaded) {
    return (
      <PageShell head={t("sadaqah.pageTitle")} showBack>
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-muted">{t("common.loading")}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell head={t("sadaqah.pageTitle")} showBack>
      {/* Totals */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <FaHandHoldingHeart className="text-2xl" />
          <div>
            <p className="text-sm font-semibold">{t("sadaqah.totalGiven")}</p>
            <p className="text-3xl font-bold">${yearlyTotal.toFixed(2)}</p>
          </div>
        </div>
        <p className="mt-1 text-right text-xs text-white/80">
          {t("sadaqah.thisMonth", { n: monthlyTotal.toFixed(2) })}
        </p>
      </div>

      {/* Quick add */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
          {t("sadaqah.quickAdd")}
        </h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder={t("sadaqah.amount")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[140px] rounded-xl border-border bg-surface-alt text-sm text-text focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <input
            type="text"
            placeholder={t("sadaqah.note")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            {t("sadaqah.addEntry")}
          </button>
        </div>
      </div>

      {/* Category breakdown */}
      {categoryTotals.length > 0 && (
        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
            {t("sadaqah.breakdown")}
          </h2>
          <div className="space-y-2">
            {categoryTotals.map((c) => (
              <div
                key={c.category}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-text dark:text-dark-text">
                  {c.category}
                </span>
                <span className="font-semibold text-text dark:text-dark-text">
                  ${c.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-text-muted dark:text-dark-text-muted">
            {t("sadaqah.history")}
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear((y) => y - 1);
                } else {
                  setViewMonth((m) => m - 1);
                }
              }}
              className="rounded-lg px-2 py-1 text-text-secondary hover:bg-surface-alt dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
            >
              ←
            </button>
            <span className="font-medium text-text dark:text-dark-text">
              {formatMonthYear(new Date(viewYear, viewMonth))}
            </span>
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear((y) => y + 1);
                } else {
                  setViewMonth((m) => m + 1);
                }
              }}
              className="rounded-lg px-2 py-1 text-text-secondary hover:bg-surface-alt dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
            >
              →
            </button>
          </div>
        </div>

        {monthEntries.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted dark:text-dark-text-muted">
            {t("sadaqah.noEntries")}
          </p>
        ) : (
          <div className="space-y-2">
            {monthEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl bg-surface-alt px-4 py-3 dark:bg-dark-surface-alt"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text dark:text-dark-text">
                    ${entry.amount.toFixed(2)}
                  </p>
                  <div className="flex gap-2 text-xs text-text-muted dark:text-dark-text-muted">
                    <span>{entry.category}</span>
                    <span>·</span>
                    <span>{entry.date}</span>
                    {entry.note && (
                      <>
                        <span>·</span>
                        <span className="truncate">{entry.note}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(entry.id)}
                  className="ml-2 shrink-0 rounded-lg px-2 py-1 text-xs text-error hover:bg-error/10"
                >
                  {t("sadaqah.delete")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

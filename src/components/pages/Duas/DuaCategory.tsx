import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useParams } from "react-router-dom";
import duas from "../../../data/duas.json";
import { Header } from "../../Header/Header";

export default function DuaCategory() {
  const { categoryId } = useParams();
  const category = decodeURIComponent(categoryId || "");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!search) return duas.filter((d) => d.category === category);
    const q = search.toLowerCase();
    return duas.filter(
      (d) =>
        d.category === category &&
        (d.title.toLowerCase().includes(q) ||
          d.translation.toLowerCase().includes(q) ||
          d.transliteration.toLowerCase().includes(q)),
    );
  }, [category, search]);

  return (
    <div className="min-h-screen">
      <Header head={category} showBack />
      <div className="mx-4 space-y-4 pb-8 md:mx-6">
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted" />
          <input
            type="text"
            placeholder="Search within this category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-9 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
          />
        </div>

        {items.length === 0 && (
          <p className="py-10 text-center text-sm text-text-muted">
            No duas found
          </p>
        )}

        <div className="space-y-3">
          {items.map((dua) => {
            const isOpen = expanded === dua.id;
            return (
              <div
                key={dua.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : dua.id)}
                  className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                      {dua.title}
                    </p>
                    <p className="text-xs text-text-muted">{dua.reference}</p>
                  </div>
                  <span
                    className={`ml-3 text-lg text-text-muted transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {isOpen && (
                  <div className="space-y-3 border-t border-border p-4 dark:border-dark-border">
                    <p className="text-right font-arabic text-xl leading-loose text-text-primary dark:text-dark-text-primary">
                      {dua.arabic}
                    </p>
                    <p className="text-sm italic text-text-secondary dark:text-dark-text-secondary">
                      {dua.transliteration}
                    </p>
                    <p className="text-sm leading-relaxed text-text-primary dark:text-dark-text-primary">
                      {dua.translation}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="rounded-lg bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary dark:bg-primary/20">
                        {dua.reference}
                      </span>
                    </div>
                    {dua.benefit && (
                      <div className="rounded-xl bg-accent/10 p-3 dark:bg-accent/5">
                        <p className="text-xs font-medium text-accent">
                          Benefit
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                          {dua.benefit}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

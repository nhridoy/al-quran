import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import namesData from "../../data/asmaUlHusna.json";
import { Header } from "../../components/common/Header/Header";

interface NameEntry {
  id: number;
  arabic: string;
  transliteration: string;
  meaningEn: string;
  meaningBn: string;
}

export default function AsmaUlHusna() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<NameEntry | null>(null);

  const filtered = useMemo(() => {
    if (!query) return namesData;
    const q = query.toLowerCase();
    return (namesData as NameEntry[]).filter(
      (n) =>
        n.arabic.includes(q) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.meaningEn.toLowerCase().includes(q) ||
        n.meaningBn.includes(q),
    );
  }, [query]);

  return (
    <div className="min-h-screen">
      <Header head="Asma ul-Husna" showBack />
      <div className="mx-4 md:mx-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            99 Names of Allah
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Asma ul-Husna — The Most Beautiful Names
          </p>
        </div>

        <div className="relative mb-4">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search names..."
            className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-9 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pb-8 md:grid-cols-3">
          {filtered.map((name) => (
            <button
              key={name.id}
              type="button"
              onClick={() => setSelected(name)}
              className="cursor-pointer rounded-2xl border border-border bg-surface p-4 text-center transition-all duration-200 hover:border-secondary/30 hover:shadow-sm dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
            >
              <p className="font-arabic text-xl leading-relaxed text-text-primary dark:text-dark-text-primary">
                {name.arabic}
              </p>
              <p className="mt-1 text-xs font-medium text-secondary dark:text-secondary-light">
                {name.transliteration}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-text-muted dark:text-dark-text-muted">
                {name.meaningEn}
              </p>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-text-muted">
            <p className="text-sm font-medium">No names found</p>
          </div>
        )}
      </div>

      {selected &&
        createPortal(
          <div className="fixed inset-0 z-999 bg-black/60 backdrop-blur-sm">
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              onClick={() => setSelected(null)}
              aria-label="Close"
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm animate-scale-in rounded-2xl bg-surface p-6 shadow-2xl dark:bg-dark-surface-card">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 cursor-pointer rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-alt hover:text-text-primary dark:hover:bg-dark-surface-alt"
                aria-label="Close"
              >
                <IoClose className="text-xl" />
              </button>

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

                <div className="mt-6 w-full space-y-3 border-t border-border pt-4 dark:border-dark-border">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      English Meaning
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
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}


import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Header } from "../../components/common/Header/Header";
import namesData from "../../data/asmaUlHusna.json";

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
            <Button
              key={name.id}
              variant="ghost"
              onClick={() => setSelected(name)}
              className="h-auto w-full flex-col gap-0 rounded-2xl border-border bg-surface p-4 text-center transition-all duration-200 hover:border-secondary/30 hover:bg-surface hover:shadow-sm active:translate-y-0 dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20 dark:hover:bg-dark-surface-card"
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
            </Button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-text-muted">
            <p className="text-sm font-medium">No names found</p>
          </div>
        )}
      </div>

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
              aria-label="Close"
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
            )}
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </div>
  );
}

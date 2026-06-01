import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { PageShell } from "@/components/common/PageShell/PageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import duas from "@/data/duas.json";

export default function DuaCategory() {
  const { categoryId } = useParams();
  const category = decodeURIComponent(categoryId || "");
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
    <PageShell head={category} showBack>
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

      <Accordion className="space-y-3">
        {items.map((dua) => (
          <AccordionItem
            key={dua.id}
            value={String(dua.id)}
            className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card"
          >
            <AccordionTrigger className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-surface-alt hover:no-underline dark:hover:bg-dark-surface-alt dark:text-dark-text-primary [&>[data-slot=accordion-trigger-icon]]:hidden">
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                  {dua.title}
                </p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                  {dua.reference}
                </p>
              </div>
              <span className="text-lg text-text-muted transition-transform group-aria-expanded/accordion-trigger:rotate-180">
                ▾
              </span>
            </AccordionTrigger>
            <AccordionContent className="border-t border-border dark:border-dark-border">
              <div className="space-y-3 p-4">
                <p className="text-right font-arabic text-xl leading-loose text-text-primary dark:text-dark-text-primary">
                  {dua.arabic}
                </p>
                <p className="text-sm italic text-text-secondary dark:text-dark-text-secondary">
                  {dua.transliteration}
                </p>
                <p className="text-sm leading-relaxed text-text-primary dark:text-dark-text-primary">
                  {dua.translation}
                </p>
                <Badge variant="default">{dua.reference}</Badge>
                {dua.benefit && (
                  <div className="rounded-xl bg-accent/10 p-3 dark:bg-accent/5">
                    <p className="text-xs font-medium text-accent">Benefit</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                      {dua.benefit}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageShell>
  );
}

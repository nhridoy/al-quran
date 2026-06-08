import { useMemo, useState } from "react";
import { BiHeart, BiSearch } from "react-icons/bi";
import { PageShell } from "@/components/common/PageShell/PageShell";
import namesData from "@/data/islamicNames.json";
import { useLocale } from "@/i18n";

interface NameEntry {
  id: number;
  name: string;
  arabic: string;
  gender: string;
  meaning: string;
  origin: string;
}

function loadFavorites(): Set<number> {
  try {
    const raw = localStorage.getItem("islamic-names-favs");
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveFavorites(ids: Set<number>) {
  localStorage.setItem("islamic-names-favs", JSON.stringify([...ids]));
}

export default function IslamicNames() {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<string>("all");
  const [favorites, setFavorites] = useState<Set<number>>(loadFavorites);
  const { t } = useLocale();

  const names = namesData as NameEntry[];

  const filtered = useMemo(() => {
    let list = names;
    if (gender === "boy") list = list.filter((n) => n.gender === "boy");
    else if (gender === "girl") list = list.filter((n) => n.gender === "girl");
    else if (gender === "favorites")
      list = list.filter((n) => favorites.has(n.id));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.arabic.includes(q) ||
          n.meaning.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, gender, favorites]);

  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavorites(next);
      return next;
    });
  };

  return (
    <PageShell head={t("names.pageTitle")} showBack>
      <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-5 text-white">
        <p className="text-sm font-semibold">{t("names.headerTitle")}</p>
        <p className="mt-1 text-sm text-white/80">
          {t("names.headerSubtitle")}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("names.searchPlaceholder")}
          className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-9 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
        />
      </div>

      {/* Gender filter */}
      <div className="flex gap-2">
        {[
          { key: "all", label: t("names.filterAll") },
          { key: "boy", label: t("names.filterBoys") },
          { key: "girl", label: t("names.filterGirls") },
          {
            key: "favorites",
            label: t("names.filterFavorites", { count: favorites.size }),
          },
        ].map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setGender(g.key)}
            className={`flex-1 rounded-xl border-2 px-3 py-2 text-center text-xs font-medium transition-all ${
              gender === g.key
                ? "border-primary bg-primary text-white"
                : "border-dashed border-border text-text-muted hover:border-primary hover:text-primary dark:border-dark-border dark:text-dark-text-muted"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((n) => {
          const isFav = favorites.has(n.id);
          return (
            <div
              key={n.id}
              className={`rounded-2xl border px-5 py-4 transition-all ${
                isFav
                  ? "border-primary/40 bg-primary/5 dark:border-primary/30 dark:bg-primary/10"
                  : "border-border bg-surface dark:border-dark-border dark:bg-dark-surface"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-arabic text-xl leading-relaxed text-text dark:text-dark-text">
                      {n.arabic}
                    </p>
                    <span
                      className={`text-[10px] font-medium ${
                        n.gender === "boy" ? "text-blue-500" : "text-pink-500"
                      }`}
                    >
                      {n.gender === "boy" ? "👦" : "👧"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-text dark:text-dark-text">
                    {n.name}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">{n.meaning}</p>
                  <p className="mt-0.5 text-[10px] text-text-muted">
                    {n.origin}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFav(n.id)}
                  className={`shrink-0 rounded-lg p-1.5 text-base transition-all ${
                    isFav
                      ? "bg-primary text-white"
                      : "text-text-muted hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
                  }`}
                >
                  <BiHeart />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 text-text-muted">
          <p className="text-sm font-medium">{t("names.noNames")}</p>
        </div>
      )}
    </PageShell>
  );
}

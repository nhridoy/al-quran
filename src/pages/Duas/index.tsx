import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/common/PageShell/PageShell";
import duas from "@/data/duas.json";
import { useLocale } from "@/i18n";

const categories = [...new Set(duas.map((d) => d.category))] as string[];

const categoryIcons: Record<string, string> = {
  "Morning & Evening": "🌅",
  "Before Sleeping": "🌙",
  "After Waking": "☀️",
  "Before Eating": "🍽️",
  "After Eating": "🍽️",
  Traveling: "🚗",
  "Entering Home": "🏠",
  "Leaving Home": "🚪",
  "Entering Mosque": "🕌",
  "Leaving Mosque": "🕌",
  "Wearing Clothes": "👕",
  "Entering Bathroom": "🚻",
  "Leaving Bathroom": "🚻",
  "Before Wudu": "💧",
  "After Wudu": "💧",
  "After Adhan": "📢",
  "After Prayer": "🕋",
  Sneezing: "🤧",
  "Distress & Worry": "😟",
  "Seeking Knowledge": "📚",
  Marriage: "💍",
  Parents: "👨‍👩‍👧‍👦",
  Protection: "🛡️",
  Forgiveness: "🤲",
  Jannah: "🌴",
  Sickness: "🏥",
  "Rain & Thunder": "⛈️",
  Gratitude: "🙏",
};

export default function Duas() {
  const { t } = useLocale();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.toLowerCase().includes(q) ||
        duas.some(
          (d) =>
            d.category === cat &&
            (d.title.toLowerCase().includes(q) ||
              d.translation.toLowerCase().includes(q)),
        ),
    );
  }, [search]);

  return (
    <PageShell
      head={t("duas.pageTitle")}
      showBack
      title={t("duas.headerTitle")}
      description={t("duas.headerSubtitle")}
    >
      <div className="relative">
        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted" />
        <input
          type="text"
          placeholder={t("duas.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-9 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((cat) => {
          const count = duas.filter((d) => d.category === cat).length;
          return (
            <Link
              key={cat}
              to={`/duas/${encodeURIComponent(cat)}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-5 text-center transition-all duration-200 hover:border-secondary/30 hover:shadow-md dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
            >
              <span className="text-2xl">{categoryIcons[cat] || "🤲"}</span>
              <span className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                {cat}
              </span>
              <span className="text-xs text-text-muted">
                {t("duas.duaCount", { n: count })}
              </span>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}

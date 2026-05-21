import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import duas from "../../data/duas.json";
import { Header } from "../../components/common/Header/Header";

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
  const navigate = useNavigate();
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
    <div className="min-h-screen">
      <Header head="Duas" showBack />
      <div className="mx-4 space-y-4 pb-8 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Duas & Supplications
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Daily prayers from Quran and Sunnah
          </p>
        </div>

        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted" />
          <input
            type="text"
            placeholder="Search duas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-9 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((cat) => {
            const count = duas.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => navigate(`/duas/${encodeURIComponent(cat)}`)}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-5 text-center transition-all hover:border-secondary/30 hover:shadow-md dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
              >
                <span className="text-2xl">{categoryIcons[cat] || "🤲"}</span>
                <span className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                  {cat}
                </span>
                <span className="text-xs text-text-muted">
                  {count} dua{count !== 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


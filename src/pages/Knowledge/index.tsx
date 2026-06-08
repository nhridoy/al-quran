import { useCallback, useMemo, useState } from "react";
import { BiBookmark, BiSearch } from "react-icons/bi";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { useLocale } from "@/i18n";

interface Fact {
  id: number;
  category: string;
  fact: string;
  source?: string;
}

const FACTS: Fact[] = [
  // Quran
  {
    id: 1,
    category: "Quran",
    fact: "The Quran has 114 surahs, 6,236 verses, and approximately 77,430 words.",
    source: "Quran Statistics",
  },
  {
    id: 2,
    category: "Quran",
    fact: "The word 'Quran' means 'recitation' in Arabic.",
    source: "Lisan al-Arab",
  },
  {
    id: 3,
    category: "Quran",
    fact: "The longest surah is Al-Baqarah (286 verses), and the shortest is Al-Kawthar (3 verses).",
  },
  {
    id: 4,
    category: "Quran",
    fact: "The Quran was revealed over approximately 23 years to Prophet Muhammad (ﷺ).",
  },
  {
    id: 5,
    category: "Quran",
    fact: "Hafs 'an 'Asim is the most widely used qira'ah (recitation style) of the Quran today.",
  },
  { id: 6, category: "Quran", fact: "The Quran mentions 25 prophets by name." },
  {
    id: 7,
    category: "Quran",
    fact: "Surah Ya-Sin is often called the 'heart of the Quran'.",
    source: "Hadith — Tirmidhi",
  },
  {
    id: 8,
    category: "Quran",
    fact: "The word 'Allah' appears 2,699 times in the Quran.",
  },

  // Hadith
  {
    id: 9,
    category: "Hadith",
    fact: "The Hadith collection Sahih al-Bukhari contains 7,275 hadiths (including repetitions).",
    source: "Sahih al-Bukhari",
  },
  {
    id: 10,
    category: "Hadith",
    fact: "Imam Bukhari collected 600,000 hadiths over 16 years and selected only ~7,275 for his collection.",
  },
  {
    id: 11,
    category: "Hadith",
    fact: "The six major hadith collections (Kutub al-Sittah) are Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai, and Ibn Majah.",
  },
  {
    id: 12,
    category: "Hadith",
    fact: "The word 'hadith' means 'speech' or 'report' in Arabic.",
  },

  // History
  {
    id: 13,
    category: "History",
    fact: "The first revelation came to Prophet Muhammad (ﷺ) in the Cave of Hira when he was 40 years old.",
  },
  {
    id: 14,
    category: "History",
    fact: "The Hijri calendar began in 622 CE, marking the migration (Hijra) from Makkah to Madinah.",
  },
  {
    id: 15,
    category: "History",
    fact: "The Islamic Golden Age (8th–14th century CE) saw major advances in mathematics, astronomy, medicine, and philosophy.",
  },
  {
    id: 16,
    category: "History",
    fact: "Al-Andalus (Islamic Spain) was a center of learning where Muslims, Christians, and Jews coexisted for centuries.",
  },
  {
    id: 17,
    category: "History",
    fact: "The first university in the world, University of Al-Qarawiyyin, was founded in 859 CE by Fatima al-Fihri in Fez, Morocco.",
    source: "UNESCO",
  },
  {
    id: 18,
    category: "History",
    fact: "The Ottoman Caliphate lasted over 600 years (1299–1924).",
  },

  // Prophets
  {
    id: 19,
    category: "Prophets",
    fact: "Adam (AS) is considered the first prophet and the first human in Islam.",
  },
  {
    id: 20,
    category: "Prophets",
    fact: "Nuh (AS) preached for 950 years to his people.",
    source: "Quran 29:14",
  },
  {
    id: 21,
    category: "Prophets",
    fact: "Ibrahim (AS) was willing to sacrifice his son Isma'il (AS) in obedience to Allah's command.",
    source: "Quran 37:102",
  },
  {
    id: 22,
    category: "Prophets",
    fact: "Musa (AS) is the most mentioned prophet in the Quran, referenced 136 times.",
  },
  {
    id: 23,
    category: "Prophets",
    fact: "Isa (AS) was born miraculously without a father and spoke as a baby in the cradle.",
    source: "Quran 19:29-30",
  },
  {
    id: 24,
    category: "Prophets",
    fact: "Muhammad (ﷺ) is the final prophet (Seal of the Prophets) in Islam.",
    source: "Quran 33:40",
  },
  {
    id: 25,
    category: "Prophets",
    fact: "Yunus (AS) was swallowed by a whale and prayed from within its darkness.",
    source: "Quran 21:87",
  },
  {
    id: 26,
    category: "Prophets",
    fact: "Sulayman (AS) could understand the language of birds and commanded the wind.",
    source: "Quran 27:16-17",
  },

  // Angels
  {
    id: 27,
    category: "Angels",
    fact: "Jibril (Gabriel) is the angel responsible for delivering revelation to the prophets.",
  },
  {
    id: 28,
    category: "Angels",
    fact: "Mika'il (Michael) is the angel responsible for sustenance and provision.",
  },
  {
    id: 29,
    category: "Angels",
    fact: "Israfil will blow the Trumpet on the Day of Judgment.",
  },
  {
    id: 30,
    category: "Angels",
    fact: "Malik is the guardian angel of Hell (Jahannam).",
    source: "Quran 43:77",
  },
  {
    id: 31,
    category: "Angels",
    fact: "Each person has two recording angels: one on the right (good deeds) and one on the left (bad deeds).",
    source: "Quran 50:17-18",
  },
  {
    id: 32,
    category: "Angels",
    fact: "Angels are created from light (nur), while jinn are created from smokeless fire.",
    source: "Hadith — Muslim",
  },

  // Hereafter
  {
    id: 33,
    category: "Hereafter",
    fact: "The Day of Judgment is also called Yawm al-Qiyamah, meaning 'Day of Standing'.",
  },
  {
    id: 34,
    category: "Hereafter",
    fact: "Jannah (Paradise) has 8 gates and 4 levels, the highest being Firdaws.",
    source: "Quran 18:107",
  },
  {
    id: 35,
    category: "Hereafter",
    fact: "Jahannam (Hell) has 7 levels, each for different categories of sins.",
    source: "Quran 15:43-44",
  },
  {
    id: 36,
    category: "Hereafter",
    fact: "The resurrection will happen after the trumpet is blown by Israfil. All creation will be raised from their graves.",
    source: "Quran 39:68",
  },
  {
    id: 37,
    category: "Hereafter",
    fact: "The scale (Mizan) will weigh deeds on the Day of Judgment.",
    source: "Quran 21:47",
  },
  {
    id: 38,
    category: "Hereafter",
    fact: "The bridge (Sirat) stretches over Hell; the righteous cross it swiftly, others fall.",
    source: "Hadith — Bukhari",
  },
  {
    id: 39,
    category: "Hereafter",
    fact: "Al-Kawthar is a river in Paradise promised to Prophet Muhammad (ﷺ).",
    source: "Quran 108:1",
  },

  // Science
  {
    id: 40,
    category: "Science",
    fact: "The Quran describes embryonic development in stages: nutfah (drop), alaqah (clot), mudghah (lump).",
    source: "Quran 23:12-14",
  },
  {
    id: 41,
    category: "Science",
    fact: "The expansion of the universe is described in the Quran: 'We are expanding it.'",
    source: "Quran 51:47",
  },
  {
    id: 42,
    category: "Science",
    fact: "The water cycle is described in detail in the Quran, long before modern science.",
    source: "Quran 23:18-19",
  },
  {
    id: 43,
    category: "Science",
    fact: "Mountains are described as having 'pegs' (stakes) stabilizing the earth.",
    source: "Quran 78:6-7",
  },
  {
    id: 44,
    category: "Science",
    fact: "The Quran mentions that every living thing is made from water.",
    source: "Quran 21:30",
  },
  {
    id: 45,
    category: "Science",
    fact: "The sun and moon follow precise orbits — described in the Quran 1,400 years ago.",
    source: "Quran 21:33",
  },
  {
    id: 46,
    category: "Science",
    fact: "The sense of smell was historically key in Islamic culture — Al-Zahrawi described nasal surgery in the 10th century.",
  },
  {
    id: 47,
    category: "Science",
    fact: "The Quran points to the existence of barriers between salt and fresh water.",
    source: "Quran 25:53",
  },
  {
    id: 48,
    category: "Science",
    fact: "Al-Jazari, a 12th-century Muslim engineer, invented the crankshaft and programmable machines.",
    source: "Book of Knowledge of Ingenious Mechanical Devices",
  },
];

const CATEGORIES = [...new Set(FACTS.map((f) => f.category))];

function loadBookmarks(): Set<number> {
  try {
    const raw = localStorage.getItem("knowledge-bookmarks");
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveBookmarks(ids: Set<number>) {
  localStorage.setItem("knowledge-bookmarks", JSON.stringify([...ids]));
}

export default function Knowledge() {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<number>>(loadBookmarks);
  const { t } = useLocale();

  const catLabel = (cat: string) => {
    const map: Record<string, string> = {
      Quran: t("knowledge.categoryQuran"),
      Hadith: t("knowledge.categoryHadith"),
      History: t("knowledge.categoryHistory"),
      Prophets: t("knowledge.categoryProphets"),
      Angels: t("knowledge.categoryAngels"),
      Hereafter: t("knowledge.categoryHereafter"),
      Science: t("knowledge.categoryScience"),
    };
    return map[cat] ?? cat;
  };

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveBookmarks(next);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    let list = FACTS;
    if (category === "Bookmarks")
      list = list.filter((f) => bookmarks.has(f.id));
    else if (category !== "All")
      list = list.filter((f) => f.category === category);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((f) => f.fact.toLowerCase().includes(q));
    }
    return list;
  }, [category, query, bookmarks]);

  return (
    <PageShell head={t("knowledge.pageTitle")} showBack>
      <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-5 text-white">
        <p className="text-sm font-semibold">{t("knowledge.headerTitle")}</p>
        <p className="mt-1 text-sm text-white/80">
          {t("knowledge.headerSubtitle")}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("knowledge.searchPlaceholder")}
          className="w-full rounded-xl border border-border bg-surface-alt py-2.5 pl-9 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
        />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              category === cat
                ? "border-primary bg-primary text-white"
                : "border-border text-text-muted hover:border-primary hover:text-primary dark:border-dark-border dark:text-dark-text-muted"
            }`}
          >
            {cat === "All" ? t("knowledge.filterAll") : catLabel(cat)}
          </button>
        ))}
      </div>

      {/* Facts */}
      <div className="space-y-3">
        {filtered.map((fact) => {
          const saved = bookmarks.has(fact.id);
          return (
            <div
              key={fact.id}
              className={`rounded-2xl border px-5 py-4 transition-all ${
                saved
                  ? "border-primary/40 bg-primary/5 dark:border-primary/30 dark:bg-primary/10"
                  : "border-border bg-surface dark:border-dark-border dark:bg-dark-surface"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="mb-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {catLabel(fact.category)}
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-text dark:text-dark-text">
                    {fact.fact}
                  </p>
                  {fact.source && (
                    <p className="mt-1.5 text-[10px] text-text-muted">
                      — {fact.source}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleBookmark(fact.id)}
                  className={`shrink-0 rounded-lg p-1.5 text-base transition-all ${
                    saved
                      ? "bg-primary text-white"
                      : "text-text-muted hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
                  }`}
                >
                  <BiBookmark />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 text-text-muted">
          <p className="text-sm font-medium">{t("knowledge.noFacts")}</p>
        </div>
      )}

      {/* Bookmark filter */}
      {bookmarks.size > 0 && (
        <button
          type="button"
          onClick={() => {
            if (category === "Bookmarks") setCategory("All");
            else setCategory("Bookmarks");
          }}
          className={`w-full rounded-xl border-2 py-3 text-center text-xs font-medium transition-all ${
            category === "Bookmarks"
              ? "border-primary bg-primary text-white"
              : "border-dashed border-border text-text-muted hover:border-primary hover:text-primary dark:border-dark-border"
          }`}
        >
          {category === "Bookmarks"
            ? t("knowledge.showAll")
            : t("knowledge.viewBookmarks", { count: bookmarks.size })}
        </button>
      )}
    </PageShell>
  );
}

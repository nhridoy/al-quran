import { useEffect, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useSurahs } from "../../../hooks/useSurahs";
import SurahList from "../SurahList/SurahList";

export default function Surahs() {
  const { surahList } = useSurahs();
  const [search, setSearch] = useState("");

  console.log({ surahList });

  useEffect(() => {
    document.title = "Al Quran - Surah List";
  }, []);

  const filtered = useMemo(() => {
    if (!search) return surahList;
    const q = search.toLowerCase();
    return surahList.filter(
      (s) =>
        s.enName.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        s.enNameTranslation.toLowerCase().includes(q) ||
        `${s.no}`.includes(q),
    );
  }, [search, surahList]);

  return (
    <div>
      <div className="mx-4 mb-3 md:mx-6">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 dark:border-dark-border dark:bg-dark-surface-card">
          <BiSearch className="text-text-muted dark:text-dark-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Filter surahs..."
            className="flex-1 bg-transparent py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted dark:text-dark-text-primary dark:placeholder:text-dark-text-muted"
          />
        </div>
      </div>
      <div className="mx-4 md:mx-6">
        {filtered.length > 0 ? (
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface dark:divide-dark-border dark:border-dark-border dark:bg-dark-surface-card">
            {filtered.map((surah) => (
              <Link
                key={surah.no}
                to={`/surah/${surah.no}`}
                className="block transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
              >
                <SurahList data={surah} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-text-muted dark:text-dark-text-muted">
            <BiSearch className="mb-2 text-3xl opacity-40" />
            <p className="text-sm font-medium">No surahs found</p>
          </div>
        )}
      </div>
    </div>
  );
}

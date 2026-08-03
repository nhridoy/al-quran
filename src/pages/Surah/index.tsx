import { useEffect, useMemo, useState } from "react";
import { BiChevronRight, BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import SurahItem from "@/components/quran/SurahItem/SurahItem";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSurahList } from "@/hooks/useSurahList";
import { useLocale } from "@/i18n";
import { searchSurahs } from "@/lib/search";

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-4 px-4 py-3.5">
      <div className="h-12 w-12 shrink-0 rounded-xl bg-border dark:bg-dark-border" />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-36 rounded bg-border dark:bg-dark-border" />
          <div className="h-3 w-24 rounded bg-border dark:bg-dark-border" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-4 w-16 rounded bg-border dark:bg-dark-border" />
          <div className="h-2.5 w-20 rounded bg-border dark:bg-dark-border" />
        </div>
      </div>
      <BiChevronRight className="text-lg text-border dark:text-dark-border" />
    </div>
  );
}

const skeletonRows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
  <SkeletonRow key={`skeleton-${n}`} />
));

export default function Surahs() {
  const { t } = useLocale();
  const { surahList, loading } = useSurahList();
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = t("surah.pageTitle");
  }, [t]);

  const filtered = useMemo(() => {
    if (!search) return surahList;
    return searchSurahs(search, surahList, surahList.length);
  }, [search, surahList]);

  return (
    <div>
      <div className="mx-4 mb-3 md:mx-6">
        <InputGroup>
          <InputGroupAddon>
            <BiSearch className="text-text-muted dark:text-dark-text-muted" />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("surah.filterPlaceholder")}
          />
        </InputGroup>
      </div>
      <div className="mx-4 md:mx-6">
        {loading ? (
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border dark:divide-dark-border dark:border-dark-border">
            {skeletonRows}
          </div>
        ) : filtered.length > 0 ? (
          <div className="card-surface divide-y divide-border dark:divide-dark-border">
            {filtered.map((surah) => (
              <Link
                key={surah.no}
                to={`/surah/${surah.no}`}
                className="block transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
              >
                <SurahItem data={surah} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-text-muted dark:text-dark-text-muted">
            <BiSearch className="mb-2 text-3xl opacity-40" />
            <p className="text-sm font-medium">{t("surah.notFound")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

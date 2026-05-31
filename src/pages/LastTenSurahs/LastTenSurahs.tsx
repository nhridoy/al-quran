import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "../../components/common/Header/Header";
import { useSurahs } from "../../hooks/useSurahs";
import { LAST_TEN_SURAH_IDS } from "../../lib/const";

export default function LastTenSurahs() {
  const { surahList, loading } = useSurahs();
  const navigate = useNavigate();

  const surahs = useMemo(
    () => surahList.filter((s) => LAST_TEN_SURAH_IDS.includes(s.no)),
    [surahList],
  );

  return (
    <div className="min-h-screen">
      <Header head="Last 10 Surahs" showBack />
      <div className="mx-4 space-y-4 pb-8 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Last 10 Surahs
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Surahs 105–114 — commonly recited in prayer
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {LAST_TEN_SURAH_IDS.map((id) => (
              <div
                key={id}
                className="h-28 animate-pulse rounded-2xl bg-surface-alt dark:bg-dark-surface-alt"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {surahs.map((surah) => (
              <Button
                key={surah.no}
                onClick={() => navigate(`/surah/${surah.no}`)}
                variant="secondary-ghost"
                className="w-full justify-start h-auto gap-4 rounded-2xl border border-border bg-surface p-5 text-left hover:border-secondary/30 hover:shadow-md hover:shadow-secondary/5 dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 text-sm font-bold text-secondary dark:from-primary/20 dark:to-secondary/20">
                  {surah.no}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {surah.enName}
                  </p>
                  <p className="text-xs text-text-muted dark:text-dark-text-muted">
                    {surah.enNameTranslation} &bull; {surah.revelationType}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-muted dark:text-dark-text-muted">
                    {surah.numberOfAyahs} verses
                  </p>
                </div>
                <p className="font-arabic text-lg text-text-primary dark:text-dark-text-primary">
                  {surah.name}
                </p>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { IoTrendingUp } from "react-icons/io5";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { useLocale } from "@/i18n";
import { SURAH_COUNT } from "@/lib/const";
import { getSurahList } from "@/lib/db";
import { formatPercentageRead, useReadingStore } from "@/store/reading";
import type { SurahHeader } from "@/types";

// Surah -> Juz mapping (first juz each surah appears in)
const SURAH_TO_JUZ: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3,
  3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8,
  8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 12,
  12, 13, 13, 13, 14, 15, 15, 15, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 19,
  19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 22, 22, 22, 23, 23, 23, 23, 23, 24,
  24, 24,
];

export default function QuranProgress() {
  const records = useReadingStore((s) => s.records);
  const loaded = useReadingStore((s) => s.loaded);
  const loadRecords = useReadingStore((s) => s.load);
  const toggleSurah = useReadingStore((s) => s.toggleSurah);
  const [surahs, setSurahs] = useState<SurahHeader[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    if (!loaded) loadRecords();
    getSurahList().then(setSurahs);
  }, [loaded, loadRecords]);

  const isRead = useMemo(
    () => new Set(records.map((r) => r.surahNo)),
    [records],
  );

  const surahCount = isRead.size;
  const pct = useMemo(() => formatPercentageRead(surahCount), [surahCount]);

  const juzProgress = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const surahsInJuz = SURAH_TO_JUZ.map((j, idx) =>
        j === i + 1 ? idx + 1 : -1,
      ).filter((s) => s !== -1);
      const complete = surahsInJuz.filter((s) => isRead.has(s)).length;
      return { juz: i + 1, total: surahsInJuz.length, complete };
    });
  }, [isRead]);

  if (!loaded || surahs.length === 0) {
    return (
      <PageShell head={t("quranProgress.pageTitle")} showBack>
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-muted">{t("common.loading")}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell head={t("quranProgress.pageTitle")} showBack>
      {/* Overall progress */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <IoTrendingUp className="text-2xl" />
          <div>
            <p className="text-sm font-semibold">{t("quranProgress.title")}</p>
            <p className="text-3xl font-bold">{pct}</p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: pct }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-white/80">
          {t("quranProgress.surahCount", { n: surahCount, m: SURAH_COUNT })}
        </p>
      </div>

      {/* Juz progress */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
          {t("quranProgress.perJuz")}
        </h2>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {juzProgress.map((j) => (
            <div
              key={j.juz}
              className={`flex flex-col items-center rounded-xl px-2 py-2 text-center ${
                j.complete === j.total
                  ? "bg-primary/10"
                  : "bg-surface-alt dark:bg-dark-surface-alt"
              }`}
              title={t("quranProgress.juzLabel", {
                n: j.juz,
                completed: j.complete,
                total: j.total,
              })}
            >
              <span
                className={`text-[10px] font-bold ${
                  j.complete === j.total
                    ? "text-primary"
                    : "text-text-muted dark:text-dark-text-muted"
                }`}
              >
                {j.juz}
              </span>
              <div className="mt-1 h-1 w-full rounded-full bg-border dark:bg-dark-border">
                <div
                  className={`h-full rounded-full transition-all ${
                    j.complete === j.total ? "bg-primary" : "bg-primary/40"
                  }`}
                  style={{
                    width: `${(j.complete / j.total) * 100}%`,
                  }}
                />
              </div>
              <span className="mt-0.5 text-[8px] text-text-muted dark:text-dark-text-muted">
                {j.complete}/{j.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Surah grid */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <h2 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
          {t("quranProgress.surahs")}
        </h2>
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6">
          {surahs.map((surah) => {
            const read = isRead.has(surah.no);
            return (
              <button
                key={surah.no}
                type="button"
                onClick={() =>
                  toggleSurah(surah.no, SURAH_TO_JUZ[surah.no - 1])
                }
                className={`flex flex-col items-center rounded-xl px-2 py-2 text-center transition-colors ${
                  read
                    ? "bg-primary/10 ring-1 ring-primary"
                    : "bg-surface-alt hover:bg-surface-alt/80 dark:bg-dark-surface-alt dark:hover:bg-dark-surface-alt/80"
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    read ? "text-primary" : "text-text dark:text-dark-text"
                  }`}
                >
                  {surah.enName}
                </span>
                <span className="text-[9px] text-text-muted dark:text-dark-text-muted">
                  {surah.no}
                </span>
                <span
                  className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] ${
                    read
                      ? "bg-primary text-white"
                      : "bg-border dark:bg-dark-border"
                  }`}
                >
                  {read ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

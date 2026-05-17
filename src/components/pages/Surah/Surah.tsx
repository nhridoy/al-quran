import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSurah } from "../../../hooks/useSurah";
import { Header } from "../../Header/Header";
import TafsirDrawer from "../../Tafsir/TafsirDrawer";
import Ayahs from "../Ayahs/Ayahs";
import { SurahHead } from "./SurahHead";

export default function SurahPage() {
  const { id } = useParams();
  const { surah } = useSurah(id);
  const [searchParams] = useSearchParams();
  const [tafsirOpen, setTafsirOpen] = useState(false);
  const scrollToAyah = searchParams.get("ayah")
    ? Number(searchParams.get("ayah"))
    : undefined;

  useEffect(() => {
    if (!scrollToAyah) {
      window.scrollTo(0, 0);
      return;
    }
  }, [scrollToAyah]);

  useEffect(() => {
    if (!surah || !scrollToAyah) return;
    const verse = surah.verses.find((v) => v.numberInSurah === scrollToAyah);
    if (!verse) return;
    const el = document.getElementById(`ayah-${verse.totalNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [surah, scrollToAyah]);

  if (!surah) return null;

  return (
    <div>
      <Header surah={surah} showBack />
      <SurahHead surah={surah} />
      <div className="mx-4 space-y-3 pb-24 md:mx-6 md:pb-8">
        {surah.verses.map((ayah) => (
          <Ayahs ayah={ayah} key={ayah.numberInSurah} surah={surah} />
        ))}
        <button
          type="button"
          onClick={() => setTafsirOpen(true)}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-surface p-4 text-sm font-medium text-text-secondary transition-all hover:bg-surface-alt active:scale-[0.98] dark:border-dark-border dark:bg-dark-surface-card dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h12" />
          </svg>
          View Tafsir ({surah.enName})
        </button>
      </div>
      <TafsirDrawer
        open={tafsirOpen}
        onClose={() => setTafsirOpen(false)}
        chapterNumber={surah.no}
        surahName={surah.enName}
      />
    </div>
  );
}

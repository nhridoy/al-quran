import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Header } from "../../components/common/Header/Header";
import Ayah from "../../components/quran/Ayah/Ayah";
import { useSurah } from "../../hooks/useSurah";
import { SurahHead } from "./SurahHead";

export default function SurahPage() {
  const { id } = useParams();
  const { surah } = useSurah(id);
  const [searchParams] = useSearchParams();
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
          <Ayah ayah={ayah} key={ayah.numberInSurah} surah={surah} />
        ))}
      </div>
    </div>
  );
}

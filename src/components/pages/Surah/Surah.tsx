import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSurah } from "../../../hooks/useSurah";
import { Header } from "../../Header/Header";
import Ayahs from "../Ayahs/Ayahs";
import { SurahHead } from "./SurahHead";

export default function SurahPage() {
  const { id } = useParams();
  const { surah } = useSurah(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!surah) return null;

  return (
    <div>
      <Header surah={surah} showBack />
      <SurahHead surah={surah} />
      <div className="mx-4 space-y-3 pb-24 md:mx-6 md:pb-8">
        {surah.verses.map((ayah) => (
          <Ayahs ayah={ayah} key={ayah.numberInSurah} surah={surah} />
        ))}
      </div>
    </div>
  );
}

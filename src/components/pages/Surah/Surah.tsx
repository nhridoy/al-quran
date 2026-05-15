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
      <div className="bg-white dark:bg-[#20282e] sticky top-0 left-0 w-full">
        <Header surah={surah} />
        <SurahHead surah={surah} />
      </div>

      <div className="flex flex-col gap-3">
        {surah.verses.map((ayah) => (
          <Ayahs ayah={ayah} key={ayah.numberInSurah} surah={surah} />
        ))}
      </div>
    </div>
  );
}

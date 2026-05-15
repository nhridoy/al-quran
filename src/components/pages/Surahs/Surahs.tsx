import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSurahs } from "../../../hooks/useSurahs";
import { Home } from "../Home/Home";
import SurahList from "../SurahList/SurahList";

export default function Surahs() {
  const { surahList } = useSurahs();

  useEffect(() => {
    document.title = "Al Quran - Surah List";
  }, []);

  return (
    <div>
      <Home />
      <div className="flex flex-col md:flex-row md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-4">
        {surahList.map((surah) => (
          <Link key={surah.no} to={`/surah/${surah.no}`}>
            <SurahList data={surah} />
          </Link>
        ))}
      </div>
    </div>
  );
}

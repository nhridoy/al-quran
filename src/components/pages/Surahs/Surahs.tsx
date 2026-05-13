import loadable from "@loadable/component";
import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import type { SurahData } from "../../../types";
import { Home } from "../Home/Home";

const SurahList = loadable(() => import("../SurahList/SurahList"));

const Surahs: React.FC = () => {
  const [surahs, setSurahs] = React.useState<SurahData[]>([]);

  useEffect(() => loadSurahList(), []);

  const loadSurahList = () => {
    const isLoaded = parseInt(localStorage.getItem("isLoaded") || "0");
    const surahList: SurahData[] = [];
    for (let index = 1; index <= isLoaded; index++) {
      const loadedSurah: SurahData = JSON.parse(
        localStorage.getItem(String(index)) || "{}",
      );
      surahList.push(loadedSurah);
    }
    setSurahs(surahList);
    document.title = "Al Quran - Surah List";
  };

  return (
    <div className="">
      <Home />
      <div className="flex flex-col md:flex-row md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-4">
        {surahs.map((surah) => (
          <Link key={surah.no} to={`/surah/${surah.no}`}>
            <SurahList data={surah} />
          </Link>
        ))}
        <Outlet />
      </div>
    </div>
  );
};
export default Surahs;

import React, { useEffect } from "react";

import { Link, Outlet } from "react-router-dom";
import { Home } from "../Home/Home";
import { Player } from "../Surah/Player";
import { SurahList } from "../SurahList/SurahList";

export const Surahs = () => {
  const [surahs, setSurahs] = React.useState([]);
  useEffect(() => loadSurahList(), []);

  // Load All Surah List from LocalStorage
  let surahList = [];
  const loadSurahList = () => {
    const isLoaded = parseInt(localStorage.getItem("isLoaded"));
    for (let index = 1; index <= isLoaded; index++) {
      let loadedSurah = JSON.parse(localStorage.getItem(index));
      surahList.push({
        no: loadedSurah.no,
        enName: loadedSurah.enName,
        name: loadedSurah.name,
        enNameTranslation: loadedSurah.enNameTranslation,
        bnNameTranslation: loadedSurah.bnNameTranslation,
        revelationType: loadedSurah.revelationType,
        numberOfAyahs: loadedSurah.numberOfAyahs,
      });
      // console.log(loadedSurah);
    }

    setSurahs(surahList);
    document.title = "Al Quran - Surah List";
  };

  // console.log(surahs);
  return (
    <div className="">
      <Home />
      <div className="flex flex-col md:flex-row md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-4">
        {surahs.map((surah, index) => (
          <Link key={surah.no} exact="true" to={`/surah/${surah.no}`}>
            <SurahList data={surah} key={surah.no} />
          </Link>
        ))}
        {/* <Player /> */}

        <Outlet />
      </div>
    </div>
  );
};

import loadable from "@loadable/component";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import type { SurahData, Verse } from "../../../types";
import { Header } from "../../Header/Header";
import { SurahHead } from "./SurahHead";

const Ayahs = loadable(() => import("../Ayahs/Ayahs"));

export const Surah: React.FC = () => {
  const { id } = useParams();
  const [surah, setSurah] = React.useState<SurahData>({} as SurahData);
  const [ayahs, setAyahs] = React.useState<Verse[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSurahAyahs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.querySelector("html")?.classList.remove("overflow-x-hidden");
    document.querySelector("body")?.classList.remove("overflow-x-hidden");
  }, []);

  const loadSurahAyahs = () => {
    if (!id) return;
    const surahData: SurahData = JSON.parse(localStorage.getItem(id) || "{}");
    setSurah(surahData);
    document.title = surahData.enName;
    setAyahs(surahData.verses);
  };

  return (
    <div>
      <div className="bg-white dark:bg-[#20282e] sticky top-0 left-0 w-full">
        <Header surah={surah} />
        <SurahHead surah={surah} />
      </div>

      <div className="flex flex-col gap-3">
        {ayahs.map((ayah) => (
          <Ayahs ayah={ayah} key={ayah.numberInSurah} />
        ))}
      </div>
    </div>
  );
};

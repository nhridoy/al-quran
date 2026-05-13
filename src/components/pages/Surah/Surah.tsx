import loadable from "@loadable/component";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import type { SurahData, Verse } from "../../../types";
import { Header } from "../../Header/Header";
import { SurahHead } from "./SurahHead";

const Player = loadable(() => import("./Player"));
const Ayahs = loadable(() => import("../Ayahs/Ayahs"));

export const Surah: React.FC = () => {
  const { id } = useParams();
  const [surah, setSurah] = React.useState<SurahData>({} as SurahData);
  const [ayahs, setAyahs] = React.useState<Verse[]>([]);
  const [currentPlaying, setCurrentPlaying] = React.useState<{
    totalNumber: number;
    name?: string;
    singer?: number;
  }>({} as { totalNumber: number; name?: string; singer?: number });
  const [setAudioInstance] = React.useState<unknown>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSurahAyahs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.querySelector("html")?.classList.remove("overflow-x-hidden");
    document.querySelector("body")?.classList.remove("overflow-x-hidden");
  }, []);

  useEffect(() => {
    const current = currentPlaying.totalNumber;
    if (current && ayahs.length > 0) {
      const currentAyah = document.getElementById(`ayah-${current}`);

      if (currentAyah) {
        currentAyah.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });

        const isDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        for (
          let index = ayahs[0].totalNumber;
          index <= ayahs[ayahs.length - 1].totalNumber;
          index++
        ) {
          if (current === index) continue;
          const el = document.getElementById(`ayah-${index}`);
          if (!el) continue;
          if (isDark) {
            if (el.classList.contains("bg-[#14191d]"))
              el.classList.remove("bg-[#14191d]");
          } else {
            if (el.classList.contains("bg-alternateSecondDeep"))
              el.classList.remove("bg-alternateSecondDeep");
          }
        }

        if (isDark) {
          currentAyah.classList.add("bg-[#14191d]");
        } else {
          currentAyah.classList.add("bg-alternateSecondDeep");
        }
      }
    }
  }, [currentPlaying, ayahs]);

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
        <SurahHead surah={surah} audioInstance={null} />
      </div>
      <Player
        audioInstance={setAudioInstance}
        currentPlaying={setCurrentPlaying}
        surah={[]}
      />
      <div className="flex flex-col gap-3">
        {ayahs.map((ayah) => (
          <Ayahs ayah={ayah} key={ayah.numberInSurah} />
        ))}
      </div>
    </div>
  );
};

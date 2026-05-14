import loadable from "@loadable/component";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import type { ParaSurah, Verse } from "../../../types";
import { paraCreation } from "../../../utilities/paraCreation";
import { Header } from "../../Header/Header";
import { ParaHead } from "../ParaHead/ParaHead";

export const Para: React.FC = () => {
  const [currentPlaying, setCurrentPlaying] = React.useState<{
    totalNumber: number;
    name?: string;
    singer?: number;
  }>({} as { totalNumber: number; name?: string; singer?: number });

  const [ayahs, setAyahs] = React.useState<Verse[]>([]);
  const { id } = useParams();

  useEffect(() => {
    document.title = `Para - ${id}`;
    window.scrollTo(0, 0);
  }, [id]);

  const paraDetails = paraCreation();
  const para: ParaSurah[] | undefined = id ? paraDetails[id] : undefined;

  useEffect(() => {
    setAyahs([]);
    document.querySelector("html")?.classList.remove("overflow-x-hidden");
    document.querySelector("body")?.classList.remove("overflow-x-hidden");
    para?.forEach((surah) => {
      surah.verses.forEach((ayah) => {
        setAyahs((prev) => [...prev, ayah]);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const current = currentPlaying.totalNumber;
    if (current && ayahs.length > 0) {
      const currentAyah = document.getElementById(`ayah-${current}`);

      if (currentAyah) {
        currentAyah.scrollIntoView({
          behavior: "smooth",
          block: "center",
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

  return (
    <div className="">
      <div className="sticky top-0 left-0 z-10 w-full bg-white">
        <Header head={`Para ${id}`} />
      </div>

      {para?.map((paraItem) => (
        <ParaHead para={paraItem} key={paraItem.no} />
      ))}
    </div>
  );
};

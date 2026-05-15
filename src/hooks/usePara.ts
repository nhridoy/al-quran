import { useMemo } from "react";
import type { ParaSurah, SurahData } from "../types";

export function usePara(
  id: string | undefined,
  surahs: Record<string, SurahData>,
) {
  return useMemo(() => {
    if (!id || Object.keys(surahs).length === 0) return null;

    const paraList: Record<string, ParaSurah[]> = {};
    for (let i = 1; i <= 30; i++) {
      paraList[i] = [];
    }

    let currentPara = 1;
    for (let index = 1; index <= 114; index++) {
      const surah = surahs[String(index)];
      if (!surah) continue;

      for (const verse of surah.verses) {
        if (currentPara === verse.juz) {
          const target = paraList[currentPara];
          const last = target[target.length - 1];
          if (!last || last.no !== surah.no) {
            target.push({
              name: surah.name,
              enName: surah.enName,
              enNameTranslation: surah.enNameTranslation,
              bnNameTranslation: surah.bnNameTranslation,
              no: surah.no,
              revelationType: surah.revelationType,
              verses: [verse],
            });
          } else {
            last.verses.push(verse);
          }
        } else if (currentPara + 1 === verse.juz) {
          currentPara += 1;
          const target = paraList[currentPara];
          const last = target[target.length - 1];
          if (!last || last.no !== surah.no) {
            target.push({
              name: surah.name,
              enName: surah.enName,
              enNameTranslation: surah.enNameTranslation,
              bnNameTranslation: surah.bnNameTranslation,
              no: surah.no,
              revelationType: surah.revelationType,
              verses: [verse],
            });
          } else {
            last.verses.push(verse);
          }
        }
      }
    }

    return id ? (paraList[id] ?? null) : null;
  }, [id, surahs]);
}

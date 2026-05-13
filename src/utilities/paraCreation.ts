import type { ParaSurah, SurahData } from "../types";

export const paraCreation = (): Record<string, ParaSurah[]> => {
  const paraList: Record<string, ParaSurah[]> = {};
  const totalPara = 30;
  [...Array(totalPara)].forEach((_, index) => {
    paraList[index + 1] = [];
  });

  if (Object.keys(paraList).length) {
    let currentPara = 1;
    for (let index = 1; index <= 114; index++) {
      const surah: SurahData = JSON.parse(localStorage.getItem(String(index)) || "{}");
      surah.verses.forEach((verse) => {
        if (currentPara === verse.juz) {
          if (
            paraList[currentPara].length < surah.no &&
            !paraList[currentPara].some((item) => item.no === surah.no)
          ) {
            paraList[currentPara].push({
              name: surah.name,
              enName: surah.enName,
              enNameTranslation: surah.enNameTranslation,
              bnNameTranslation: surah.bnNameTranslation,
              no: surah.no,
              revelationType: surah.revelationType,
              verses: [verse],
            });
          } else {
            paraList[currentPara][paraList[currentPara].length - 1].verses.push(
              verse
            );
          }
        } else if (currentPara + 1 === verse.juz) {
          currentPara += 1;
          if (paraList[currentPara].length < surah.no) {
            paraList[currentPara].push({
              name: surah.name,
              enName: surah.enName,
              enNameTranslation: surah.enNameTranslation,
              bnNameTranslation: surah.bnNameTranslation,
              no: surah.no,
              revelationType: surah.revelationType,
              verses: [verse],
            });
          } else {
            paraList[currentPara][paraList[currentPara].length - 1].verses.push(
              verse
            );
          }
        }
      });
    }
  }
  return paraList;
};

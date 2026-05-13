import type { SurahData } from "../types";

export const dataFetching = (setLoading: (value: boolean) => void): Promise<void> => {
  document.title = "Al Quran";
  let count = 0;
  localStorage.getItem("isLoaded") === null &&
    localStorage.setItem("isLoaded", "0");

  if (parseInt(localStorage.getItem("isLoaded") || "0") < 114) {
    return fetch(
      "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v2/singleSurah.min.json"
    )
      .then((res: Response) => res.json())
      .then((data: { singleSurah: Record<string, SurahData> }) => {
        const loadedData: Record<string, SurahData> = {};
        Object.keys(data.singleSurah).forEach((key) => {
          loadedData[key] = {
            no: data.singleSurah[key].no,
            name: data.singleSurah[key].name,
            enName: data.singleSurah[key].enName,
            enNameTranslation: data.singleSurah[key].enNameTranslation,
            bnNameTranslation: data.singleSurah[key].bnNameTranslation,
            revelationType: data.singleSurah[key].revelationType,
            numberOfAyahs: data.singleSurah[key].numberOfAyahs,
            verses: data.singleSurah[key].verses.map((verse) => ({
              text: verse.text,
              bnText: verse.bnText,
              enText: verse.enText,
              enTextTransliteration: verse.enTextTransliteration,
              audioPrimary: verse.audioPrimary,
              numberInSurah: verse.numberInSurah,
              totalNumber: verse.totalNumber,
              juz: verse.juz,
              sajda: verse.sajda,
            })),
          };
        });

        Object.keys(loadedData).forEach((key) => {
            try {
              localStorage.setItem(key, JSON.stringify(loadedData[key]));
              localStorage.setItem("isLoaded", String(++count));
              setLoading(parseInt(localStorage.getItem("isLoaded") || "0") < 114);
            } catch (error) {
              alert("Error Fetching Surah! Press OK to Try Again.");
              window.location.reload();
              localStorage.clear();
            }
          });
      });
  }
  return Promise.resolve();
};

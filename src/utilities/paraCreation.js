export const paraCreation = () => {
  let paraList = {};
  const totalPara = 30;
  [...Array(totalPara)].map((_, index) => {
    paraList[index + 1] = [];
  });
  // console.log("paraCreation: paraList: ", paraList);

  // Total Verses in a juz
  //   if (Object.keys(paraList).length) {
  //     for (let index = 1; index <= 114; index++) {
  //       const surah = JSON.parse(localStorage.getItem(index));
  //       surah.verses.map((verse) => {
  //         paraList[verse.juz].push(verse);
  //       });
  //     }
  //   }
  //   console.log(paraList);

  // Total Verses divided by Juz
  if (Object.keys(paraList).length) {
    let currentPara = 1;
    for (let index = 1; index <= 114; index++) {
      const surah = JSON.parse(localStorage.getItem(index));
      surah.verses.map((verse) => {
        if (currentPara === verse.juz) {
          //   console.log(paraList[currentPara].length);
          //   console.log(surah.no);
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
          } /* if(paraList[currentPara] == surah.no) */ else {
            // console.log(
            //   paraList[currentPara][paraList[currentPara].length - 1]
            // );
            // console.log(Array.isArray(paraList[currentPara].verses));
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
          } /* if(paraList[currentPara] == surah.no) */ else {
            paraList[currentPara][paraList[currentPara].length - 1].verses.push(
              verse
            );
          }
        }
        //   paraList[verse.juz].push(verse);
      });
    }
  }
  return paraList;
};

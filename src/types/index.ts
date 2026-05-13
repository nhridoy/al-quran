export interface Verse {
  text: string;
  bnText: string;
  enText: string;
  enTextTransliteration: string;
  audioPrimary: string;
  numberInSurah: number;
  totalNumber: number;
  juz: number;
  sajda: {
    recommended: boolean;
    obligatory: boolean;
  };
}

export interface SurahData {
  no: number;
  name: string;
  enName: string;
  enNameTranslation: string;
  bnNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  verses: Verse[];
}

export interface ParaSurah {
  name: string;
  enName: string;
  enNameTranslation: string;
  bnNameTranslation: string;
  no: number;
  revelationType: string;
  verses: Verse[];
}

export interface CurrentAudioIndex {
  surahName: string;
  verseNumber: number;
}

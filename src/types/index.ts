export interface Sajda {
  recommended: boolean;
  obligatory: boolean;
}

export interface VerseText {
  arText: string;
  enText: string;
  enTextTransliteration: string;
  bnText: string;
  bntextLatin: string;
}

export interface VerseAudioUrls {
  primary: string;
  secondary: string;
  tertiary: string;
  alternative: string;
}

export interface VerseImageUrls {
  primary: string;
  secondary: string;
  alternative: string;
  "alternative-high": string;
}

export interface Verse {
  text: VerseText;
  numberInSurah: number;
  totalNumber: number;
  juz: number;
  sajda: Sajda;
  audio?: VerseAudioUrls;
  image?: VerseImageUrls;
}

export interface SurahData {
  no: number;
  name: string;
  enName: string;
  enNameTranslation: string;
  bnNameTranslation: string;
  revelationType: string;
  revelationOrder: number;
  numberOfAyahs: number;
  verses: Verse[];
}

export interface ReciterInfo {
  identifier: string;
  name: string;
  englishName: string;
}

export interface ReciterInfo {
  identifier: string;
  name: string;
  englishName: string;
}

export interface TafsirInfo {
  id: string;
  lang: string;
  language: string;
  name: string;
  authorName: string;
}

export interface AppSettings {
  theme: "system" | "light" | "dark";
  arabicFontSize: number;
  translationFontSize: number;
  translationLang: "en" | "bn";
  reciterId: string;
  tafsirId: string;
  prayerCalcMethod: string;
  prayerAsrMethod: "shafii" | "hanafi";
  hijriAdjust: number;
  tajweedEnabled: boolean;
  tafsirEnabled: boolean;
  onboardingComplete: boolean;
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

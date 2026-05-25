// ===== Upstream API types (nhridoy/quran-api v4) =====

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

export interface VerseTextEntry {
  totalNumber: number;
  numberInSurah: number;
  juz: number;
  sajda: Sajda;
  text: VerseText;
}

export interface SurahHeader {
  no: number;
  name: string;
  enName: string;
  enNameTranslation: string;
  bnNameTranslation: string;
  revelationType: "Meccan" | "Medinan";
  revelationOrder: number;
  numberOfAyahs: number;
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

export interface VerseAudioEntry {
  totalNumber: number;
  numberInSurah: number;
  juz: number;
  audio: VerseAudioUrls;
}

export interface VerseImageEntry {
  totalNumber: number;
  numberInSurah: number;
  juz: number;
  image: VerseImageUrls;
}

export interface VerseTafsirEntry {
  totalNumber: number;
  numberInSurah: number;
  juz: number;
  lang: string;
  authorName: string;
  tafsirName: string;
  tafsir: string;
}

// ===== Reciters =====

export type ReciterKey =
  | "ar.abdullahbasfar"
  | "ar.abdurrahmaansudais"
  | "ar.abdulsamad"
  | "ar.ahmedajamy"
  | "ar.alafasy"
  | "ar.aymanswoaid"
  | "ar.hanirifai"
  | "ar.hudhaify"
  | "ar.husary"
  | "ar.husarymujawwad"
  | "ar.ibrahimakhbar"
  | "ar.mahermuaiqly"
  | "ar.muhammadayyoub"
  | "ar.muhammadjibreel"
  | "ar.parhizgar"
  | "ar.saoodshuraym"
  | "ar.shaatree";

export interface ReciterInfo {
  identifier: ReciterKey;
  name: string;
  englishName: string;
}

// ===== Tafsir IDs =====

export type TafsirLanguage = "ar" | "bn" | "en" | "ku" | "ru" | "ur";

export type ArabicTafsirId =
  | "ar-tafseer-al-qurtubi"
  | "ar-tafseer-al-saddi"
  | "ar-tafsir-al-baghawi"
  | "ar-tafsir-al-tabari"
  | "ar-tafsir-al-wasit"
  | "ar-tafsir-ibn-kathir"
  | "ar-tafsir-muyassar";

export type BengaliTafsirId =
  | "bn-tafseer-ibn-e-kaseer"
  | "bn-tafsir-abu-bakr-zakaria"
  | "bn-tafsir-ahsanul-bayaan"
  | "tafisr-fathul-majid-bn";

export type EnglishTafsirId =
  | "en-tafisr-ibn-kathir"
  | "en-tafsir-maarif-ul-quran";

export type KurdishTafsirId = "kurd-tafsir-rebar";
export type RussianTafsirId = "ru-tafseer-al-saddi";

export type UrduTafsirId =
  | "tafseer-ibn-e-kaseer-urdu"
  | "tafsir-bayan-ul-quran"
  | "tafsir-fe-zalul-quran-syed-qatab";

export type TafsirId =
  | ArabicTafsirId
  | BengaliTafsirId
  | EnglishTafsirId
  | KurdishTafsirId
  | RussianTafsirId
  | UrduTafsirId;

export interface TafsirInfo {
  id: TafsirId;
  lang: TafsirLanguage;
  language: string;
  name: string;
  authorName: string;
}

// ===== App-level merged types =====

export interface Verse extends VerseTextEntry {
  audio?: VerseAudioUrls;
  image?: VerseImageUrls;
}

export interface SurahData extends SurahHeader {
  verses: Verse[];
}

export type ParaSurah = SurahData;

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

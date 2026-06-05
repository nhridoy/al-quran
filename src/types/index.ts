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

// ===== Tafsir API response types =====

export interface TafsirVerseEntry {
  numberInSurah?: number;
  lang?: string;
  authorName?: string;
  tafsirName?: string;
  tafsir?: string;
}

export interface TafsirApiResponse {
  verses?: TafsirVerseEntry[];
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

// ===== Role-based settings interfaces (ISP) =====

export interface ThemeSettings {
  theme: "system" | "light" | "dark";
}

export interface FontSettings {
  arabicFontSize: number;
  translationFontSize: number;
}

export interface TranslationSettings {
  translationLang: "en" | "bn";
}

export interface HadithSettings {
  hadithLang: "en" | "bn";
}

export interface ReciterSettings {
  reciterId: string;
}

export interface TafsirSettings {
  tafsirId: string;
  tafsirEnabled: boolean;
}

export interface PrayerSettings {
  prayerCalcMethod: string;
  prayerAsrMethod: "shafii" | "hanafi";
}

export interface MiscSettings {
  hijriAdjust: number;
  tajweedEnabled: boolean;
  onboardingComplete: boolean;
}

export interface AppSettings
  extends ThemeSettings,
    FontSettings,
    TranslationSettings,
    HadithSettings,
    ReciterSettings,
    TafsirSettings,
    PrayerSettings,
    MiscSettings {}

// ===== Hadith types =====

export type HadithEditionName = Record<string, string>;

export interface HadithEdition {
  id: string;
  slug: string;
  bookCount: number;
  hadithCount: number;
  availableLanguages: string[];
  name: HadithEditionName;
}

export type HadithEditions = HadithEdition[];

export type HadithBookName = Record<string, string>;

export interface HadithBook {
  id: string;
  editionId: string;
  bookIndex: number;
  hadithCount: number;
  hadithIndexStart: number;
  name: HadithBookName;
}

export type HadithBooks = HadithBook[];

export interface HadithGrade {
  id: string;
  name: string;
  grade: string;
}

export interface HadithEntry {
  id: string;
  editionId: string;
  bookIndex: number;
  hadithIndex: number;
  bookHadithIndex: number;
  text: string;
  grades: HadithGrade[];
}

export interface HadithCollection {
  total: number;
  items: HadithEntry[];
}

export interface HadithSearchResult {
  editionSlug: string;
  editionName: string;
  bookIndex: number;
  bookName: string;
  hadith: HadithEntry;
}

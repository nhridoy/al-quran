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

export interface TafsirInfo {
  id: string;
  lang: string;
  language: string;
  name: string;
  authorName: string;
}

export const LANGUAGES: Record<string, string> = {
  en: "English",
  bn: "বাংলা",
  ar: "العربية",
  ur: "اردو",
  ru: "Русский",
  ku: "Kurdî",
};

export const TAFSIR_LIST: TafsirInfo[] = [
  {
    id: "ar-tafseer-al-qurtubi",
    lang: "ar",
    language: "Arabic",
    name: "Al-Qurtubi",
    authorName: "Al-Qurtubi",
  },
  {
    id: "ar-tafseer-al-saddi",
    lang: "ar",
    language: "Arabic",
    name: "Al-Saddi",
    authorName: "Al-Saddi",
  },
  {
    id: "ar-tafsir-al-baghawi",
    lang: "ar",
    language: "Arabic",
    name: "Al-Baghawi",
    authorName: "Al-Baghawi",
  },
  {
    id: "ar-tafsir-al-tabari",
    lang: "ar",
    language: "Arabic",
    name: "Al-Tabari",
    authorName: "Al-Tabari",
  },
  {
    id: "ar-tafsir-al-wasit",
    lang: "ar",
    language: "Arabic",
    name: "Al-Wasit",
    authorName: "Al-Wasit",
  },
  {
    id: "ar-tafsir-ibn-kathir",
    lang: "ar",
    language: "Arabic",
    name: "Ibn Kathir",
    authorName: "Ibn Kathir",
  },
  {
    id: "ar-tafsir-muyassar",
    lang: "ar",
    language: "Arabic",
    name: "Al-Muyassar",
    authorName: "Al-Muyassar",
  },
  {
    id: "bn-tafseer-ibn-e-kaseer",
    lang: "bn",
    language: "Bengali",
    name: "Ibn-e-Kaseer (Bengali)",
    authorName: "Ibn-e-Kaseer",
  },
  {
    id: "bn-tafsir-abu-bakr-zakaria",
    lang: "bn",
    language: "Bengali",
    name: "Abu Bakr Zakaria",
    authorName: "Dr. Abu Bakr Zakaria",
  },
  {
    id: "bn-tafsir-ahsanul-bayaan",
    lang: "bn",
    language: "Bengali",
    name: "Ahsanul Bayaan",
    authorName: "Ahsanul Bayaan",
  },
  {
    id: "tafisr-fathul-majid-bn",
    lang: "bn",
    language: "Bengali",
    name: "Fathul Majid",
    authorName: "Fathul Majid",
  },
  {
    id: "en-tafisr-ibn-kathir",
    lang: "en",
    language: "English",
    name: "Ibn Kathir (abridged)",
    authorName: "Ibn Kathir",
  },
  {
    id: "en-tafsir-maarif-ul-quran",
    lang: "en",
    language: "English",
    name: "Ma'arif al-Qur'an",
    authorName: "Mufti Muhammad Shafi",
  },
  {
    id: "tafseer-ibn-e-kaseer-urdu",
    lang: "ur",
    language: "Urdu",
    name: "تفسیر ابن کثیر (Urdu)",
    authorName: "Hafiz Ibn Kathir",
  },
  {
    id: "tafsir-bayan-ul-quran",
    lang: "ur",
    language: "Urdu",
    name: "Bayan ul Quran",
    authorName: "Dr. Israr Ahmad",
  },
  {
    id: "tafsir-fe-zalul-quran-syed-qatab",
    lang: "ur",
    language: "Urdu",
    name: "Fi Zilal al-Quran (Urdu)",
    authorName: "Sayyid Qutb",
  },
  {
    id: "ru-tafseer-al-saddi",
    lang: "ru",
    language: "Russian",
    name: "As-Sa'di (Russian)",
    authorName: "As-Sa'di",
  },
  {
    id: "kurd-tafsir-rebar",
    lang: "ku",
    language: "Kurdish",
    name: "Rebar Kurdish Tafsir",
    authorName: "As-Sa'di",
  },
];

export const RECITERS: ReciterInfo[] = [
  {
    identifier: "ar.abdullahbasfar",
    name: "عبد الله بصفر",
    englishName: "Abdullah Basfar",
  },
  {
    identifier: "ar.abdurrahmaansudais",
    name: "عبد الرحمن السديس",
    englishName: "Abdurrahmaan As-Sudais",
  },
  {
    identifier: "ar.abdulsamad",
    name: "عبد الصمد",
    englishName: "Abdul Samad",
  },
  {
    identifier: "ar.ahmedajamy",
    name: "أحمد بن علي العجمي",
    englishName: "Ahmed ibn Ali al-Ajamy",
  },
  { identifier: "ar.alafasy", name: "مشاري العفاسي", englishName: "Alafasy" },
  {
    identifier: "ar.aymanswoaid",
    name: "أيمن سويد",
    englishName: "Ayman Sowaid",
  },
  {
    identifier: "ar.hanirifai",
    name: "هاني الرفاعي",
    englishName: "Hani Rifai",
  },
  { identifier: "ar.hudhaify", name: "علي الحذيفي", englishName: "Hudhaify" },
  { identifier: "ar.husary", name: "محمود خليل الحصري", englishName: "Husary" },
  {
    identifier: "ar.husarymujawwad",
    name: "محمود خليل الحصري (المجود)",
    englishName: "Husary (Mujawwad)",
  },
  {
    identifier: "ar.ibrahimakhbar",
    name: "إبراهيم الأخضر",
    englishName: "Ibrahim Akhdar",
  },
  {
    identifier: "ar.mahermuaiqly",
    name: "ماهر المعيقلي",
    englishName: "Maher Al Muaiqly",
  },
  {
    identifier: "ar.muhammadayyoub",
    name: "محمد أيوب",
    englishName: "Muhammad Ayyoub",
  },
  {
    identifier: "ar.muhammadjibreel",
    name: "محمد جبريل",
    englishName: "Muhammad Jibreel",
  },
  { identifier: "ar.parhizgar", name: "پرهیزگار", englishName: "Parhizgar" },
  {
    identifier: "ar.saoodshuraym",
    name: "سعود الشريم",
    englishName: "Saood bin Ibraaheem Ash-Shuraym",
  },
  {
    identifier: "ar.shaatree",
    name: "أبو بكر الشاطري",
    englishName: "Abu Bakr Ash-Shaatree",
  },
];

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

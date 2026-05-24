export interface Qari {
  id: string;
  name: string;
  nameAr: string;
  baseUrl: string;
}

export const QARIS: Qari[] = [
  {
    id: "alafasy",
    name: "Mishary Al-Afasy",
    nameAr: "مشاري العفاسي",
    baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy",
  },
  {
    id: "sudais",
    name: "Abdur Rahman As-Sudais",
    nameAr: "عبد الرحمن السديس",
    baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.sudais",
  },
  {
    id: "shuraym",
    name: "Saud Al-Shuraym",
    nameAr: "سعود الشريم",
    baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.shuraym",
  },
  {
    id: "ghamdi",
    name: "Saad Al-Ghamdi",
    nameAr: "سعد الغامدي",
    baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.ghamdi",
  },
  {
    id: "basit",
    name: "Abdul Basit",
    nameAr: "عبد الباسط",
    baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit",
  },
];

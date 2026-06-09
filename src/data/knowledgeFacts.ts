export interface KnowledgeFact {
  fact: string;
  category: string;
}

export const KNOWLEDGE_FACTS: KnowledgeFact[] = [
  { fact: "The Quran has 114 surahs and 6,236 verses.", category: "Quran" },
  {
    fact: "Surah Al-Baqarah is the longest surah in the Quran.",
    category: "Quran",
  },
  {
    fact: "Surah Al-Kawthar is the shortest surah in the Quran.",
    category: "Quran",
  },
  { fact: "The word 'Quran' means 'recitation' in Arabic.", category: "Quran" },
  {
    fact: "Laylatul Qadr is better than a thousand months.",
    category: "Worship",
  },
  { fact: "There are 99 names of Allah (Asma ul-Husna).", category: "Faith" },
  {
    fact: "The first revelation came in the cave of Hira.",
    category: "History",
  },
  { fact: "Ramadan is the month the Quran was revealed.", category: "Worship" },
  {
    fact: "Salah was made obligatory during the Mi'raj (ascension).",
    category: "Worship",
  },
  { fact: "Zakah is one of the five pillars of Islam.", category: "Faith" },
  {
    fact: "The Kaaba in Mecca is the qibla for all Muslims.",
    category: "Faith",
  },
  { fact: "There are 30 juz (paras) in the Quran.", category: "Quran" },
];

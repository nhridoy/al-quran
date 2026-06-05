import type {
  HadithBook,
  HadithCollection,
  HadithEdition,
  SurahData,
  SurahHeader,
  TafsirApiResponse,
  VerseAudioUrls,
} from "@/types";

type AudioApiResponse = { verses: { audio: VerseAudioUrls }[] };
type JuzApiResponse = { surah: SurahData[] };

export interface QuranApiClient {
  getSurahList(): Promise<SurahHeader[]>;
  getSurahVerse(id: number): Promise<SurahData>;
  getSurahAudio(reciterId: string, surahNo: number): Promise<AudioApiResponse>;
  getJuzVerse(juzNo: number): Promise<JuzApiResponse>;
  getSurahTafsir(
    lang: string,
    tafsirId: string,
    surahNo: number,
  ): Promise<TafsirApiResponse>;
  getJuzAudio(reciterId: string, juzNo: number): Promise<AudioApiResponse>;
  getJuzTafsir(
    lang: string,
    tafsirId: string,
    juzNo: number,
  ): Promise<TafsirApiResponse>;
  getEditions(): Promise<HadithEdition[]>;
  getBooksOfEdition(slug: string): Promise<HadithBook[]>;
  getHadithsOfBook(
    slug: string,
    bookIndex: number,
    lang: string,
  ): Promise<HadithCollection>;
}

const BASE = "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v4";

export const HADITH_BASE = `${BASE}/hadith`;

async function fetchJson<T>(url: string, notFoundFallback?: T): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404 && notFoundFallback !== undefined) {
      return notFoundFallback;
    }
    throw new Error(`API error: ${res.status} ${res.statusText} for ${url}`);
  }
  return res.json() as Promise<T>;
}

export const quranApiClient: QuranApiClient = {
  getSurahList() {
    return fetchJson<SurahHeader[]>(`${BASE}/surah/list.min.json`);
  },
  getSurahVerse(id) {
    return fetchJson<SurahData>(`${BASE}/surah/verse/${id}.min.json`);
  },
  getSurahAudio(reciterId, surahNo) {
    return fetchJson<AudioApiResponse>(
      `${BASE}/surah/audio/${reciterId}/${surahNo}.min.json`,
      { verses: [] },
    );
  },
  getJuzVerse(juzNo) {
    return fetchJson<JuzApiResponse>(`${BASE}/juz/verse/${juzNo}.min.json`);
  },
  getSurahTafsir(lang, tafsirId, surahNo) {
    return fetchJson(
      `${BASE}/surah/tafsir/${lang}/${tafsirId}/${surahNo}.min.json`,
    );
  },
  getJuzAudio(reciterId, juzNo) {
    return fetchJson<AudioApiResponse>(
      `${BASE}/juz/audio/${reciterId}/${juzNo}.min.json`,
      { verses: [] },
    );
  },
  getJuzTafsir(lang, tafsirId, juzNo) {
    return fetchJson(
      `${BASE}/juz/tafsir/${lang}/${tafsirId}/${juzNo}.min.json`,
    );
  },
  getEditions() {
    return fetchJson<HadithEdition[]>(`${HADITH_BASE}/editions.min.json`);
  },
  getBooksOfEdition(slug) {
    return fetchJson<HadithBook[]>(`${HADITH_BASE}/${slug}/books.min.json`);
  },
  getHadithsOfBook(slug, bookIndex, lang) {
    return fetchJson<HadithCollection>(
      `${HADITH_BASE}/${slug}/${slug}-${bookIndex}/${lang}/hadith.min.json`,
    );
  },
};

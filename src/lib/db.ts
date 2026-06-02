import { type IDBPDatabase, openDB } from "idb";
import type { SurahData, VerseAudioUrls } from "@/types";
import { SURAH_COUNT } from "./const";

const DB_NAME = "al-quran";
const DB_VERSION = 8;

const STORE_NAMES = [
  "surah-verses",
  "surah-audio",
  "surah-tafsir",
  "juz-verses",
  "juz-audio",
  "juz-tafsir",
  "bookmarks",
  "settings",
  "duas",
  "prayerSettings",
  "hadith",
] as const;

export type StoreName = (typeof STORE_NAMES)[number];

const BASE = "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v4";

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        for (const store of STORE_NAMES) {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store);
          }
        }
      },
    }).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

export async function getFromStore<T>(
  storeName: StoreName,
  key: string,
): Promise<T | undefined> {
  const db = await getDb();
  return db.get(storeName, key) as Promise<T | undefined>;
}

export async function putInStore<T>(
  storeName: StoreName,
  key: string,
  value: T,
): Promise<void> {
  const db = await getDb();
  await db.put(storeName, value, key);
}

export async function deleteFromStore(
  storeName: StoreName,
  key: string,
): Promise<void> {
  const db = await getDb();
  await db.delete(storeName, key);
}

export async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  const db = await getDb();
  const result = await db.getAll(storeName);
  return result as T[];
}

async function clearStore(storeName: StoreName): Promise<void> {
  const db = await getDb();
  await db.clear(storeName);
}

async function getKeys(storeName: StoreName): Promise<string[]> {
  const db = await getDb();
  const result = await db.getAllKeys(storeName);
  return result as string[];
}

async function fetchSurahVerse(id: number): Promise<SurahData> {
  const res = await fetch(`${BASE}/surah/verse/${id}.min.json`);
  if (!res.ok) throw new Error(`Failed to fetch surah ${id}`);
  return res.json() as Promise<SurahData>;
}

async function fetchAllSurahsFromApi(): Promise<Record<string, SurahData>> {
  const ids = Array.from({ length: SURAH_COUNT }, (_, i) => i + 1);
  const results = await Promise.allSettled(
    ids.map((id) => fetchSurahVerse(id)),
  );
  const map: Record<string, SurahData> = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      const surah = result.value;
      map[String(surah.no)] = surah;
    }
  }
  if (Object.keys(map).length === 0) {
    throw new Error("Failed to fetch any surah data");
  }
  return map;
}

export async function getSurahs(): Promise<Record<string, SurahData>> {
  const keys = await getKeys("surah-verses");
  if (keys.length === SURAH_COUNT) {
    const map: Record<string, SurahData> = {};
    for (let i = 1; i <= SURAH_COUNT; i++) {
      const key = String(i);
      const surah = await getFromStore<SurahData>("surah-verses", key);
      if (surah) map[key] = surah;
    }
    if (Object.keys(map).length === SURAH_COUNT) return map;
  }

  const fresh = await fetchAllSurahsFromApi();
  for (const [key, surah] of Object.entries(fresh)) {
    await putInStore("surah-verses", key, surah);
  }
  return fresh;
}

export async function getSurah(id: string): Promise<SurahData | undefined> {
  const cached = await getFromStore<SurahData>("surah-verses", id);
  if (cached) return cached;

  const all = await getSurahs();
  return all[id];
}

export async function clearCache(): Promise<void> {
  await clearStore("surah-verses");
  await clearStore("surah-audio");
  await clearStore("surah-tafsir");
  await clearStore("juz-verses");
  await clearStore("juz-audio");
  await clearStore("juz-tafsir");
}

export async function clearAudioCache(): Promise<void> {
  await clearStore("surah-audio");
  await clearStore("juz-audio");
}

export async function clearTafsirCache(): Promise<void> {
  await clearStore("surah-tafsir");
  await clearStore("juz-tafsir");
}

export async function refreshData(): Promise<Record<string, SurahData>> {
  await clearStore("surah-verses");
  const fresh = await fetchAllSurahsFromApi();
  for (const [key, surah] of Object.entries(fresh)) {
    await putInStore("surah-verses", key, surah);
  }
  return fresh;
}

export async function getAudioData(
  reciterId: string,
  surahNo: number,
): Promise<VerseAudioUrls[]> {
  const key = String(surahNo);
  const cached = await getFromStore<{ verses: { audio: VerseAudioUrls }[] }>(
    "surah-audio",
    key,
  );
  if (cached) return cached.verses.map((v) => v.audio);

  const res = await fetch(
    `${BASE}/surah/audio/${reciterId}/${surahNo}.min.json`,
  );
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`Failed to fetch audio for surah ${surahNo}`);
  }
  const data = await res.json();
  const urls = data.verses.map(
    (v: { audio: VerseAudioUrls }) => v.audio,
  ) as VerseAudioUrls[];
  await putInStore("surah-audio", key, data);
  return urls;
}

export async function getJuzData(
  juzNo: number,
): Promise<Record<string, SurahData>> {
  const key = String(juzNo);
  const cached = await getFromStore<Record<string, SurahData>>(
    "juz-verses",
    key,
  );
  if (cached) return cached;

  const res = await fetch(`${BASE}/juz/verse/${juzNo}.min.json`);
  if (!res.ok) throw new Error(`Failed to fetch juz ${juzNo}`);
  const data = await res.json();
  const map: Record<string, SurahData> = {};
  for (const surah of data.surah) {
    map[String(surah.no)] = surah;
  }
  await putInStore("juz-verses", key, map);
  return map;
}

const tafsirFetchPromises = new Map<string, Promise<unknown>>();

async function fetchAndCacheSurahTafsir(
  tafsirId: string,
  surahNo: number,
): Promise<unknown> {
  const key = String(surahNo);
  const cached = await getFromStore("surah-tafsir", key);
  if (cached) return cached;

  const fetchKey = `${tafsirId}-${surahNo}`;
  const inflight = tafsirFetchPromises.get(fetchKey);
  if (inflight) return inflight;

  const lang = tafsirId.split("-")[0];
  const promise = (async () => {
    const res = await fetch(
      `${BASE}/surah/tafsir/${lang}/${tafsirId}/${surahNo}.min.json`,
    );
    if (!res.ok) throw new Error(`Failed to fetch tafsir for surah ${surahNo}`);
    const data = await res.json();
    await putInStore("surah-tafsir", key, data);
    return data;
  })().finally(() => tafsirFetchPromises.delete(fetchKey));

  tafsirFetchPromises.set(fetchKey, promise);
  return promise;
}

export async function getVerseTafsirData(
  tafsirId: string,
  surahNo: number,
  verseNumber: number,
): Promise<{
  lang: string;
  authorName: string;
  tafsirName: string;
  text: string;
} | null> {
  try {
    const data = await fetchAndCacheSurahTafsir(tafsirId, surahNo);
    const verses =
      (
        data as {
          verses?: {
            numberInSurah?: number;
            lang?: string;
            authorName?: string;
            tafsirName?: string;
            tafsir?: string;
          }[];
        }
      ).verses ?? [];
    const verse = verses[verseNumber - 1];
    if (!verse) return null;
    return {
      lang: verse.lang ?? tafsirId.split("-")[0],
      authorName: verse.authorName ?? "",
      tafsirName: verse.tafsirName ?? "",
      text: verse.tafsir ?? "",
    };
  } catch {
    return null;
  }
}

export async function mergeAudioWithSurah(
  surah: SurahData,
  audioUrls: VerseAudioUrls[],
): Promise<SurahData> {
  if (audioUrls.length === 0) return surah;
  return {
    ...surah,
    verses: surah.verses.map((verse, i) => ({
      ...verse,
      audio: audioUrls[i] ?? undefined,
    })),
  };
}

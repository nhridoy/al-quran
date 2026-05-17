import { type IDBPDatabase, openDB } from "idb";
import type { SurahData } from "../types";

const DB_NAME = "al-quran";
const DB_VERSION = 4;

const STORE_NAMES = [
  "surahs",
  "bookmarks",
  "settings",
  "duas",
  "prayerSettings",
] as const;

export type StoreName = (typeof STORE_NAMES)[number];

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

export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await getDb();
  await db.clear(storeName);
}

const API_URL =
  "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v2/singleSurah.min.json";

async function fetchAllSurahsFromApi(): Promise<Record<string, SurahData>> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch surah data");
  const data = await res.json();
  return data.singleSurah as Record<string, SurahData>;
}

export async function getSurahs(): Promise<Record<string, SurahData>> {
  const cached = await getFromStore<Record<string, SurahData>>(
    "surahs",
    "allSurahs",
  );
  if (cached) return cached;
  const fresh = await fetchAllSurahsFromApi();
  await putInStore("surahs", "allSurahs", fresh);
  return fresh;
}

export async function getSurah(id: string): Promise<SurahData | undefined> {
  const all = await getSurahs();
  return all[id];
}

export async function clearCache(): Promise<void> {
  await deleteFromStore("surahs", "allSurahs");
}

export async function refreshData(): Promise<Record<string, SurahData>> {
  await deleteFromStore("surahs", "allSurahs");
  const fresh = await fetchAllSurahsFromApi();
  await putInStore("surahs", "allSurahs", fresh);
  return fresh;
}

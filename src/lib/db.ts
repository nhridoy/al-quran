import { type IDBPDatabase, openDB } from "idb";
import type { SurahData } from "../types";

const DB_NAME = "al-quran";
const DB_VERSION = 1;
const STORE_NAME = "surahs";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
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
  const db = await getDb();
  const cached = await db.get(STORE_NAME, "allSurahs");
  if (cached) return cached as Record<string, SurahData>;
  const fresh = await fetchAllSurahsFromApi();
  await db.put(STORE_NAME, fresh, "allSurahs");
  return fresh;
}

export async function getSurah(id: string): Promise<SurahData | undefined> {
  const all = await getSurahs();
  return all[id];
}

export async function clearCache(): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, "allSurahs");
}

export async function refreshData(): Promise<Record<string, SurahData>> {
  await clearCache();
  return getSurahs();
}

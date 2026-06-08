import { type IDBPDatabase, openDB } from "idb";

const DB_NAME = "al-quran";
const DB_VERSION = 11;

export const STORE_NAMES = [
  "surah-verses",
  "surah-list",
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
  "worship-records",
  "prayer-records",
  "quran-progress",
  "sadaqah-records",
  "reading-goals",
  "location",
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

export async function getKeys(storeName: StoreName): Promise<string[]> {
  const db = await getDb();
  const result = await db.getAllKeys(storeName);
  return result as string[];
}

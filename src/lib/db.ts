import { quranApiClient } from "@/lib/apiClient";
import { clearStore, getFromStore, getKeys, putInStore } from "@/lib/cache";
import type {
  HadithBook,
  HadithCollection,
  HadithEdition,
  HadithSearchResult,
  SurahData,
  TafsirApiResponse,
  VerseAudioUrls,
} from "@/types";
import { SURAH_COUNT } from "./const";

async function fetchAllSurahsFromApi(): Promise<Record<string, SurahData>> {
  const ids = Array.from({ length: SURAH_COUNT }, (_, i) => i + 1);
  const results = await Promise.allSettled(
    ids.map((id) => quranApiClient.getSurahVerse(id)),
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
  await clearStore("hadith");
}

export async function clearAudioCache(): Promise<void> {
  await clearStore("surah-audio");
  await clearStore("juz-audio");
}

export async function clearTafsirCache(): Promise<void> {
  await clearStore("surah-tafsir");
  await clearStore("juz-tafsir");
}

export async function clearHadithCache(): Promise<void> {
  await clearStore("hadith");
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

  const data = await quranApiClient.getSurahAudio(reciterId, surahNo);
  const urls = data.verses.map((v) => v.audio);
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

  const data = await quranApiClient.getJuzVerse(juzNo);
  const map: Record<string, SurahData> = {};
  for (const surah of data.surah) {
    map[String(surah.no)] = surah;
  }
  await putInStore("juz-verses", key, map);
  return map;
}

function extractLangFromTafsirId(tafsirId: string): string {
  const lang = tafsirId.split("-")[0];
  if (/^[a-z]{2}$/.test(lang)) return lang;
  return "en";
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

  const lang = extractLangFromTafsirId(tafsirId);
  const promise = quranApiClient
    .getSurahTafsir(lang, tafsirId, surahNo)
    .then(async (data) => {
      await putInStore("surah-tafsir", key, data);
      return data;
    })
    .finally(() => tafsirFetchPromises.delete(fetchKey));

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
    const verses = (data as TafsirApiResponse).verses ?? [];
    const verse = verses[verseNumber - 1];
    if (!verse) return null;
    return {
      lang: verse.lang ?? extractLangFromTafsirId(tafsirId),
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

export async function getHadithEditions(): Promise<HadithEdition[]> {
  const cached = await getFromStore<HadithEdition[]>("hadith", "editions");
  if (cached) return cached;

  const data = await quranApiClient.getEditions();
  await putInStore("hadith", "editions", data);
  return data;
}

export async function getBooksOfEdition(
  slug: string,
  _lang?: string,
): Promise<HadithBook[]> {
  const key = `books-${slug}`;
  const cached = await getFromStore<HadithBook[]>("hadith", key);
  if (cached) return cached;

  const data = await quranApiClient.getBooksOfEdition(slug);
  await putInStore("hadith", key, data);
  return data;
}

export async function getHadithsOfBook(
  slug: string,
  bookIndex: number,
  lang: string,
): Promise<HadithCollection> {
  const key = `hadith-${slug}-${bookIndex}-${lang}`;
  const cached = await getFromStore<HadithCollection>("hadith", key);
  if (cached) return cached;

  try {
    const data = await quranApiClient.getHadithsOfBook(slug, bookIndex, lang);
    await putInStore("hadith", key, data);
    return data;
  } catch {
    if (lang !== "en") {
      const data = await quranApiClient.getHadithsOfBook(slug, bookIndex, "en");
      await putInStore("hadith", key, data);
      return data;
    }
    throw new Error("Failed to fetch hadiths");
  }
}

export async function searchAllHadiths(
  query: string,
  lang: string,
  maxResults = 50,
): Promise<HadithSearchResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const editions = await getHadithEditions();
  const slugByEditionId = new Map(editions.map((e) => [e.id, e.slug]));
  const editionNames = new Map(editions.map((e) => [e.slug, e.name]));

  const keys = await getKeys("hadith");
  const hadithKeys = keys.filter(
    (k) => k.startsWith("hadith-") && k.endsWith(`-${lang}`),
  );

  const booksCache = new Map<string, HadithBook[]>();
  const results: HadithSearchResult[] = [];

  for (const key of hadithKeys) {
    if (results.length >= maxResults) break;
    const collection = await getFromStore<HadithCollection>("hadith", key);
    if (!collection?.items) continue;

    for (const item of collection.items) {
      if (results.length >= maxResults) break;
      if (!item.text.toLowerCase().includes(trimmed)) continue;

      const slug = slugByEditionId.get(item.editionId);
      if (!slug) continue;

      if (!booksCache.has(slug)) {
        const books = await getFromStore<HadithBook[]>(
          "hadith",
          `books-${slug}`,
        );
        booksCache.set(slug, books ?? []);
      }
      const book = (booksCache.get(slug) ?? []).find(
        (b) => b.bookIndex === item.bookIndex,
      );

      results.push({
        editionSlug: slug,
        editionName:
          editionNames.get(slug)?.[lang] ?? editionNames.get(slug)?.en ?? slug,
        bookIndex: item.bookIndex,
        bookName:
          book?.name?.[lang] ?? book?.name?.en ?? `Book ${item.bookIndex}`,
        hadith: item,
      });
    }
  }

  return results;
}

import { quranApiClient } from "@/lib/apiClient";
import { getFromStore, putInStore } from "@/lib/cache";
import type { HadithEdition, SurahData } from "@/types";
import { FETCH_BATCH_SIZE, JUZ_COUNT, SURAH_COUNT } from "./const";

export async function cacheAllHadithFor(
  lang: string,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const editionsKey = "editions";
  let editions = await getFromStore<HadithEdition[]>("hadith", editionsKey);

  if (!editions) {
    editions = await quranApiClient.getEditions();
    await putInStore("hadith", editionsKey, editions);
  }

  const allEditions = editions;
  const filteredEditions = allEditions.filter(
    (e) =>
      e.availableLanguages.includes(lang) ||
      e.availableLanguages.includes("en"),
  );

  // Cache books metadata for every edition upfront (language-neutral)
  await Promise.allSettled(
    filteredEditions.map(async (edition) => {
      const booksKey = `books-${edition.slug}`;
      const cached = await getFromStore("hadith", booksKey);
      if (cached) return;
      try {
        const books = await quranApiClient.getBooksOfEdition(edition.slug);
        await putInStore("hadith", booksKey, books);
      } catch {}
    }),
  );

  let total = 0;
  let done = 0;

  for (const edition of filteredEditions) {
    for (let bookIndex = 1; bookIndex <= edition.bookCount; bookIndex++) {
      total++;
    }
  }

  const bookKeys: { slug: string; bookIndex: number }[] = [];
  for (const edition of filteredEditions) {
    for (let bookIndex = 1; bookIndex <= edition.bookCount; bookIndex++) {
      bookKeys.push({ slug: edition.slug, bookIndex });
    }
  }

  const batchSize = FETCH_BATCH_SIZE;

  for (let i = 0; i < bookKeys.length; i += batchSize) {
    const batch = bookKeys.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map(async ({ slug, bookIndex }) => {
        const key = `hadith-${slug}-${bookIndex}-${lang}`;
        const cached = await getFromStore("hadith", key);
        if (cached) {
          done++;
          onProgress?.(done, total);
          return;
        }
        try {
          const data = await quranApiClient.getHadithsOfBook(
            slug,
            bookIndex,
            lang,
          );
          await putInStore("hadith", key, data);
        } catch {
          if (lang !== "en") {
            try {
              const fallbackData = await quranApiClient.getHadithsOfBook(
                slug,
                bookIndex,
                "en",
              );
              await putInStore("hadith", key, fallbackData);
            } catch {}
          }
        }
        done++;
        onProgress?.(done, total);
      }),
    );
  }
}

export async function cacheAllAudioForReciter(
  reciterId: string,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const ids = Array.from({ length: SURAH_COUNT }, (_, i) => i + 1);
  let done = 0;
  const batchSize = FETCH_BATCH_SIZE;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map(async (id) => {
        const key = String(id);
        const cached = await getFromStore("surah-audio", key);
        if (cached) {
          done++;
          return;
        }
        try {
          const data = await quranApiClient.getSurahAudio(reciterId, id);
          if (data.verses.length > 0) {
            await putInStore("surah-audio", key, data);
          }
        } catch {
          // skip failed fetches in batch
        }
        done++;
        onProgress?.(done, SURAH_COUNT);
      }),
    );
  }
}

export async function cacheAllJuz(
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const ids = Array.from({ length: JUZ_COUNT }, (_, i) => i + 1);
  let done = 0;
  await Promise.allSettled(
    ids.map(async (id) => {
      const key = String(id);
      const cached = await getFromStore("juz-verses", key);
      if (cached) {
        done++;
        onProgress?.(done, JUZ_COUNT);
        return;
      }
      try {
        const data = await quranApiClient.getJuzVerse(id);
        const map: Record<string, SurahData> = {};
        for (const surah of data.surah) {
          map[String(surah.no)] = surah;
        }
        await putInStore("juz-verses", key, map);
      } catch {
        // skip failed fetches in batch
      }
      done++;
      onProgress?.(done, JUZ_COUNT);
    }),
  );
}

export async function cacheAllTafsirFor(
  tafsirId: string,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const lang = tafsirId.split("-")[0];
  const ids = Array.from({ length: SURAH_COUNT }, (_, i) => i + 1);
  let done = 0;
  const batchSize = FETCH_BATCH_SIZE;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map(async (id) => {
        const key = String(id);
        const cached = await getFromStore("surah-tafsir", key);
        if (cached) {
          done++;
          return;
        }
        try {
          const data = await quranApiClient.getSurahTafsir(lang, tafsirId, id);
          await putInStore("surah-tafsir", key, data);
        } catch {
          // skip failed fetches in batch
        }
        done++;
        onProgress?.(done, SURAH_COUNT);
      }),
    );
  }
}

export async function cacheAllJuzAudioForReciter(
  reciterId: string,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const ids = Array.from({ length: JUZ_COUNT }, (_, i) => i + 1);
  let done = 0;
  await Promise.allSettled(
    ids.map(async (id) => {
      const key = String(id);
      const cached = await getFromStore("juz-audio", key);
      if (cached) {
        done++;
        onProgress?.(done, JUZ_COUNT);
        return;
      }
      try {
        const data = await quranApiClient.getJuzAudio(reciterId, id);
        if (data.verses.length > 0) {
          await putInStore("juz-audio", key, data);
        }
      } catch {
        // skip failed fetches in batch
      }
      done++;
      onProgress?.(done, JUZ_COUNT);
    }),
  );
}

export async function cacheAllJuzTafsirFor(
  tafsirId: string,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const lang = tafsirId.split("-")[0];
  const ids = Array.from({ length: JUZ_COUNT }, (_, i) => i + 1);
  let done = 0;
  await Promise.allSettled(
    ids.map(async (id) => {
      const key = String(id);
      const cached = await getFromStore("juz-tafsir", key);
      if (cached) {
        done++;
        onProgress?.(done, JUZ_COUNT);
        return;
      }
      try {
        const data = await quranApiClient.getJuzTafsir(lang, tafsirId, id);
        await putInStore("juz-tafsir", key, data);
      } catch {
        // skip failed fetches in batch
      }
      done++;
      onProgress?.(done, JUZ_COUNT);
    }),
  );
}

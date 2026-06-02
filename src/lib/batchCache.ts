import { getFromStore, putInStore } from "@/lib/db";
import type { SurahData } from "@/types";
import { FETCH_BATCH_SIZE, JUZ_COUNT, SURAH_COUNT } from "./const";

const BASE = "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v4";

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
        const res = await fetch(
          `${BASE}/surah/audio/${reciterId}/${id}.min.json`,
        );
        if (res.ok) {
          const data = await res.json();
          await putInStore("surah-audio", key, data);
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
      const res = await fetch(`${BASE}/juz/verse/${id}.min.json`);
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, SurahData> = {};
        for (const surah of data.surah) {
          map[String(surah.no)] = surah;
        }
        await putInStore("juz-verses", key, map);
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
        const res = await fetch(
          `${BASE}/surah/tafsir/${lang}/${tafsirId}/${id}.min.json`,
        );
        if (res.ok) {
          const data = await res.json();
          await putInStore("surah-tafsir", key, data);
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
      const res = await fetch(`${BASE}/juz/audio/${reciterId}/${id}.min.json`);
      if (res.ok) {
        const data = await res.json();
        await putInStore("juz-audio", key, data);
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
      const res = await fetch(
        `${BASE}/juz/tafsir/${lang}/${tafsirId}/${id}.min.json`,
      );
      if (res.ok) {
        const data = await res.json();
        await putInStore("juz-tafsir", key, data);
      }
      done++;
      onProgress?.(done, JUZ_COUNT);
    }),
  );
}

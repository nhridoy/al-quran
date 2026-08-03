import duasData from "@/data/duas.json";
import { getFromStore, getKeys } from "@/lib/cache";
import { getVerseData } from "@/lib/db";
import type { HadithCollection, SurahData, Verse } from "@/types";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function getRandomVerse(): Promise<{
  verse: Verse;
  surah: SurahData;
} | null> {
  const keys = await getKeys("surah-verses");
  const surahIds = keys.filter((k) => /^\d+$/.test(k));
  if (surahIds.length === 0) return null;

  const id = pickRandom(surahIds);
  const surah = await getVerseData(id);
  if (!surah || surah.verses.length === 0) return null;

  return { verse: pickRandom(surah.verses), surah };
}

export async function getRandomHadith(): Promise<{
  text: string;
  source: string;
} | null> {
  const keys = await getKeys("hadith");
  const hadithKeys = keys.filter((k) => k.startsWith("hadith-"));
  if (hadithKeys.length > 0) {
    const key = pickRandom(hadithKeys);
    const collection = await getFromStore<HadithCollection>("hadith", key);
    if (collection?.items && collection.items.length > 0) {
      const hadith = pickRandom(collection.items);
      const [, slug] = key.split("-");
      return {
        text: hadith.text,
        source: `${slug} ${hadith.bookHadithIndex}`,
      };
    }
  }

  const editions = await getFromStore<{ id: string; slug: string }[]>(
    "hadith",
    "editions",
  );
  if (editions && editions.length > 0) {
    const edition = pickRandom(editions);
    try {
      const { quranApiClient } = await import("@/lib/apiClient");
      const data = await quranApiClient.getHadithsOfBook(edition.slug, 1, "en");
      if (data.items.length > 0) {
        const hadith = pickRandom(data.items);
        return { text: hadith.text, source: `${edition.slug}` };
      }
    } catch {
      return null;
    }
  }

  return null;
}

export function getRandomDua(): {
  arabic: string;
  translation: string;
  reference: string;
} | null {
  if (duasData.length === 0) return null;
  const dua = pickRandom(duasData);
  return {
    arabic: dua.arabic,
    translation: dua.translation,
    reference: dua.reference,
  };
}

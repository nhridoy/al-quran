import { useCallback, useEffect, useState } from "react";
import { getRandomDua, getRandomHadith, getRandomVerse } from "@/lib/content";

export type RandomContentItem =
  | {
      type: "verse";
      verse: { text: { arText: string; enText: string; bnText: string } };
      surahName: string;
    }
  | {
      type: "hadith";
      text: string;
      source: string;
    }
  | {
      type: "dua";
      arabic: string;
      translation: string;
      reference: string;
    };

export function useRandomContent() {
  const [items, setItems] = useState<RandomContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const [hadith, verse, dua] = await Promise.all([
      getRandomHadith(),
      getRandomVerse(),
      Promise.resolve(getRandomDua()),
    ]);
    const result: RandomContentItem[] = [];
    if (verse) {
      result.push({
        type: "verse",
        verse: verse.verse,
        surahName: verse.surah.enName,
      });
    }
    if (hadith) {
      result.push({ type: "hadith", text: hadith.text, source: hadith.source });
    }
    if (dua) {
      result.push({
        type: "dua",
        arabic: dua.arabic,
        translation: dua.translation,
        reference: dua.reference,
      });
    }
    setItems(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { items, loading, refresh: fetch };
}

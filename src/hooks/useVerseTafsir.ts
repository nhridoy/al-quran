import { useCallback, useEffect, useState } from "react";
import { getVerseTafsirData } from "../lib/db";

export interface VerseTafsirData {
  text: string;
  authorName: string;
  tafsirName: string;
  lang: string;
}

export function useVerseTafsir(
  tafsirId: string | undefined,
  surahNo: number,
  verseNumber: number,
) {
  const [data, setData] = useState<VerseTafsirData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTafsir = useCallback(async () => {
    if (!tafsirId || verseNumber < 1) return;
    setLoading(true);
    try {
      const result = await getVerseTafsirData(tafsirId, surahNo, verseNumber);
      setData(result);
    } catch {
      setData(null);
    }
    setLoading(false);
  }, [tafsirId, surahNo, verseNumber]);

  useEffect(() => {
    setData(null);
    fetchTafsir();
  }, [fetchTafsir]);

  return { data, loading };
}

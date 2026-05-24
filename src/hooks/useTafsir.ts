import { useCallback, useEffect, useState } from "react";
import { getTafsirData } from "../lib/db";

export interface TafsirData {
  text: string;
  authorName: string;
  tafsirName: string;
  lang: string;
}

export function useTafsir(chapterNumber: number, tafsirId: string | undefined) {
  const [data, setData] = useState<TafsirData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTafsir = useCallback(async () => {
    if (!tafsirId) {
      setError("No tafsir selected");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getTafsirData(tafsirId, chapterNumber);
      if (result) {
        setData(result);
      } else {
        setError("Tafsir not available for this surah");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [chapterNumber, tafsirId]);

  useEffect(() => {
    fetchTafsir();
  }, [fetchTafsir]);

  return { data, loading, error, refetch: fetchTafsir };
}

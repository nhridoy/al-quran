import { useCallback, useEffect, useState } from "react";
import { getJuzData, getSurahs } from "../lib/db";
import type { ParaSurah } from "../types";

export function usePara(id: string | undefined) {
  const [para, setPara] = useState<ParaSurah[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPara = useCallback(async () => {
    if (!id) {
      setPara(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const juzNo = Number.parseInt(id, 10);
      if (Number.isNaN(juzNo) || juzNo < 1 || juzNo > 30) {
        setError("Invalid para number");
        setLoading(false);
        return;
      }
      const juzData = await getJuzData(juzNo);
      const allSurahs = await getSurahs();
      const result: ParaSurah[] = [];
      for (let i = 1; i <= 114; i++) {
        const juzSurah = juzData[String(i)];
        const fullSurah = allSurahs[String(i)];
        if (!juzSurah || !fullSurah || juzSurah.verses.length === 0) continue;
        result.push({
          ...fullSurah,
          verses: juzSurah.verses,
        });
      }
      setPara(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load para");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPara();
  }, [fetchPara]);

  return { para, loading, error };
}

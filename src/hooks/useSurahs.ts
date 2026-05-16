import { useCallback, useEffect, useState } from "react";
import { getSurahs, refreshData } from "../lib/db";
import type { SurahData } from "../types";

export function useSurahs() {
  const [surahs, setSurahs] = useState<Record<string, SurahData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSurahs()
      .then((data) => {
        if (!cancelled) {
          setSurahs(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load data");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const surahList = Object.values(surahs).sort((a, b) => a.no - b.no);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await refreshData();
      setSurahs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    }
    setLoading(false);
  }, []);

  return { surahs, surahList, loading, error, refresh };
}

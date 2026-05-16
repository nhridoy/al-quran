import { useEffect, useState } from "react";
import { getSurah } from "../lib/db";
import type { SurahData } from "../types";

export function useSurah(id: string | undefined) {
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getSurah(id)
      .then((data) => {
        if (!cancelled) {
          setSurah(data ?? null);
          setLoading(false);
          if (data?.enName) document.title = data.enName;
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { surah, loading };
}

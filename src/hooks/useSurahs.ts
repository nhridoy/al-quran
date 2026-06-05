import { useEffect, useState } from "react";
import { getSurahs } from "@/lib/db";
import type { SurahData } from "@/types";

export function useSurahs() {
  const [surahs, setSurahs] = useState<Record<string, SurahData>>({});
  const [loading, setLoading] = useState(true);

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
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const surahList = Object.values(surahs).sort((a, b) => a.no - b.no);

  return { surahs, surahList, loading };
}

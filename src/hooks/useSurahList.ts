import { useEffect, useState } from "react";
import { getSurahList } from "@/lib/db";
import type { SurahHeader } from "@/types";

export function useSurahList() {
  const [surahList, setSurahList] = useState<SurahHeader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSurahList()
      .then((data) => {
        if (!cancelled) {
          setSurahList(data);
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

  return { surahList, loading };
}

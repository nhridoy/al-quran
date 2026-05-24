import { useCallback, useEffect, useState } from "react";
import { getFromStore, putInStore } from "../lib/db";

const TAFSIR_API = "https://api.quran.com/api/v4/tafsirs";

interface TafsirResponse {
  tafsir: {
    verses: Record<string, { id: number }>;
    resource_id: number;
    resource_name: string;
    language_id: number;
    slug: string;
    translated_name: { name: string; language_name: string };
    text: string;
  };
}

export interface TafsirData {
  text: string;
  resourceName: string;
  slug: string;
}

export const TAFSIR_RESOURCES: Record<number, { name: string; slug: string }> =
  {
    169: { name: "Ibn Kathir (English)", slug: "en-tafisr-ibn-kathir" },
    165: { name: "Ahsanul Bayaan (Bengali)", slug: "bn-tafsir-ahsanul-bayaan" },
    166: {
      name: "Abu Bakr Zakaria (Bengali)",
      slug: "bn-tafsir-abu-bakr-zakaria",
    },
  };

export type TafsirId = keyof typeof TAFSIR_RESOURCES;

export function useTafsir(chapterNumber: number, tafsirId: TafsirId = 169) {
  const [data, setData] = useState<TafsirData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = `tafsir-${tafsirId}-${chapterNumber}`;

  const fetchTafsir = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = await getFromStore<{
        text: string;
        resourceName: string;
        slug: string;
      }>("tafsir", key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
      const res = await fetch(
        `${TAFSIR_API}/${tafsirId}/by_chapter/${chapterNumber}`,
      );
      if (!res.ok) throw new Error("Failed to load tafsir");
      const json: TafsirResponse = await res.json();
      const resource = TAFSIR_RESOURCES[tafsirId];
      const tafsirData: TafsirData = {
        text: json.tafsir.text,
        resourceName: resource?.name ?? json.tafsir.resource_name,
        slug: resource?.slug ?? json.tafsir.slug,
      };
      await putInStore("tafsir", key, tafsirData);
      setData(tafsirData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [key, tafsirId, chapterNumber]);

  useEffect(() => {
    fetchTafsir();
  }, [fetchTafsir]);

  return { data, loading, error, refetch: fetchTafsir };
}

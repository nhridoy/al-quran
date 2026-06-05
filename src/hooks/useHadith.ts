import { useCallback, useEffect, useState } from "react";
import {
  getBooksOfEdition,
  getHadithEditions,
  getHadithsOfBook,
} from "@/lib/db";
import type { HadithBook, HadithCollection, HadithEdition } from "@/types";

export const PAGE_SIZE = 50;

export function useEditions() {
  const [editions, setEditions] = useState<HadithEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getHadithEditions()
      .then((data) => {
        if (!cancelled) {
          setEditions(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch editions",
          );
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { editions, loading, error, refetch: getHadithEditions };
}

export function useEditionBooks(
  slug: string | undefined,
  lang: string = "en",
): {
  books: HadithBook[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getBooksOfEdition(slug, lang);
      setBooks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  }, [slug, lang]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks };
}

export function useHadithPage(
  slug: string | undefined,
  bookIndex: number | undefined,
  lang: string = "en",
) {
  const [data, setData] = useState<HadithCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    if (!slug || bookIndex === undefined) return;
    setLoading(true);
    setError(null);
    try {
      const collection = await getHadithsOfBook(slug, bookIndex, lang);
      setData(collection);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch hadiths");
    } finally {
      setLoading(false);
    }
  }, [slug, bookIndex, lang]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return { data, loading, error, refetch: fetchPage };
}

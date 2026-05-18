import { useCallback, useEffect, useState } from "react";
import { getFromStore, putInStore } from "../lib/db";

const HADITH_API = "https://api.hadith.gading.dev";

export interface HadithBook {
  name: string;
  id: string;
  available: number;
}

export interface Hadith {
  number: number;
  arab: string;
  id: string;
}

export interface HadithPageData {
  bookName: string;
  bookId: string;
  total: number;
  hadiths: Hadith[];
}

export const PAGE_SIZE = 20;

export function useHadithBooks() {
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = await getFromStore<HadithBook[]>("hadith", "books");
      if (cached) {
        setBooks(cached);
        setLoading(false);
        return;
      }
      const res = await fetch(`${HADITH_API}/books`);
      if (!res.ok) throw new Error("Failed to fetch hadith books");
      const d = await res.json();
      const data = d.data as HadithBook[];
      await putInStore("hadith", "books", data);
      setBooks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks };
}

export function useHadithPage(bookId: string | undefined, page: number) {
  const [data, setData] = useState<HadithPageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    setError(null);
    const key = `${bookId}-page-${page}`;
    try {
      const cached = await getFromStore<HadithPageData>("hadith", key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
      const start = (page - 1) * PAGE_SIZE + 1;
      const end = start + PAGE_SIZE - 1;
      const res = await fetch(
        `${HADITH_API}/books/${bookId}?range=${start}-${end}`,
      );
      if (!res.ok) throw new Error("Failed to fetch hadiths");
      const d = await res.json();
      const pageData: HadithPageData = {
        bookName: d.data.name,
        bookId: d.data.id,
        total: d.data.available,
        hadiths: d.data.hadiths,
      };
      await putInStore("hadith", key, pageData);
      setData(pageData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [bookId, page]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return { data, loading, error, refetch: fetchPage };
}

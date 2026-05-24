import { useCallback, useEffect, useState } from "react";
import { getFromStore, putInStore } from "../lib/db";
import { useSettings } from "../store/settings";

const HADITH_API = "https://hadislam.org";

export interface Edition {
  _id: string;
  slug: string;
  name: Record<string, string>;
  availableLanguages: string[];
  hadithCount: number;
  bookCount: number;
}

export interface Book {
  _id: string;
  bookIndex: number;
  name: Record<string, string>;
  hadithCount: number;
  hadithIndexStart: number;
}

export interface Hadith {
  _id: string;
  bookIndex: number;
  hadithIndex: number;
  bookHadithIndex: number;
  text: Record<string, string>;
  grades: Array<{ name: string; grade: string }>;
}

export interface HadithPageData {
  total: number;
  page: number;
  pageSize: number;
  items: Hadith[];
  bookName: string;
  slug: string;
}

export const PAGE_SIZE = 20;

const LANG_FALLBACK = ["en", "ar"];

export function getPreferredText(
  text: Record<string, string>,
  preferred?: string,
): { lang: string; text: string } {
  if (preferred && text[preferred])
    return { lang: preferred, text: text[preferred] };
  for (const lang of LANG_FALLBACK) {
    if (text[lang]) return { lang, text: text[lang] };
  }
  const firstKey = Object.keys(text)[0];
  return { lang: firstKey, text: text[firstKey] || "" };
}

export function useEditions() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEditions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = await getFromStore<Edition[]>("hadith", "editions");
      if (cached) {
        setEditions(cached);
        setLoading(false);
        return;
      }
      const res = await fetch(`${HADITH_API}/editions/`);
      if (!res.ok) throw new Error("Failed to fetch editions");
      const data = (await res.json()) as Edition[];
      await putInStore("hadith", "editions", data);
      setEditions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEditions();
  }, [fetchEditions]);

  return { editions, loading, error, refetch: fetchEditions };
}

export function useEditionBooks(slug: string | undefined) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    const key = `books-${slug}`;
    try {
      const cached = await getFromStore<Book[]>("hadith", key);
      if (cached) {
        setBooks(cached);
        setLoading(false);
        return;
      }
      const res = await fetch(`${HADITH_API}/editions/${slug}/books`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = (await res.json()) as Book[];
      await putInStore("hadith", key, data);
      setBooks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks };
}

export function useHadithPage(
  slug: string | undefined,
  bookIndex: number | undefined,
  page: number,
) {
  const [data, setData] = useState<HadithPageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    if (!slug || bookIndex === undefined) return;
    setLoading(true);
    setError(null);
    const key = `hadith-${slug}-${bookIndex}-${page}`;
    try {
      const cached = await getFromStore<HadithPageData>("hadith", key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
      const res = await fetch(
        `${HADITH_API}/editions/${slug}/books/${bookIndex}/hadiths?page=${page}&page_size=${PAGE_SIZE}&lang=*`,
      );
      if (!res.ok) throw new Error("Failed to fetch hadiths");
      const d = await res.json();
      const pageData: HadithPageData = {
        total: d.total,
        page: d.page,
        pageSize: d.page_size,
        items: d.items,
        bookName: "",
        slug,
      };
      await putInStore("hadith", key, pageData);
      setData(pageData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [slug, bookIndex, page]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return { data, loading, error, refetch: fetchPage };
}

export function useAvailableLangs(items: Hadith[]): string[] {
  const translationLang = useSettings((s) => s.translationLang);
  const langs = new Set<string>();
  langs.add(translationLang);
  for (const h of items) {
    for (const key of Object.keys(h.text)) {
      langs.add(key);
    }
  }
  return Array.from(langs);
}

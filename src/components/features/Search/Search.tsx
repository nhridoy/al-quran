import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useSurahs } from "@/hooks/useSurahs";
import { SEARCH_FOCUS_DELAY } from "@/lib/const";
import { searchSurahs, searchVerses } from "@/lib/search";
import SurahItem from "../../quran/SurahItem/SurahItem";
import VerseResultItem from "./VerseResultItem";

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"surah" | "verse">("surah");
  const debouncedQuery = useDebounce(query, 300);
  const { surahList, surahs } = useSurahs();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), SEARCH_FOCUS_DELAY);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  handlerRef.current = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(true);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handlerRef.current(e);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const surahResults = useMemo(
    () => (mode === "surah" ? searchSurahs(debouncedQuery, surahList) : []),
    [debouncedQuery, mode, surahList],
  );

  const verseResults = useMemo(
    () => (mode === "verse" ? searchVerses(debouncedQuery, surahs) : []),
    [debouncedQuery, mode, surahs],
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  const handleVerseClick = (surahNo: number, ayahNo?: number) => {
    setOpen(false);
    setQuery("");
    navigate(ayahNo ? `/surah/${surahNo}?ayah=${ayahNo}` : `/surah/${surahNo}`);
  };

  return (
    <>
      <Button
        variant="secondary-ghost"
        className="gap-2 rounded-xl px-3 py-2 h-auto"
        onClick={() => setOpen(true)}
      >
        <BiSearch className="text-lg" />
        <span className="hidden text-text-muted dark:text-dark-text-muted md:inline">
          Search surah...
        </span>
        <kbd className="hidden rounded-md border border-border bg-surface-alt px-1.5 py-0.5 text-[10px] font-medium text-text-muted dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-muted md:inline">
          ⌘K
        </kbd>
      </Button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/60 backdrop-blur-xl pt-[15vh]">
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              onClick={handleClose}
              aria-label="Close"
            />
            <div className="relative w-full max-w-lg mx-4 animate-scale-in">
              <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-dark-surface-card dark:ring-white/10">
                <div className="border-b border-border dark:border-dark-border">
                  <div className="flex items-center gap-3 px-4">
                    <BiSearch className="text-lg shrink-0 text-text-muted" />
                    <input
                      ref={inputRef}
                      onChange={handleChange}
                      value={query}
                      type="text"
                      className="flex-1 bg-transparent py-4 text-sm text-text-primary outline-none placeholder:text-text-muted dark:text-dark-text-primary dark:placeholder:text-dark-text-muted"
                      placeholder={
                        mode === "surah"
                          ? "Search by surah name or number..."
                          : "Search by verse text..."
                      }
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        className="cursor-pointer rounded-lg p-1 text-text-muted hover:bg-surface-alt hover:text-text-primary dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
                      >
                        <IoClose className="text-lg" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClose}
                      className="cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-text-muted hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
                    >
                      Esc
                    </button>
                  </div>
                  <div className="flex gap-1 px-4 pb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("surah");
                        setQuery("");
                      }}
                      className={`rounded-lg px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                        mode === "surah"
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary-light"
                          : "text-text-muted hover:text-text-primary dark:hover:text-dark-text-primary"
                      }`}
                    >
                      Surah
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("verse");
                        setQuery("");
                      }}
                      className={`rounded-lg px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                        mode === "verse"
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary-light"
                          : "text-text-muted hover:text-text-primary dark:hover:text-dark-text-primary"
                      }`}
                    >
                      Verse
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {mode === "surah" && surahResults.length > 0 && (
                    <div className="space-y-1">
                      {surahResults.map((surah) => (
                        <Link
                          key={surah.no}
                          to={`/surah/${surah.no}`}
                          onClick={handleClose}
                          className="block rounded-xl transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
                        >
                          <SurahItem data={surah} />
                        </Link>
                      ))}
                    </div>
                  )}

                  {mode === "verse" && verseResults.length > 0 && (
                    <div className="space-y-0.5">
                      {verseResults.map((r) => (
                        <VerseResultItem
                          key={`${r.surahNo}-${r.verse.numberInSurah}`}
                          result={r}
                          onClick={handleVerseClick}
                        />
                      ))}
                    </div>
                  )}

                  {debouncedQuery &&
                    (mode === "surah"
                      ? surahResults.length === 0
                      : verseResults.length === 0) && (
                      <div className="flex flex-col items-center py-12 text-text-muted dark:text-dark-text-muted">
                        <BiSearch className="text-3xl mb-2 opacity-40" />
                        <p className="text-sm font-medium">No results found</p>
                        <p className="text-xs mt-0.5">
                          Try a different search term
                        </p>
                      </div>
                    )}

                  {!query && (
                    <div className="flex flex-col items-center py-12 text-text-muted dark:text-dark-text-muted">
                      <BiSearch className="text-3xl mb-2 opacity-40" />
                      <p className="text-sm font-medium">
                        {mode === "surah"
                          ? "Search 114 Surahs"
                          : "Search 6,236 Verses"}
                      </p>
                      <p className="text-xs mt-0.5">Type to begin searching</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

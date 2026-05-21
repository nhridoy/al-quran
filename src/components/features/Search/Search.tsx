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
import { useSurahs } from "../../../hooks/useSurahs";
import type { Verse } from "../../../types";
import SurahList from "../../quran/SurahItem/SurahItem";

interface VerseResult {
  surahNo: number;
  surahName: string;
  enName: string;
  verse: Verse;
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"surah" | "verse">("surah");
  const { surahList, surahs } = useSurahs();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const surahResults = useMemo(() => {
    if (!query || mode !== "surah") return [];
    const q = query.toLowerCase();
    return surahList
      .filter(
        (surah) =>
          surah.enName.toLowerCase().includes(q) ||
          surah.name.toLowerCase().includes(q) ||
          surah.enNameTranslation.toLowerCase().includes(q) ||
          surah.bnNameTranslation.toLowerCase().includes(q) ||
          `${surah.no}`.includes(q),
      )
      .slice(0, 8);
  }, [query, mode, surahList]);

  const verseResults = useMemo(() => {
    if (!query || mode !== "verse") return [];
    const q = query.toLowerCase();
    const results: VerseResult[] = [];
    for (const surah of Object.values(surahs)) {
      for (const verse of surah.verses) {
        if (
          verse.text.toLowerCase().includes(q) ||
          verse.enText.toLowerCase().includes(q) ||
          verse.bnText.toLowerCase().includes(q)
        ) {
          results.push({
            surahNo: surah.no,
            surahName: surah.name,
            enName: surah.enName,
            verse,
          });
          if (results.length >= 30) break;
        }
      }
      if (results.length >= 30) break;
    }
    return results;
  }, [query, mode, surahs]);

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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm"
      >
        <BiSearch className="text-lg" />
        <span className="hidden text-text-muted dark:text-dark-text-muted md:inline">
          Search surah...
        </span>
        <kbd className="hidden rounded-md border border-border bg-surface-alt px-1.5 py-0.5 text-[10px] font-medium text-text-muted dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-muted md:inline">
          ⌘K
        </kbd>
      </button>

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
                    <BiSearch className="text-lg text-text-muted" />
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
                          <SurahList data={surah} />
                        </Link>
                      ))}
                    </div>
                  )}

                  {mode === "verse" && verseResults.length > 0 && (
                    <div className="space-y-0.5">
                      {verseResults.map((r) => (
                        <button
                          key={`${r.surahNo}-${r.verse.numberInSurah}`}
                          type="button"
                          onClick={() =>
                            handleVerseClick(r.surahNo, r.verse.numberInSurah)
                          }
                          className="w-full cursor-pointer rounded-xl p-3 text-left transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
                        >
                          <p className="font-arabic text-right text-lg leading-relaxed text-text-primary dark:text-dark-text-primary">
                            {r.verse.text}
                          </p>
                          <p className="mt-1 text-xs italic text-text-muted dark:text-dark-text-muted line-clamp-1">
                            {r.verse.enText}
                          </p>
                          <p className="text-[11px] text-text-muted/60 dark:text-dark-text-muted/60 line-clamp-1">
                            {r.verse.bnText}
                          </p>
                          <p className="mt-1 text-[11px] font-medium text-secondary dark:text-secondary-light">
                            {r.enName} — Ayah {r.verse.numberInSurah}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {query &&
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





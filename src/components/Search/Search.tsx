import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSurahs } from "../../hooks/useSurahs";
import SurahList from "../pages/SurahList/SurahList";

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { surahList } = useSurahs();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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

  const searchResult = useMemo(() => {
    if (!query) return [];
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
  }, [query, surahList]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
      >
        <BiSearch className="text-lg" />
        <span className="hidden text-text-muted dark:text-dark-text-muted md:inline">
          Search surah...
        </span>
        <kbd className="hidden rounded-md border border-border bg-surface-alt px-1.5 py-0.5 text-[10px] font-medium text-text-muted dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-muted md:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[15vh]">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={handleClose}
            aria-label="Close"
          />
          <div className="relative w-full max-w-lg mx-4 animate-scale-in">
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-dark-surface-card dark:ring-white/10">
              <div className="flex items-center gap-3 border-b border-border px-4 dark:border-dark-border">
                <BiSearch className="text-lg text-text-muted" />
                <input
                  ref={inputRef}
                  onChange={handleChange}
                  value={query}
                  type="text"
                  className="flex-1 bg-transparent py-4 text-sm text-text-primary outline-none placeholder:text-text-muted dark:text-dark-text-primary dark:placeholder:text-dark-text-muted"
                  placeholder="Search by surah name or number..."
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="rounded-lg p-1 text-text-muted hover:bg-surface-alt hover:text-text-primary dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
                  >
                    <IoClose className="text-lg" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-text-muted hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
                >
                  Esc
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {searchResult.length > 0 ? (
                  <div className="space-y-1">
                    {searchResult.map((surah) => (
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
                ) : query ? (
                  <div className="flex flex-col items-center py-12 text-text-muted dark:text-dark-text-muted">
                    <BiSearch className="text-3xl mb-2 opacity-40" />
                    <p className="text-sm font-medium">No results found</p>
                    <p className="text-xs mt-0.5">Try a different search term</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-12 text-text-muted dark:text-dark-text-muted">
                    <BiSearch className="text-3xl mb-2 opacity-40" />
                    <p className="text-sm font-medium">Search 114 Surahs</p>
                    <p className="text-xs mt-0.5">
                      Type a name or number to begin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

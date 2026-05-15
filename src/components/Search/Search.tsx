import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useSurahs } from "../../hooks/useSurahs";
import Drawer from "../Drawer/Drawer";
import SurahList from "../pages/SurahList/SurahList";

export default function Search() {
  const [searchBar, setSearchBar] = useState(false);
  const [query, setQuery] = useState("");
  const { surahList } = useSurahs();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchBar) inputRef.current?.focus();
  }, [searchBar]);

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
      .slice(0, 3);
  }, [query, surahList]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setSearchBar(true)}
        className="dark:text-white"
      >
        <BiSearch className="dark:text-white" />
      </button>
      <Drawer
        open={searchBar}
        onClose={() => {
          setSearchBar(false);
          setQuery("");
        }}
        direction="center"
        className="bg-white dark:bg-[#20282e] rounded-lg w-5/6 md:w-2/3"
      >
        <div className="flex items-center justify-center p-5 text-white rounded-lg bg-primary">
          <input
            onChange={handleChange}
            value={query}
            type="text"
            className="z-50 w-full px-3 py-2 text-gray-900 bg-white rounded-lg"
            placeholder="Surah Name or Number"
            ref={inputRef}
          />
        </div>
        <div className="py-3">
          <div>
            {searchResult.length ? (
              <div className="flex flex-col items-center justify-center px-3 py-2 rounded-lg md:flex-row md:gap-3">
                {searchResult.map((surah) => (
                  <Link
                    key={surah.no}
                    to={`/surah/${surah.no}`}
                    onClick={() => {
                      setSearchBar(false);
                      setQuery("");
                    }}
                  >
                    <SurahList data={surah} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                {query ? "No results found" : "Start Typing"}
              </p>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}

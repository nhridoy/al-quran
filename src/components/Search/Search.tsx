import React, { useEffect } from "react";
import Drawer from "react-drag-drawer";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import type { SurahData } from "../../types";
import SurahList from "../pages/SurahList/SurahList";

const Search: React.FC = () => {
  const [searchBar, setSearchBar] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<SurahData[]>([]);
  const [surahList, setSurahList] = React.useState<SurahData[]>([]);
  useEffect(() => {
    setSurahList([]);
    for (let index = 1; index <= 114; index++) {
      const surah: SurahData = JSON.parse(
        localStorage.getItem(String(index)) || "{}",
      );
      setSurahList((prevState) => [...prevState, surah]);
    }
  }, []);
  const toggle = (value: boolean) => () => {
    setSearchBar(value);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const filtered = surahList.filter((surah) => {
        return (
          surah.enName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          surah.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          surah.enNameTranslation
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          surah.bnNameTranslation
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          `${surah.no}`.includes(e.target.value)
        );
      });
      setSearchResult(filtered.slice(0, 3));
    } else {
      setSearchResult([]);
    }
  };

  return (
    <>
      <button type="button" onClick={toggle(true)} className="dark:text-white">
        <BiSearch className="dark:text-white" />
      </button>
      <Drawer
        open={searchBar}
        onRequestClose={toggle(false)}
        modalElementClass="bg-white dark:bg-[#20282e] rounded-lg w-5/6 md:w-2/3"
      >
        <div className="flex items-center justify-center row-span-1 p-5 text-white rounded-lg bg-primary">
          <input
            onChange={handleChange}
            type="text"
            className="z-50 w-full px-3 py-2 text-gray-900 bg-white rounded-lg"
            placeholder="Surah Name or Number"
          />
        </div>
        <div className="py-3">
          <div className="">
            {searchResult.length ? (
              <div className="flex flex-col items-center justify-center px-3 py-2 rounded-lg md:flex-row md:gap-3">
                {searchResult.map((surah) => (
                  <Link key={surah.no} to={`/surah/${surah.no}`}>
                    <SurahList data={surah} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="flex items-center justify-center text-white">
                Start Typing
              </p>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Search;

import React, { useEffect } from "react";
import Drawer from "react-drag-drawer";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import { SurahList } from "../pages/SurahList/SurahList";

const Search = () => {
  const [searchBar, setSearchBar] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState([]);
  const [surahList, setSurahList] = React.useState([]);
  useEffect(() => {
    setSurahList([]);
    for (let index = 1; index <= 114; index++) {
      const surah = JSON.parse(localStorage.getItem(index));
      setSurahList((prevState) => [...prevState, surah]);
    }
  }, []);
  const toggle = (value) => (event) => {
    setSearchBar(value);
  };
  const handleChange = (e) => {
    if (e.target.value) {
      const searchResult = surahList.filter((surah) => {
        return (
          surah.enName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          surah.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          surah.enNameTranslation
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          surah.bnNameTranslation
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          (surah.no + "").includes(e.target.value)
        );
      });
      setSearchResult(searchResult.slice(0, 3));
    } else {
      setSearchResult([]);
    }
  };
  const surah = {
    no: 1,
    enName: "Al-Faatiha",
    name: "سُورَةُ ٱلْفَاتِحَةِ",
    enNameTranslation: "The Opening",
    bnNameTranslation: "আল ফাতিহা ",
    revelationType: "Meccan",
    numberOfAyahs: 7,
  };
  //   console.log(searchResult.slice(0, 3));
  return (
    <>
      <button onClick={toggle(true)} className=" dark:text-white">
        <BiSearch className=" dark:text-white" />
      </button>
      <Drawer
        open={searchBar}
        onRequestClose={toggle(false)}
        modalElementClass="bg-white dark:bg-[#20282e] rounded-lg w-5/6 md:w-2/3 "
        // direction="left"
      >
        <div className="row-span-1 bg-primary rounded-lg p-5 text-white flex items-center justify-center">
          <input
            onChange={handleChange}
            type="text"
            className="w-full px-3 py-2 rounded-lg z-50 text-gray-900"
            placeholder="Surah Name or Number"
          />
        </div>
        <div className="py-3">
          <div className="">
            {searchResult.length ? (
              <div className="flex flex-col md:flex-row md:gap-3 items-center justify-center px-3 py-2 rounded-lg">
                {searchResult.map((surah) => (
                  <Link key={surah.no} to={`/surah/${surah.no}`}>
                    <SurahList data={surah} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-white flex items-center justify-center">
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

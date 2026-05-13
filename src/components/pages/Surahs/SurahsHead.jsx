import React, { useEffect, useState } from "react";
import { MdMenuBook } from "react-icons/md";
import logo from "../../../logo.svg";

export const SurahsHead = () => {
  const [readStatus, setReadStatus] = useState(null);
  useEffect(() => {
    const currentAudioIndex = JSON.parse(
      localStorage.getItem("currentAudioIndex") || null
    );
    setReadStatus(currentAudioIndex);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 gap-10 px-5 py-3 mb-5 text-sm text-white shadow-lg md:px-8 bg-gradient-to-tl rounded-2xl from-purple-400 to-purple-600 shadow-purple-400 md:text-lg">
      <div className="flex flex-col gap-3">
        <div className="">
          <p className="">Assalamualaikum</p>
          <div className="flex items-center gap-1">
            <MdMenuBook /> <span>Last Read</span>
          </div>
        </div>
        <div className="">
          <p className="font-semibold">
            {readStatus ? readStatus.surahName : "No Data Found"}
          </p>
          <p>Ayat - {readStatus ? readStatus.verseNumber : "No Data Found"}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <img className="w-1/2 md:w-1/5" src={logo} alt="logo" />
      </div>
    </div>
  );
};

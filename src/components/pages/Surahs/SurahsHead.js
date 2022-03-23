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
    <div className="flex justify-between gap-10 items-center md:px-8 py-3 px-5 gap-3 bg-gradient-to-tl rounded-2xl text-white from-alternateOne to-secondary mb-5 shadow-lg shadow-alternateOne text-sm md:text-lg">
      <div className="flex flex-col gap-3">
        <div className="">
          <p className="">Assalamualaikum</p>
          <div className="flex gap-1 items-center">
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

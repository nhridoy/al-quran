import React from "react";
import { Header } from "../../Header/Header";
import { GoPrimitiveDot } from "react-icons/go";

export const Credits = () => {
  return (
    <div>
      <div className="bg-white sticky top-0 left-0 w-full z-10">
        <Header head="Credits" />
      </div>
      <div className="grid grid-rows-5">
        <div className="row-span-1 flex items-center justify-center text-lg font-bold">
          <h2 className=" md:text-2xl">Credits</h2>
        </div>
        <div className="row-span-4 bg-secondary text-white p-5 rounded-t-3xl flex flex-col divide-y">
          <a
            href=""
            target="_blank"
            className="p-5 hover:bg-purple-500 transition-all"
          >
            <div className="flex items-center gap-3">
              <GoPrimitiveDot />
              <p className="text-xs md:text-sm">Al Quran</p>
            </div>
          </a>
          <a
            href=""
            target="_blank"
            className="p-5 hover:bg-purple-500 transition-all"
          >
            <div className="flex items-center gap-3">
              <GoPrimitiveDot />
              <p className="text-xs md:text-sm">Al Quran</p>
            </div>
          </a>
          <a
            href=""
            target="_blank"
            className="p-5 hover:bg-purple-500 transition-all"
          >
            <div className="flex items-center gap-3">
              <GoPrimitiveDot />
              <p className="text-xs md:text-sm">Al Quran</p>
            </div>
          </a>
          <a
            href=""
            target="_blank"
            className="p-5 hover:bg-purple-500 transition-all"
          >
            <div className="flex items-center gap-3">
              <GoPrimitiveDot />
              <p className="text-xs md:text-sm">Al Quran</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

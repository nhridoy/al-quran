import React, { useEffect } from "react";
import { Header } from "../../Header/Header";
import { GoPrimitiveDot } from "react-icons/go";

export const Credits = () => {
  useEffect(() => {
    document.querySelector("html").classList.remove("overflow-x-hidden");
    document.querySelector("body").classList.remove("overflow-x-hidden");
  }, []);
  return (
    <div className="h-screen">
      <div className="bg-white sticky top-0 left-0 w-full z-10">
        <Header head="Credits" />
      </div>
      <div className="grid grid-rows-5">
        <div className="row-span-1 flex items-center justify-center text-lg font-bold">
          <h2 className=" md:text-2xl dark:text-white">Credits</h2>
        </div>
        <div className="row-span-4 bg-secondary text-white p-5 rounded-t-3xl flex flex-col divide-y">
          <a
            href="https://alquran.cloud/"
            target="_blank"
            className="p-5 hover:bg-purple-500 transition-all"
            rel="noopener noreferrer"
          >
            <div className="flex items-center gap-3">
              <GoPrimitiveDot />
              <p className="text-xs md:text-sm">Al Quran Cloud</p>
            </div>
          </a>
          <a
            href="https://alquranbd.com/"
            target="_blank"
            className="p-5 hover:bg-purple-500 transition-all"
            rel="noopener noreferrer"
          >
            <div className="flex items-center gap-3">
              <GoPrimitiveDot />
              <p className="text-xs md:text-sm">Al Quran BD</p>
            </div>
          </a>
          <a
            href="https://sutanlab.id/"
            target="_blank"
            className="p-5 hover:bg-purple-500 transition-all"
            rel="noopener noreferrer"
          >
            <div className="flex items-center gap-3">
              <GoPrimitiveDot />
              <p className="text-xs md:text-sm">Sultan Labs</p>
            </div>
          </a>
          <a
            href="https://github.com/fawazahmed0/quran-api"
            target="_blank"
            className="p-5 hover:bg-purple-500 transition-all"
            rel="noopener noreferrer"
          >
            <div className="flex items-center gap-3">
              <GoPrimitiveDot />
              <p className="text-xs md:text-sm">Fawaz Ahmed</p>
            </div>
          </a>
          <a
            href="https://github.com/nhridoy/quran-api"
            target="_blank"
            className="p-5 hover:bg-purple-500 transition-all"
            rel="noopener noreferrer"
          >
            <div className="flex items-center gap-3">
              <GoPrimitiveDot />
              <p className="text-xs md:text-sm">Nahidujjaman Hridoy</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

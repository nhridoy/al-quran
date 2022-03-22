import logo from "../logo.png";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { apiLoad } from "../utilities/dataFetching";

export const Splash = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Enabling the loading state
    localStorage.getItem("isLoaded") === null && setLoading(true);
    apiLoad(setLoading);
  }, []);
  useEffect(() => {
    document.querySelector("html").classList.remove("overflow-x-hidden");
    document.querySelector("body").classList.remove("overflow-x-hidden");
  }, []);

  return (
    <div className="h-screen grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-primary font-bold text-3xl">
          بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h2>
        <h2 className="text-primary font-bold text-3xl">Al Quran</h2>
        <p className="text-gray-700">Full Quran with Audio Player</p>
      </div>
      <div className="bg-primary pt-4 pb-10 h-full w-full rounded-3xl">
        <div className="h-full w-full grid justify-center items-end">
          <div className="relative">
            <lottie-player
              src="https://assets9.lottiefiles.com/packages/lf20_5mpwodai.json"
              background="transparent"
              speed="1"
              style={{ width: 300, height: 300 }}
              loop
              autoplay
            ></lottie-player>
            <img
              src={logo}
              className="absolute inset-0 p-16 w-full"
              alt="logo"
            />
          </div>
          <div
            className={`${
              loading ? "cursor-not-allowed" : "cursor-auto"
            } flex items-center justify-center`}
          >
            <Link
              disabled
              to="/surah"
              className={`${
                loading ? "pointer-events-none" : "pointer-events-auto"
              } text-center bg-alternateSecond px-5 py-2 rounded-2xl text-white font-semibold`}
            >
              {loading ? "Loading Surah Please Wait..." : "Browse Surah"}
            </Link>
          </div>
        </div>
        {/* <p className="text-red-400">
          {loading ? "First time loading needed about 10Mb of Internet" : ""}
        </p> */}
      </div>
    </div>
  );
};

import logo from "../logo.png";
import React from "react";
import { NavLink } from "react-router-dom";
import { Api } from "./Api";

export const Splash = () => {
  return (
    <div className="h-screen grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-primary font-bold text-3xl">
          بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h2>
        <h2 className="text-primary font-bold text-3xl">Al Quran</h2>
        <p className="text-gray-700">Full Quran with Audio Player</p>
      </div>
      <div className="bg-primary py-4 h-full w-full rounded-3xl">
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
          <Api />
          <NavLink
            to="/surah"
            className="text-center bg-alternateSecond px-5 py-2 rounded-2xl text-white font-semibold"
          >
            Browse Surah
          </NavLink>
        </div>
      </div>
    </div>
  );
};

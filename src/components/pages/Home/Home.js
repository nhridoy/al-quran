import React, { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Header } from "../../Header/Header";
import { Para } from "../Para/Para";
import { Surahs } from "../Surahs/Surahs";
import { SurahsHead } from "../Surahs/SurahsHead";
import "./Home.css";

export const Home = () => {
  const currentLocation = useLocation();
  const [suraClassName, setSuraClassName] = React.useState("");
  const [paraClassName, setParaClassName] = React.useState("");
  useEffect(() => {
    // const isActive = window.location.pathname === currentLocation.pathname;
    if (currentLocation.pathname === "/surah") {
      setSuraClassName("activeClass");
      setParaClassName("");
    } else if (currentLocation.pathname === "/para") {
      setParaClassName("activeClass");
      setSuraClassName("");
    }
  }, []);
  useEffect(() => {
    document.querySelector("html").classList.remove("overflow-x-hidden");
    document.querySelector("body").classList.remove("overflow-x-hidden");
  }, []);
  return (
    <div className="bg-white sticky top-0 left-0 w-full z-10">
      <Header head="Al Quran" />
      <SurahsHead />
      <div className="grid grid-cols-2 my-3">
        <Link
          to="/surah"
          className={`${suraClassName} font-semibold text-gray-400 py-4 flex items-center justify-center border-b-2 border-b-gray-400`}
        >
          Surah
        </Link>
        <Link
          to="/para"
          className={`${paraClassName} font-semibold text-gray-400 py-4 flex items-center justify-center border-b-2 border-b-gray-400`}
        >
          Para
        </Link>
      </div>
    </div>
  );
};

import React, { useEffect } from "react";
import { FiOctagon } from "react-icons/fi";
import { Link, Outlet } from "react-router-dom";
import { Header } from "../Header/Header";

export const Surahs = () => {
  const [surahs, setSurahs] = React.useState([]);
  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => setSurahs(data.data));
  }, []);
  // console.log(surahs);
  return (
    <div className="">
      <Header />
      <div className="flex flex-col md:flex-row md:grid md:grid-cols-5 md:gap-4">
        {surahs.map((surah) => (
          <Link key={surah.number} exact="true" to={`/surah/${surah.number}`}>
            <SurahList data={surah} key={surah.number} />
          </Link>
        ))}

        <Outlet />
      </div>
    </div>
  );
};

const SurahList = (props) => {
  return (
    <div className="py-4 px-3 hover:bg-secondaryLight active:bg-alternateOne rounded-md flex md:flex-col justify-between items-center gap-4 border-b-2 md:border-2 border-alternateOne lg:cursor-pointer">
      <div className="flex gap-4">
        <div className="flex gap-3 md:flex-col  items-center">
          <div className="relative">
            <FiOctagon className="text-primary font-bold text-6xl" />
            <span className="absolute inset-0 font-semibold grid place-items-center">
              {props.data.number}
            </span>
          </div>
          <div className="flex flex-col md:items-center">
            <div className="font-semibold">{props.data.englishName}</div>
            <div className="flex flex-col md:flex-row gap-2 text-gray-600 text-xs">
              <p className="uppercase">{props.data.revelationType}</p>
              <p className="uppercase">{props.data.numberOfAyahs} verses</p>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-full text-right">
        <p>{props.data.name}</p>
        <p>{props.data.englishNameTranslation}</p>
      </div>
    </div>
  );
};

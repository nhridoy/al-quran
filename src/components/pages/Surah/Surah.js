import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../Header/Header";
import { BiShareAlt, BiBookmark } from "react-icons/bi";
import { IoPlayOutline } from "react-icons/io5";

export const Surah = (props) => {
  const { id } = useParams();
  const [surah, setSurah] = React.useState({});
  const [ayahs, setAyahs] = React.useState([]);
  const [enayahs, setEnAyahs] = React.useState([]);
  useEffect(() => {
    fetch(`https://api.alquran.cloud/v1/surah/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAyahs(data.data.ayahs);
        setSurah(data.data);
      });
  }, []);
  useEffect(() => {
    fetch(`https://api.alquran.cloud/v1/surah/${id}/en.asad`)
      .then((res) => res.json())
      .then((data) => setEnAyahs(data.data.ayahs));
  }, []);

  return (
    <div>
      <Header surah={surah} />
      <div className="flex gap-3 flex-col">
        {ayahs.map((ayah, index) => (
          <SingleSurah
            ayah={ayah}
            enayah={enayahs.length ? enayahs[index] : ""}
            key={ayah.number}
          />
        ))}
      </div>
    </div>
  );
};

export const SingleSurah = (props) => {
  const { ayah, enayah } = props;
  return (
    <div className="flex flex-col gap-4 border-b-2 p-4">
      <div className="flex bg-secondaryLight p-3 rounded-lg justify-between items-center">
        <p className="bg-primary w-9 h-9 text-white font-semibold flex justify-center items-center rounded-full">
          {ayah.numberInSurah}
        </p>
        <div className="flex text-primary text-2xl gap-4">
          <BiShareAlt className="cursor-pointer" />
          <IoPlayOutline className="cursor-pointer" />
          <BiBookmark className="cursor-pointer" />
        </div>
      </div>
      <p className="text-right font-semibold text-3xl">{ayah.text}</p>
      <p className=" text-3xl">{enayah.text}</p>
    </div>
  );
};

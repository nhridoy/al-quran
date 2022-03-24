import React from "react";
import { FiOctagon } from "react-icons/fi";
import { useParams } from "react-router-dom";
// import Ayahs from "../Ayahs/Ayahs";
import loadable from "@loadable/component";
const Ayahs = loadable(() => import("../Ayahs/Ayahs"));

export const ParaHead = ({ para }) => {
  const { id } = useParams();
  return (
    <div className="">
      <div className="flex sticky top-24 justify-between bg-secondary text-white p-4 rounded-lg">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <FiOctagon className="font-bold text-4xl" />
            <span className="absolute inset-0 font-semibold grid place-items-center">
              {para.no}
            </span>
          </div>
          <div className="flex gap-1 flex-col">
            <div className="font-semibold md:text-lg">{para.enName}</div>
            <div className="flex flex-col gap-1 text-xs">
              <span className="flex gap-1">
                {para.revelationType === "Meccan" ? (
                  <img
                    src="https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png"
                    alt="Meccan"
                  />
                ) : (
                  <img
                    src="https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-13.png"
                    alt="Medinan"
                  />
                )}
                <span className="uppercase">{para.revelationType}</span>
              </span>

              <span className="uppercase">
                {para.verses.length} verses in para {id}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right text-sm md:text-lg">
          <p className=" md:font-semibold">{para.name}</p>
          <p>{para.enNameTranslation}</p>
          <p>{para.bnNameTranslation}</p>
        </div>
      </div>
      {para.verses.map((verse, index) => (
        <Ayahs ayah={verse} key={index} />
      ))}
    </div>
  );
};

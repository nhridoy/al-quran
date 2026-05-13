import React from "react";
import { FiOctagon } from "react-icons/fi";

const SurahList = (props) => {
  return (
    <div className="py-4 px-3 hover:bg-purple-600Light dark:hover:bg-[#191f24] dark:active:bg-[#14191d] rounded-md flex md:flex-col justify-between items-center gap-4 border-b-2 md:border-2 border-purple-400 lg:cursor-pointer">
      <div className="flex gap-4">
        <div className="flex items-center gap-3 md:flex-col">
          <div className="relative">
            <FiOctagon className="text-6xl font-bold text-primary dark:text-white" />
            <span className="absolute inset-0 grid font-semibold place-items-center dark:text-white">
              {props.data.no}
            </span>
          </div>
          <div className="flex flex-col gap-1 md:items-center dark:text-white">
            <div className="font-semibold">{props.data.enName}</div>
            <div className="flex flex-col gap-2 text-xs text-gray-600 md:flex-row dark:text-gray-400">
              <span className="flex gap-1">
                {props.data.revelationType === "Meccan" ? (
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
                <span className="uppercase">{props.data.revelationType}</span>
              </span>

              <span className="uppercase">
                {props.data.numberOfAyahs} verses
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-right md:w-full dark:text-white">
        <p>{props.data.name}</p>
        <p>{props.data.enNameTranslation}</p>
        <p>{props.data.bnNameTranslation}</p>
      </div>
    </div>
  );
};

export default SurahList;

import React from "react";
import { FiOctagon } from "react-icons/fi";

export const SurahList = (props) => {
  return (
    <div className="py-4 px-3 hover:bg-secondaryLight dark:hover:bg-[#191f24] active:bg-alternateOne rounded-md flex md:flex-col justify-between items-center gap-4 border-b-2 md:border-2 border-alternateOne lg:cursor-pointer">
      <div className="flex gap-4">
        <div className="flex gap-3 md:flex-col  items-center">
          <div className="relative">
            <FiOctagon className="text-primary dark:text-white font-bold text-6xl" />
            <span className="absolute inset-0 font-semibold grid place-items-center dark:text-white">
              {props.data.no}
            </span>
          </div>
          <div className="flex gap-1 flex-col md:items-center dark:text-white">
            <div className="font-semibold">{props.data.enName}</div>
            <div className="flex flex-col md:flex-row gap-2 text-gray-600 dark:text-gray-400 text-xs">
              <span className="flex gap-1">
                {props.data.revelationType === "Meccan" ? (
                  <img src="https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png" />
                ) : (
                  <img src="https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-13.png" />
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
      <div className="md:w-full text-right text-sm dark:text-white">
        <p>{props.data.name}</p>
        <p>{props.data.enNameTranslation}</p>
        <p>{props.data.bnNameTranslation}</p>
      </div>
    </div>
  );
};

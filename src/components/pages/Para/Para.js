import React, { useEffect } from "react";
import { FaQuran } from "react-icons/fa";
import { BsBoxArrowInRight } from "react-icons/bs";
import { Header } from "../../Header/Header";
import { FiOctagon } from "react-icons/fi";

export const Para = (props) => {
  useEffect(() => {
    document.querySelector("html").classList.remove("overflow-x-hidden");
    document.querySelector("body").classList.remove("overflow-x-hidden");
  }, []);
  return (
    <div className="">
      <div className="bg-white sticky top-0 left-0 w-full">
        <Header head="Para 1" />
      </div>
      <div className="flex justify-between bg-secondary text-white p-4 rounded-lg">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <FiOctagon className="font-bold text-4xl" />
            <span className="absolute inset-0 font-semibold grid place-items-center">
              1
            </span>
          </div>
          <div className="flex gap-1 flex-col">
            <div className="font-semibold md:text-lg">Al Fatiha</div>
            <div className="flex flex-col gap-1 text-xs">
              <span className="flex gap-1">
                {/* {props.data.revelationType === "Meccan" ? (
                <img src="https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png" />
              ) : (
                <img src="https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-13.png" />
              )} */}
                <span className="uppercase">Madina</span>
              </span>

              <span className="uppercase">7 verses</span>
            </div>
          </div>
        </div>
        <div className="text-right text-sm md:text-lg">
          <p className=" md:font-semibold">سُورَةُ ٱلْفَاتِحَةِ</p>
          <p>The Opening</p>
          <p>আল ফাতিহা </p>
        </div>
      </div>
    </div>
  );
};

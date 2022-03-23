import React from "react";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import HamBurger from "../Hamburger/HamBurger";

export const Header = (props) => {
  const handleBackBtn = (e) => {
    window.history.back();
  };

  return (
    <div className="py-6 text-xl bg-white dark:bg-[#20282e]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-0">
            <HamBurger />
            <BiArrowBack
              onClick={(e) => handleBackBtn(e)}
              className="cursor-pointer  dark:text-white"
            />
          </div>

          <h2 className="text-primary dark:text-white font-bold">
            {!props.head ? props.surah.enName : props.head}
          </h2>
        </div>
        <BiSearch className=" dark:text-white" />
      </div>
    </div>
  );
};

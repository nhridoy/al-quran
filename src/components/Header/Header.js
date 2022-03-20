import React from "react";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import HamBurger from "../Hamburger/HamBurger";

export const Header = (props) => {
  const { surah } = props;

  const handleBackBtn = (e) => {
    window.history.back();
  };

  return (
    <div className="py-6 text-xl bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-0">
            <HamBurger />
            <BiArrowBack
              onClick={(e) => handleBackBtn(e)}
              className="cursor-pointer"
            />
          </div>

          <h2 className="text-primary font-bold">
            {Object.keys(props).length ? surah.enName : "Quran Mazid"}
          </h2>
        </div>
        <BiSearch />
      </div>
    </div>
  );
};

import React from "react";
import { BiArrowBack, BiSearch } from "react-icons/bi";

export const Header = (props) => {
  const { surah } = props;

  const handleBackBtn = (e) => {
    window.history.back();
  };

  return (
    <div className="my-6 text-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <BiArrowBack
            onClick={(e) => handleBackBtn(e)}
            className="cursor-pointer"
          />
          <h2 className="text-primary font-bold">
            {Object.keys(props).length ? surah.englishName : "Quran Mazid"}
          </h2>
        </div>
        <BiSearch />
      </div>
    </div>
  );
};

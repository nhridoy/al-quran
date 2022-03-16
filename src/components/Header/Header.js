import React from "react";
import { BiArrowBack, BiSearch } from "react-icons/bi";

export const Header = () => {
  return (
    <div className="my-6 text-xl">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <BiArrowBack />
          <h2 className="text-primary font-bold">Quran Mazid</h2>
        </div>
        <BiSearch />
      </div>
    </div>
  );
};

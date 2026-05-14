import { Spin as HamburgerBtn } from "hamburger-react";
import React from "react";
import Drawer from "react-drag-drawer";
import { AiOutlineDoubleLeft, AiOutlineHeart } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdMenuBook } from "react-icons/md";
import { RiHandHeartLine } from "react-icons/ri";
import { VscBook } from "react-icons/vsc";
import { NavLink } from "react-router-dom";

const HamBurger: React.FC = () => {
  const [sidebarLeft, setSidebarLeft] = React.useState(false);

  const toggle = (value: boolean) => () => {
    setSidebarLeft(value);
  };

  return (
    <>
      <button type="button" onClick={toggle(true)} className="dark:text-white">
        <HamburgerBtn
          size={20}
          toggled={sidebarLeft}
          hideOutline={false}
          rounded
        />
      </button>

      <Drawer
        open={sidebarLeft}
        onRequestClose={toggle(false)}
        modalElementClass="bg-white dark:bg-[#20282e] h-screen left-0 absolute grid grid-rows-3 w-2/3 md:w-1/5"
        direction="left"
      >
        <div className="flex items-center justify-center row-span-1 p-5 text-white bg-primary">
          <h1 className="text-2xl font-bold">Al Quran</h1>
        </div>
        <div className="row-span-2">
          <nav className="flex flex-col">
            <NavLink
              to="/surah"
              className="flex items-center p-3 hover:bg-alternateOne dark:hover:bg-[#191f24]"
            >
              <div className="flex items-center gap-3">
                <VscBook className="text-xl font-bold dark:text-white" />
                <span className="font-bold text-primary dark:text-white">
                  Surah
                </span>
              </div>
            </NavLink>
            <NavLink
              to="/para"
              className="flex items-center p-3 hover:bg-alternateOne dark:hover:bg-[#191f24]"
            >
              <div className="flex items-center gap-3">
                <MdMenuBook className="text-xl font-bold dark:text-white" />
                <span className="font-bold text-primary dark:text-white">
                  Para
                </span>
              </div>
            </NavLink>
            <NavLink
              to="/settings"
              className="flex items-center p-3 hover:bg-alternateOne dark:hover:bg-[#191f24]"
            >
              <div className="flex items-center gap-3">
                <IoSettingsOutline className="text-xl font-bold dark:text-white" />
                <span className="font-bold text-primary dark:text-white">
                  Settings
                </span>
              </div>
            </NavLink>
            <NavLink
              to="/about"
              className="flex items-center p-3 hover:bg-alternateOne dark:hover:bg-[#191f24]"
            >
              <div className="flex items-center gap-3">
                <BsInfoCircle className="text-xl font-bold dark:text-white" />
                <span className="font-bold text-primary dark:text-white">
                  About
                </span>
              </div>
            </NavLink>
            <NavLink
              to="/credits"
              className="flex items-center p-3 hover:bg-alternateOne dark:hover:bg-[#191f24]"
            >
              <div className="flex items-center gap-3">
                <AiOutlineHeart className="text-xl font-bold dark:text-white" />
                <span className="font-bold text-primary dark:text-white">
                  Credits
                </span>
              </div>
            </NavLink>
            <NavLink
              to="/donation"
              className="flex items-center p-3 hover:bg-alternateOne dark:hover:bg-[#191f24]"
            >
              <div className="flex items-center gap-3">
                <RiHandHeartLine className="text-xl font-bold dark:text-white" />
                <span className="font-bold text-primary dark:text-white">
                  Donation
                </span>
              </div>
            </NavLink>
          </nav>
        </div>
        <button
          type="button"
          className="py-3 font-semibold text-white bg-alternateSecond"
          onClick={toggle(false)}
        >
          <div className="flex items-center justify-center gap-1">
            <AiOutlineDoubleLeft />
            Close
          </div>
        </button>
      </Drawer>
    </>
  );
};

export default HamBurger;

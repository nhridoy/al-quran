import React, { PureComponent } from "react";
import { Spin as HamburgerBtn } from "hamburger-react";
import Drawer from "react-drag-drawer";
import { BsInfoCircle } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { RiHandHeartLine } from "react-icons/ri";
import { AiOutlineDoubleLeft, AiOutlineHeart } from "react-icons/ai";
import { FaQuran } from "react-icons/fa";
import { VscBook } from "react-icons/vsc";
import { MdMenuBook } from "react-icons/md";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { Settings } from "../pages/Settings/Settings";
import { About } from "../pages/About/About";
import { Credits } from "../pages/Credits/Credits";
import { Donation } from "../pages/Donation/Donation";

const HamBurger = () => {
  const [sidebarLeft, setSidebarLeft] = React.useState(false);

  const toggle = (value) => (event) => {
    setSidebarLeft(value);
  };

  return (
    <>
      <button onClick={toggle(true)} className={"Toggle"}>
        <HamburgerBtn size={20} toggled={sidebarLeft} />
      </button>

      <Drawer
        open={sidebarLeft}
        onRequestClose={toggle(false)}
        modalElementClass="bg-white h-screen left-0 absolute grid grid-rows-3 w-2/3 md:w-1/5"
        direction="left"
      >
        <div className="row-span-1 bg-primary p-5 text-white flex items-center justify-center">
          <h1 className="text-2xl font-bold">Al Quran</h1>
        </div>
        <div className="row-span-2">
          <nav className="flex flex-col">
            <NavLink
              exact
              to="/surah"
              className="flex items-center p-3 hover:bg-alternateOne"
            >
              <div className="flex items-center gap-3">
                <VscBook className="text-xl font-bold" />
                <span className="text-primary  font-bold">Surah</span>
              </div>
            </NavLink>
            <NavLink
              exact
              to="/para"
              className="flex items-center p-3 hover:bg-alternateOne"
            >
              <div className="flex items-center gap-3">
                <MdMenuBook className="text-xl font-bold" />
                <span className="text-primary  font-bold">Para</span>
              </div>
            </NavLink>
            <NavLink
              exact
              to="/settings"
              className="flex items-center p-3 hover:bg-alternateOne"
            >
              <div className="flex items-center gap-3">
                <BsInfoCircle className="text-xl font-bold" />
                <span className="text-primary  font-bold">Settings</span>
              </div>
            </NavLink>
            <NavLink
              exact
              to="/about"
              className="flex items-center p-3 hover:bg-alternateOne"
            >
              <div className="flex items-center gap-3">
                <IoSettingsOutline className="text-xl font-bold" />
                <span className="text-primary font-bold">About</span>
              </div>
            </NavLink>
            <NavLink
              exact
              to="/credits"
              className="flex items-center p-3 hover:bg-alternateOne"
            >
              <div className="flex items-center gap-3">
                <AiOutlineHeart className="text-xl font-bold" />
                <span className="text-primary font-bold">Credits</span>
              </div>
            </NavLink>
            <NavLink
              exact
              to="/donation"
              className="flex  items-center p-3 hover:bg-alternateOne"
            >
              <div className="flex items-center gap-3">
                <RiHandHeartLine className="text-xl font-bold" />
                <span className="text-primary font-bold">Donation</span>
              </div>
            </NavLink>
          </nav>
        </div>
        <button
          className="bg-alternateSecond font-semibold text-white py-3"
          onClick={toggle(false)}
        >
          <div className="flex gap-1 items-center justify-center">
            <AiOutlineDoubleLeft />
            Close
          </div>
        </button>
      </Drawer>
    </>
  );
};

export default HamBurger;

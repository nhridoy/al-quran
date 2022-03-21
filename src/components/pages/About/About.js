import React from "react";
import { Header } from "../../Header/Header";
import { BsDot } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import {
  AiFillTwitterCircle,
  AiOutlineMail,
  AiOutlineGithub,
} from "react-icons/ai";
import { IoLogoFacebook, IoLogoWhatsapp } from "react-icons/io5";

export const About = () => {
  return (
    <div>
      <Header head="About" />
      <div className="grid grid-rows-5">
        <div className="row-span-1 flex items-center justify-center text-lg font-bold">
          <h2 className=" md:text-2xl">Wo We Are?</h2>
        </div>
        <div className="row-span-4 bg-secondary text-white p-5 rounded-t-3xl flex items-center flex-col divide-y">
          <div className="flex items-center flex-col p-4">
            <h2 className="text-4xl font-bold">01</h2>
            <p className="mb-1 md:text-lg">Contact Us</p>
            <div className="flex gap-3 items-center text-2xl">
              <AiOutlineGithub className="" />
              <IoLogoFacebook className="" />
              <AiFillTwitterCircle className="" />
              <AiOutlineMail className="" />
              <IoLogoWhatsapp className="" />
            </div>
          </div>
          {/* <hr /> */}
          <div className="flex items-center flex-col p-4 gap-2">
            <p className="mb-1 md:text-lg">About Us</p>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold">01</h2>
              <div className="">
                <h2>Binary Software Solution</h2>
                <p className="text-xs">
                  We are a team of software developers and designers.
                </p>
                <address className="mt-3">
                  <p className="text-xs">
                    <span className="">Dhaka, Bangladesh</span>
                    <br />
                    <span className="">+8801768098882</span>
                    <br />
                    <span className="">nahidujjamanhridoy@gmail.com</span>
                  </p>
                </address>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-col p-4 gap-2">
            <p className="mb-1 md:text-lg">What we do?</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <GoPrimitiveDot />
                <p className="text-xs md:text-sm">
                  We are a team of software developers and designers.
                </p>
              </div>
              <div className="flex gap-3">
                <GoPrimitiveDot />
                <p className="text-xs md:text-sm">
                  We are a team of software developers and designers.
                </p>
              </div>
              <div className="flex gap-3">
                <GoPrimitiveDot />
                <p className="text-xs md:text-sm">
                  We are a team of software developers and designers.
                </p>
              </div>
              <div className="flex gap-3">
                <GoPrimitiveDot />
                <p className="text-xs md:text-sm">
                  We are a team of software developers and designers.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-col p-4 gap-2">
            <p className="mb-1 md:text-lg">www.binarytech.com</p>
          </div>
          {/* <h2 className="text-xl font-bold">
              We are a team of software developers and designers.
            </h2> */}
          {/* <p className="text-lg">
            Al Quran is a web application that helps you learn the Holy Quran in
            a simple and easy way. It is a free and open source project. You can
            use it for free.
          </p> */}
        </div>
      </div>
    </div>
  );
};
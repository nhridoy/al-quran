import React, { useEffect } from "react";
import { Header } from "../../Header/Header";
import { GoPrimitiveDot } from "react-icons/go";
import {
  AiFillTwitterCircle,
  AiOutlineMail,
  AiOutlineGithub,
} from "react-icons/ai";
import { IoLogoFacebook, IoLogoWhatsapp } from "react-icons/io5";

export const About = () => {
  useEffect(() => {
    document.querySelector("html").classList.remove("overflow-x-hidden");
    document.querySelector("body").classList.remove("overflow-x-hidden");
  }, []);
  return (
    <div>
      <div className="bg-white sticky top-0 left-0 w-full z-10">
        <Header head="About" />
      </div>
      <div className="grid grid-rows-5">
        <div className="row-span-1 flex items-center justify-center text-lg font-bold">
          <h2 className=" md:text-2xl dark:text-white">Wo We Are?</h2>
        </div>
        <div className="row-span-4 bg-secondary text-white p-5 rounded-t-3xl flex items-center flex-col divide-y">
          <div className="flex items-center flex-col p-4">
            <h2 className="text-4xl font-bold">01</h2>
            <p className="mb-1 md:text-lg">Contact Us</p>
            <div className="flex gap-3 items-center text-2xl">
              <a href="https://github.com/nhridoy" target="_blank">
                <AiOutlineGithub className="" />
              </a>
              <a
                href="https://www.facebook.com/nahidujjaman.hridoy"
                target="_blank"
              >
                <IoLogoFacebook className="" />
              </a>
              <a href="https://twitter.com/hridoyboss12" target="_blank">
                <AiFillTwitterCircle className="" />
              </a>
              <a href="mailto:nahidujjamanhridoy@gmail.com" target="_blank">
                <AiOutlineMail className="" />
              </a>
              <a href="https://wa.me/8801768098882" target="_blank">
                <IoLogoWhatsapp className="" />
              </a>
            </div>
          </div>
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
              <div className="flex items-center gap-3">
                <GoPrimitiveDot />
                <p className="text-xs md:text-sm">
                  We are a team of software developers and designers.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <GoPrimitiveDot />
                <p className="text-xs md:text-sm">
                  We develop web and mobile applications.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <GoPrimitiveDot />
                <p className="text-xs md:text-sm">
                  We have years of experience in developing web and mobile
                  applications.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <GoPrimitiveDot />
                <p className="text-xs md:text-sm">
                  We use latest technologies to develop web and mobile
                  applications.
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

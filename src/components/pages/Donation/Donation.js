import React, { useRef, useState } from "react";
import { Header } from "../../Header/Header";
import { GoPrimitiveDot } from "react-icons/go";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards } from "swiper";

export const Donation = () => {
  return (
    <div>
      <Header head="Donation" />
      <div className="grid grid-rows-5">
        <div className="row-span-1 flex items-center justify-center text-lg font-bold">
          <h2 className=" md:text-2xl">Donate</h2>
        </div>
        <div className="row-span-4 bg-secondary text-white p-5 rounded-t-3xl flex flex-col items-center gap-4">
          <p>
            50% of your donation will go directy to different mosque and islamic
            education center.
          </p>
          <p>Other 50% will be used for server maintanance fee.</p>
          <div className="">
            <Swiper
              // install Swiper modules
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards, Navigation, Pagination, Scrollbar, A11y]}
              className="mySwiper"
            >
              <SwiperSlide>Slide 1</SwiperSlide>
              <SwiperSlide>Slide 2</SwiperSlide>
              <SwiperSlide>Slide 3</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

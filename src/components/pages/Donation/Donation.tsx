import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Header } from "../../Header/Header";
import "swiper/css";
import "swiper/css/effect-cards";

const Donation: React.FC = () => {
  return (
    <div className="h-screen">
      <div className="bg-white sticky top-0 left-0 w-full z-10">
        <Header head="Donation" />
      </div>
      <div className="grid grid-rows-5">
        <div className="row-span-1 flex items-center justify-center text-lg font-bold">
          <h2 className=" md:text-2xl dark:text-white">Donate</h2>
        </div>
        <div className="row-span-4 bg-secondary text-white p-5 rounded-t-3xl flex flex-col items-center gap-4">
          <p>
            50% of your donation will go directy to different mosque and islamic
            education center.
          </p>
          <p>Other 50% will be used for server maintenance fee.</p>
          <div className="">
            <Swiper
              effect="cards"
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper"
            >
              <SwiperSlide>Slide 1</SwiperSlide>
              <SwiperSlide>Slide 2</SwiperSlide>
              <SwiperSlide>Slide 3</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide>
              <SwiperSlide>Slide 5</SwiperSlide>
              <SwiperSlide>Slide 6</SwiperSlide>
              <SwiperSlide>Slide 7</SwiperSlide>
              <SwiperSlide>Slide 8</SwiperSlide>
              <SwiperSlide>Slide 9</SwiperSlide>
              <SwiperSlide>Slide 10</SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;

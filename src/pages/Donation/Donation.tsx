import { AiOutlineGift } from "react-icons/ai";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Header } from "../../components/common/Header/Header";
import "swiper/css";
import "swiper/css/effect-cards";

const Donation: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header head="Donation" />
      <div className="mx-4 space-y-6 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Support Us
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Your contributions help us maintain and improve
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card">
          <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
              <AiOutlineGift className="text-lg text-primary dark:text-secondary-light" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                Donate
              </h3>
            </div>
          </div>
          <div className="space-y-3 p-4 text-sm text-text-secondary dark:text-dark-text-secondary">
            <p>
              50% of your donation will go directly to different mosque and
              islamic education center.
            </p>
            <p>Other 50% will be used for server maintenance fee.</p>
          </div>
        </div>

        <div className="flex justify-center py-4">
          <Swiper
            effect="cards"
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <SwiperSlide
                key={n}
                className="flex! items-center! justify-center! rounded-2xl! bg-linear-to-br! from-primary! to-secondary!"
              >
                <span className="text-lg font-bold text-white">
                  Donation {n}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Donation;

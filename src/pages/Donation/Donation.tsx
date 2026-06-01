import { AiOutlineGift } from "react-icons/ai";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { PageShell } from "@/components/common/PageShell/PageShell";
import "swiper/css";
import "swiper/css/effect-cards";

const Donation: React.FC = () => {
  return (
    <PageShell
      head="Donation"
      title="Support Us"
      description="Your contributions help us maintain and improve"
      className="space-y-6"
    >
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
          className="w-60 h-80"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <SwiperSlide
              key={n}
              className="flex! items-center! justify-center! rounded-2xl! text-[22px]! bg-linear-to-br! from-primary! to-secondary!"
            >
              <span className="text-lg font-bold text-white">Donation {n}</span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </PageShell>
  );
};

export default Donation;

import { useEffect, useState } from "react";
import {
  IoChevronForward,
  IoLocationOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { MdAccessTime, MdExplore, MdOutlineRestaurant } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";

function CompassNeedle({ angle }: { angle: number }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-28 w-28 sm:h-32 sm:w-32"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="compass-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9345f2" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#2e0d8a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2e0d8a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#compass-bg)" />
      <circle
        cx="40"
        cy="40"
        r="34"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="4 4"
        className="text-white/12"
      />
      <circle
        cx="40"
        cy="40"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.3"
        className="text-white/8"
      />
      {[
        { a: 0, l: "N" },
        { a: 90, l: "E" },
        { a: 180, l: "S" },
        { a: 270, l: "W" },
      ].map(({ a, l }) => {
        const rad = (a * Math.PI) / 180;
        return (
          <g key={l}>
            <line
              x1={40 + 24 * Math.cos(rad)}
              y1={40 + 24 * Math.sin(rad)}
              x2={40 + 32 * Math.cos(rad)}
              y2={40 + 32 * Math.sin(rad)}
              stroke="currentColor"
              strokeWidth="0.8"
              className="text-white/25"
            />
            <text
              x={40 + 37 * Math.cos(rad)}
              y={40 + 37 * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize="5"
              fontWeight="600"
              className="text-white/35"
            >
              {l}
            </text>
          </g>
        );
      })}
      <g
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: "40px 40px",
        }}
        className="transition-transform duration-1000 ease-out"
      >
        <polygon points="40,8 36,40 40,44 44,40" className="fill-red-400/80" />
        <polygon points="40,72 36,40 40,36 44,40" className="fill-white/40" />
        <circle cx="40" cy="40" r="3" className="fill-white/80" />
      </g>
    </svg>
  );
}

export default function StepLocation({
  locationGranted,
  isDetecting,
  error,
  locationLabel,
  onRequestLocation,
  onNext,
}: {
  locationGranted: boolean;
  isDetecting: boolean;
  error: string | null;
  locationLabel: string | null;
  onRequestLocation: () => void;
  onNext: () => void;
}) {
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [needleAngle, setNeedleAngle] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDetecting) {
      setNeedleAngle((prev) => prev + 720);
    } else {
      setNeedleAngle((prev) => prev + 15);
    }
  }, [isDetecting]);

  useEffect(() => {
    if (locationGranted) {
      setNeedleAngle(45);
    }
  }, [locationGranted]);

  return (
    <div
      className={`flex h-full flex-col transition-all duration-700 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {/* Compass */}
      <div className="flex shrink-0 items-center justify-center">
        <div className="relative flex items-center justify-center">
          {isDetecting && (
            <div
              className="absolute h-36 w-36 animate-ping rounded-full bg-[#9345f2]/8"
              style={{ animationDuration: "2s" }}
            />
          )}
          {locationGranted && (
            <div
              className="absolute h-32 w-32 animate-ping rounded-full bg-green-500/8"
              style={{ animationDuration: "2.5s" }}
            />
          )}
          <CompassNeedle angle={needleAngle} />
        </div>
      </div>

      {/* Title */}
      <div className="mt-2 shrink-0 text-center">
        <h2 className="bg-gradient-to-r from-white to-[#b87aff] bg-clip-text text-xl font-bold text-transparent">
          {locationGranted
            ? t("onboarding.locationTitleSet")
            : isDetecting
              ? t("onboarding.locationTitleDetecting")
              : t("onboarding.locationTitle")}
        </h2>
        <p className="mt-0.5 text-xs text-white/35">
          {locationGranted
            ? locationLabel || t("onboarding.locationDescSet")
            : isDetecting
              ? t("onboarding.locationDescDetecting")
              : t("onboarding.locationDesc")}
        </p>
      </div>

      {/* Content — fills space between title and buttons */}
      <div className="mt-4 flex flex-1 flex-col">
        {!locationGranted && !isDetecting && !error && (
          <div className="flex flex-1 flex-col animate-fade-in">
            <div className="flex flex-1 flex-col justify-center">
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    icon: MdAccessTime,
                    label: t("onboarding.locationBenefit1"),
                  },
                  { icon: MdExplore, label: t("onboarding.locationBenefit2") },
                  {
                    icon: MdOutlineRestaurant,
                    label: t("onboarding.locationBenefit3"),
                  },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] py-2.5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/35">
                      <Icon className="text-sm" />
                    </div>
                    <span className="text-[10px] font-medium text-white/30">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto flex items-center justify-center gap-1.5 pb-1">
              <IoShieldCheckmarkOutline className="text-[10px] text-white/20" />
              <span className="text-[10px] text-white/20">
                {t("onboarding.locationPrivacy")}
              </span>
            </div>
          </div>
        )}

        {isDetecting && (
          <div className="flex flex-1 items-center justify-center animate-fade-in">
            <div className="flex gap-1">
              {[0, 200, 400].map((d) => (
                <div
                  key={d}
                  className="h-2 w-2 animate-bounce rounded-full bg-[#b87aff]"
                  style={{
                    animationDelay: `${d}ms`,
                    animationDuration: "1.2s",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {error && !isDetecting && !locationGranted && (
          <div className="flex flex-1 flex-col animate-fade-in">
            <div className="flex flex-1 flex-col justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-red-400">
                  {t("onboarding.locationError")}
                </p>
                <p className="mt-0.5 text-xs text-white/30">{error}</p>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-center gap-1.5 pb-1">
              <IoShieldCheckmarkOutline className="text-[10px] text-white/20" />
              <span className="text-[10px] text-white/20">
                {t("onboarding.locationPrivacy")}
              </span>
            </div>
          </div>
        )}

        {locationGranted && (
          <div className="flex flex-1 flex-col animate-fade-in">
            <div className="flex flex-1 flex-col justify-center">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/15">
                  <svg
                    className="h-3.5 w-3.5 text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-400">
                  {t("onboarding.locationSaved")}
                </span>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-center gap-1.5 pb-1">
              <IoShieldCheckmarkOutline className="text-[10px] text-white/20" />
              <span className="text-[10px] text-white/20">
                {t("onboarding.locationPrivacy")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Buttons — always same Y position as ListSelectStep Continue */}
      <div className="mt-5 shrink-0">
        {!locationGranted && !isDetecting && !error && (
          <div className="animate-fade-in grid grid-cols-3 gap-2.5">
            <Button
              variant="gradient"
              className="col-span-2 flex items-center justify-center gap-2 py-3 h-auto text-sm font-semibold shadow-lg shadow-[#9345f2]/20"
              onClick={onRequestLocation}
            >
              <IoLocationOutline className="text-base" />
              {t("onboarding.shareLocation")}
            </Button>
            <Button
              variant="white-ghost"
              className="flex items-center justify-center gap-1 rounded-xl bg-white/5 py-3 h-auto text-xs font-medium text-white/40 hover:bg-white/10 hover:text-white/60"
              onClick={onNext}
            >
              {t("onboarding.skip")}
              <IoChevronForward className="text-xs" />
            </Button>
          </div>
        )}

        {isDetecting && null}

        {error && !isDetecting && !locationGranted && (
          <div className="animate-fade-in grid grid-cols-2 gap-2.5">
            <Button
              variant="white-ghost"
              className="rounded-xl bg-white/8 py-2.5 h-auto text-xs font-medium text-white/70 hover:bg-white/15"
              onClick={onRequestLocation}
            >
              {t("onboarding.tryAgain")}
            </Button>
            <Button
              variant="white-ghost"
              className="rounded-xl bg-white/5 py-2.5 h-auto text-xs font-medium text-white/40 hover:bg-white/10"
              onClick={onNext}
            >
              {t("onboarding.skip")}
            </Button>
          </div>
        )}

        {locationGranted && (
          <div className="animate-fade-in">
            <Button
              variant="gradient"
              className="flex w-full items-center justify-center gap-2 py-3 h-auto text-sm shadow-lg shadow-[#9345f2]/20 hover:shadow-xl hover:shadow-[#9345f2]/30"
              onClick={onNext}
            >
              {t("onboarding.continue")}
              <IoChevronForward className="text-base" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

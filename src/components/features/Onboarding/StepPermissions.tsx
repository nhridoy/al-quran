import { useEffect, useState } from "react";
import {
  IoChevronForward,
  IoNotificationsOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { MdAccessTime, MdAutoGraph, MdFlag } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";

function BellVisual({
  requesting,
  granted,
}: {
  requesting: boolean;
  granted: boolean;
}) {
  return (
    <svg viewBox="0 0 80 80" className="h-32 w-32" aria-hidden="true">
      <defs>
        <radialGradient id="bell-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9345f2" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#2e0d8a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2e0d8a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow */}
      <circle cx="40" cy="40" r="38" fill="url(#bell-bg)" />

      {/* Sound wave arcs */}
      {requesting && (
        <g>
          <path
            d="M52 30 Q60 40 52 50"
            fill="none"
            stroke="#b87aff"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          >
            <animate
              attributeName="opacity"
              values="0.5;0.1;0.5"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M58 26 Q68 40 58 54"
            fill="none"
            stroke="#b87aff"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.3"
          >
            <animate
              attributeName="opacity"
              values="0.3;0;0.3"
              dur="1.5s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      )}

      {granted && (
        <g>
          <path
            d="M52 30 Q60 40 52 50"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M58 26 Q68 40 58 54"
            fill="none"
            stroke="#22c55e"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>
      )}

      {/* Bell body */}
      <g
        className={requesting ? "animate-bounce" : ""}
        style={
          requesting
            ? { animationDuration: "0.6s", animationIterationCount: "1" }
            : undefined
        }
      >
        {/* Bell dome */}
        <path
          d="M30 48 L30 30 A10 10 0 0 1 50 30 L50 48 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={
            granted
              ? "text-green-400"
              : requesting
                ? "text-[#b87aff]"
                : "text-white/30"
          }
        />
        {/* Bell bottom rim */}
        <line
          x1="28"
          y1="48"
          x2="52"
          y2="48"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={
            granted
              ? "text-green-400"
              : requesting
                ? "text-[#b87aff]"
                : "text-white/30"
          }
        />
        {/* Bell clapper */}
        <circle
          cx="40"
          cy="52"
          r="2.5"
          fill="currentColor"
          className={
            granted
              ? "text-green-400"
              : requesting
                ? "text-[#b87aff]"
                : "text-white/30"
          }
        />
        {/* Bell top knob */}
        <circle
          cx="40"
          cy="28"
          r="1.5"
          fill="currentColor"
          className={
            granted
              ? "text-green-400"
              : requesting
                ? "text-[#b87aff]"
                : "text-white/30"
          }
        />
      </g>

      {/* Checkmark overlay on granted */}
      {granted && (
        <g>
          <circle
            cx="55"
            cy="28"
            r="8"
            fill="#22c55e"
            className="drop-shadow-lg"
          />
          <polyline
            points="51,28 54,31 59,25"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}

export default function StepPermissions({
  notificationGranted,
  onRequestNotification,
  onNext,
}: {
  notificationGranted: boolean;
  onRequestNotification: () => void;
  onNext: () => void;
}) {
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex h-full flex-col transition-all duration-700 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {/* Bell visual */}
      <div className="flex shrink-0 items-center justify-center py-2">
        <div className="relative flex items-center justify-center">
          {!notificationGranted && (
            <div
              className="absolute h-40 w-40 animate-ping rounded-full bg-[#9345f2]/8"
              style={{ animationDuration: "3s" }}
            />
          )}
          <BellVisual requesting={false} granted={notificationGranted} />
        </div>
      </div>

      {/* Title */}
      <div className="shrink-0 text-center">
        <h2 className="bg-gradient-to-r from-white to-[#b87aff] bg-clip-text text-xl font-bold text-transparent">
          {notificationGranted
            ? t("onboarding.notifTitleOn")
            : t("onboarding.notifTitle")}
        </h2>
        <p className="mt-0.5 text-xs text-white/35">
          {notificationGranted
            ? t("onboarding.notifDescOn")
            : t("onboarding.notifDesc")}
        </p>
      </div>

      {/* Content — fills space between title and buttons */}
      <div className="mt-5 flex flex-1 flex-col">
        {!notificationGranted && (
          <div className="flex flex-1 flex-col animate-fade-in">
            <div className="flex flex-1 flex-col justify-center">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: MdAccessTime, label: t("onboarding.notifBenefit1") },
                  { icon: MdFlag, label: t("onboarding.notifBenefit2") },
                  { icon: MdAutoGraph, label: t("onboarding.notifBenefit3") },
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
                {t("onboarding.notifPrivacy")}
              </span>
            </div>
          </div>
        )}

        {notificationGranted && (
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
                  {t("onboarding.notifEnabled")}
                </span>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-center gap-1.5 pb-1">
              <IoShieldCheckmarkOutline className="text-[10px] text-white/20" />
              <span className="text-[10px] text-white/20">
                {t("onboarding.notifPrivacy")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Buttons — always same Y position as ListSelectStep Continue */}
      <div className="mt-5 shrink-0">
        {!notificationGranted && (
          <div className="animate-fade-in grid grid-cols-3 gap-2.5">
            <Button
              variant="gradient"
              className="col-span-2 flex items-center justify-center gap-2 py-3 h-auto text-sm font-semibold shadow-lg shadow-[#9345f2]/20"
              onClick={onRequestNotification}
            >
              <IoNotificationsOutline className="text-base" />
              {t("onboarding.enableNotif")}
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

        {notificationGranted && (
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

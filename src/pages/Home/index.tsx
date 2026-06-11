import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import {
  FaBookOpen,
  FaCheckCircle,
  FaHandHoldingHeart,
  FaMoon,
  FaStar,
} from "react-icons/fa";
import { IoBulbOutline } from "react-icons/io5";
import {
  MdAccessTime,
  MdChecklist,
  MdExplore,
  MdLoop,
  MdMenuBook,
  MdTrackChanges,
} from "react-icons/md";
import { Link } from "react-router-dom";
import PrayerGrid from "@/components/features/PrayerGrid/PrayerGrid";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PrayerIcon } from "@/components/ui/icons/prayer-icon";
import { KNOWLEDGE_FACTS } from "@/data/knowledgeFacts";
import {
  formatDateLong,
  formatHijri,
  isRamadan,
} from "@/lib/date";
import { useRandomContent } from "@/hooks/useRandomContent";
import { useLocale } from "@/i18n";
import {
  buildPrayerEntries,
  buildPrayerWindowMap,
  computePrayerTimes,
  findCurrentPrayer,
  findNextPrayer,
  formatTime,
  getCountdown,
} from "@/lib/prayerTimes";
import { useLocationStore } from "@/store/location";
import { useReadingStore } from "@/store/reading";
import { computeStreak, useReadingGoalsStore } from "@/store/readingGoals";
import { useSettings } from "@/store/settings";

interface GridItem {
  to: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}

const GRID_ITEMS: GridItem[] = [
  { to: "/surah", icon: FaBookOpen, label: "nav.surahs" },
  { to: "/para", icon: MdMenuBook, label: "nav.paras" },
  { to: "/prayer-times", icon: MdAccessTime, label: "nav.prayerTimes" },
  { to: "/daily-log", icon: MdChecklist, label: "nav.dailyLog" },
  { to: "/prayer-tracker", icon: FaCheckCircle, label: "nav.prayerTracker" },
  { to: "/fasting-calendar", icon: FaMoon, label: "nav.fasting" },
  { to: "/taraweeh-tracker", icon: FaMoon, label: "nav.taraweeh" },
  { to: "/qibla", icon: MdExplore, label: "nav.qibla" },
  { to: "/tasbih", icon: MdLoop, label: "nav.tasbih" },
  { to: "/hadith", icon: MdMenuBook, label: "nav.hadith" },
  { to: "/duas", icon: MdMenuBook, label: "nav.duas" },
  { to: "/asma-ul-husna", icon: FaStar, label: "nav.asmaUlHusna" },
  { to: "/sadaqah-tracker", icon: FaHandHoldingHeart, label: "nav.sadaqah" },
  { to: "/zakat-calculator", icon: FaCalculator, label: "nav.zakat" },
  { to: "/reading-goals", icon: MdTrackChanges, label: "nav.goals" },
];

function FaCalculator({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      role="img"
      aria-hidden="true"
    >
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3h2v2h-2V6zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm-4-8h2v2H8V6zm0 4h2v2H8v-2zm0 4h2v2H8v-2zm8 6h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2z" />
    </svg>
  );
}

function getTimeBasedGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "home.greetingMorning";
  if (h < 17) return "home.greetingAfternoon";
  if (h < 21) return "home.greetingEvening";
  return "home.greetingNight";
}

function PrayerCircle({
  name,
  countdown,
  percentage,
}: {
  name: string;
  countdown: string;
  percentage: number;
}) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;

  return (
    <div className="relative flex flex-col items-center">
      <svg
        viewBox="0 0 120 120"
        className="h-32 w-32"
        style={{ transform: "scaleX(-1) rotate(-90deg)" }}
        role="img"
        aria-label={`${name} prayer countdown: ${countdown}`}
      >
        <title>{`${name}: ${countdown}`}</title>
        <defs>
          <radialGradient id="circle-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9345f2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#9345f2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#circle-glow)" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-white/8"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-secondary drop-shadow-[0_0_12px_rgba(147,69,242,0.3)]"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-medium tracking-widest uppercase text-secondary/70">
          {name}
        </span>
        <span className="mt-0.5 text-xl font-bold text-white tabular-nums">
          {countdown}
        </span>
      </div>
    </div>
  );
}

function ReadingStreakWidget() {
  const { t } = useLocale();
  const goals = useReadingGoalsStore((s) => s.goals);
  const goalsLoaded = useReadingGoalsStore((s) => s.loaded);
  const loadGoals = useReadingGoalsStore((s) => s.load);
  const records = useReadingStore((s) => s.records);
  const readingLoaded = useReadingStore((s) => s.loaded);
  const loadReading = useReadingStore((s) => s.load);

  useEffect(() => {
    if (!goalsLoaded) loadGoals();
    if (!readingLoaded) loadReading();
  }, [goalsLoaded, readingLoaded, loadGoals, loadReading]);

  const streak = useMemo(() => computeStreak(records), [records]);
  const todayCount = useMemo(
    () =>
      records.filter((r) => r.date === new Date().toISOString().slice(0, 10))
        .length,
    [records],
  );

  return (
    <Link
      to="/reading-goals"
      className="group flex items-center gap-4 rounded-2xl border border-secondary/15 bg-gradient-to-br from-amber-900/10 to-amber-700/5 px-5 py-4 transition-all duration-300 hover:border-secondary/30 hover:shadow-lg hover:shadow-amber-900/10"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/20">
        <span className="text-xl">{streak > 0 ? "🔥" : "📖"}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white/90">
          {streak > 0
            ? t("home.streakDays", { streak })
            : t("home.readingGoals")}
        </p>
        <p className="mt-0.5 text-xs text-white/40">
          {todayCount > 0
            ? t("home.surahsReadToday", { count: todayCount })
            : t("home.noReadingToday")}
        </p>
      </div>
      <span className="shrink-0 text-xs font-medium text-secondary opacity-0 transition-opacity group-hover:opacity-100">
        {t("home.goalCount", { count: goals.length })} →
      </span>
    </Link>
  );
}

export default function Home() {
  const { t, locale } = useLocale();
  const { lat, lng } = useLocationStore();
  const { prayerCalcMethod, prayerAsrMethod } = useSettings();
  const { items, loading: contentLoading } = useRandomContent();
  const translationLang = useSettings((s) => s.translationLang);
  const hijriAdjust = useSettings((s) => s.hijriAdjust);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>(undefined);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = t("nav.brandTitle");
  }, [t]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());
    const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const adhanTimes = useMemo(() => {
    if (lat == null || lng == null) return null;
    return computePrayerTimes(
      { lat, lng },
      prayerCalcMethod,
      prayerAsrMethod,
      now,
    );
  }, [lat, lng, prayerCalcMethod, prayerAsrMethod, now]);

  const prayers = useMemo(() => buildPrayerEntries(adhanTimes), [adhanTimes]);

  const filteredPrayers = useMemo(
    () => prayers.filter((p) => p.key !== "sunrise"),
    [prayers],
  );

  const prayerWindowMap = useMemo(
    () => (adhanTimes ? buildPrayerWindowMap(prayers, adhanTimes) : null),
    [prayers, adhanTimes],
  );

  const currentPrayer = useMemo(
    () => findCurrentPrayer(filteredPrayers, now, prayerWindowMap ?? undefined),
    [filteredPrayers, now, prayerWindowMap],
  );
  const nextPrayer = useMemo(
    () => findNextPrayer(filteredPrayers, now),
    [filteredPrayers, now],
  );

  const isBetweenPrayers = currentPrayer?.key === nextPrayer?.key;

  const windowEndTime = useMemo<Date | null>(() => {
    if (!currentPrayer || !prayerWindowMap) return null;
    if (isBetweenPrayers) return null;
    return prayerWindowMap.get(currentPrayer.key) ?? null;
  }, [currentPrayer, isBetweenPrayers, prayerWindowMap]);

  const countdownTargetTime = useMemo(() => {
    const target = isBetweenPrayers
      ? (nextPrayer?.time ?? null)
      : windowEndTime;
    if (!target) return null;
    return target <= now ? new Date(target.getTime() + 86400000) : target;
  }, [nextPrayer, windowEndTime, isBetweenPrayers, now]);
  const countdownValue = useMemo(
    () => (countdownTargetTime ? getCountdown(now, countdownTargetTime) : ""),
    [countdownTargetTime, now],
  );

  const countdownPercentage = useMemo(() => {
    if (!currentPrayer) return 0;

    if (
      isBetweenPrayers &&
      nextPrayer &&
      prayerWindowMap &&
      countdownTargetTime
    ) {
      const idx = filteredPrayers.findIndex((p) => p.key === nextPrayer.key);
      const prevKey =
        idx > 0
          ? filteredPrayers[idx - 1].key
          : filteredPrayers[filteredPrayers.length - 1].key;
      let gapStart = prayerWindowMap.get(prevKey) ?? null;
      if (gapStart && gapStart > now) {
        gapStart = new Date(gapStart.getTime() - 86400000);
      }
      if (gapStart) {
        const total = countdownTargetTime.getTime() - gapStart.getTime();
        if (total > 0) {
          const elapsed = now.getTime() - gapStart.getTime();
          return Math.min(100, Math.max(0, 100 - (elapsed / total) * 100));
        }
      }
      return 0;
    }

    if (!windowEndTime) return 0;
    const endTime =
      windowEndTime <= currentPrayer.time
        ? new Date(windowEndTime.getTime() + 86400000)
        : windowEndTime;
    const total = endTime.getTime() - currentPrayer.time.getTime();
    if (total <= 0) return 0;
    const elapsed = now.getTime() - currentPrayer.time.getTime();
    return Math.min(100, Math.max(0, 100 - (elapsed / total) * 100));
  }, [
    currentPrayer,
    nextPrayer,
    windowEndTime,
    now,
    isBetweenPrayers,
    prayerWindowMap,
    filteredPrayers,
    countdownTargetTime,
  ]);

  const fajrTime = prayers.find((p) => p.key === "fajr");
  const maghribTime = prayers.find((p) => p.key === "maghrib");

  const isRamadanNow = useMemo(() => isRamadan(now, hijriAdjust), [now, hijriAdjust]);
  const hijriDate = useMemo(
    () => formatHijri(now, locale as "en" | "bn", hijriAdjust),
    [now, locale, hijriAdjust],
  );
  const gregDate = useMemo(() => formatDateLong(now, locale as "en" | "bn"), [now, locale]);

  const [factIndex] = useState(() =>
    Math.floor(Math.random() * KNOWLEDGE_FACTS.length),
  );
  const fact = KNOWLEDGE_FACTS[factIndex];

  const greetingKey = useMemo(() => getTimeBasedGreeting(), []);

  const countdownCircleName = useMemo(() => {
    if (!currentPrayer) return "";
    return isBetweenPrayers
      ? nextPrayer?.name
        ? t(nextPrayer.name)
        : ""
      : t(currentPrayer.name);
  }, [currentPrayer, nextPrayer, isBetweenPrayers, t]);

  return (
    <div
      className={`mx-auto w-full max-w-4xl space-y-4 px-4 pb-8 pt-4 transition-all duration-700 md:px-6 md:pt-6 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {/* Top: Greeting + Prayer Info + Countdown */}
      {nextPrayer && currentPrayer && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1035] via-[#1e1540] to-[#161030] shadow-xl shadow-black/20 ring-1 ring-white/[0.06]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary/5 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-secondary/5 blur-[50px]" />
          <div className="grid grid-cols-2 gap-4 p-6">
            {/* Left: Greeting, Prayer Info, Sahri/Iftar, Date */}
            <div className="flex flex-col justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-secondary/85 tracking-wider">
                  {t(greetingKey)}
                </p>
                <div className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary/80">
                      {isBetweenPrayers
                        ? `${t("home.nextPrayer")}:`
                        : `${t("home.now")}:`}
                    </span>
                    <span className="text-xl font-bold text-white">
                      {isBetweenPrayers
                        ? t(nextPrayer.name)
                        : t(currentPrayer.name)}
                    </span>
                  </div>
                  {isBetweenPrayers ? (
                    <p className="mt-1 text-sm text-white/60">
                      {t("home.startsAt")} {formatTime(nextPrayer.time)}
                    </p>
                  ) : windowEndTime ? (
                    <p className="mt-1 text-sm text-white/60">
                      {formatTime(currentPrayer.time)} —{" "}
                      {formatTime(windowEndTime)}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary/80">
                    {t("home.sehriEnds")}
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-white">
                    {fajrTime ? formatTime(fajrTime.time) : "—"}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary/80">
                    {t("home.iftar")}
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-white">
                    {maghribTime ? formatTime(maghribTime.time) : "—"}
                  </p>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-white/50">{gregDate}</p>
                <p className="text-xs text-secondary/80">{hijriDate}</p>
                {isRamadanNow && (
                  <span className="mt-1.5 inline-block rounded-full bg-gradient-to-r from-secondary/20 to-secondary/20 px-2.5 py-0.5 text-[10px] font-semibold text-secondary ring-1 ring-secondary/20">
                    {t("home.ramadan")}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Countdown */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary/85 mb-2">
                {isBetweenPrayers
                  ? t("home.timeUntilNext")
                  : t("home.timeLeft")}
              </p>
              <div className="animate-fade-in">
                <PrayerCircle
                  name={countdownCircleName}
                  countdown={countdownValue}
                  percentage={countdownPercentage}
                />
              </div>
              <p className="mt-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40">
                {t("home.remaining")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Prayer Times */}
      {filteredPrayers.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1035] via-[#1c1238] to-[#181035] shadow-xl shadow-black/20 ring-1 ring-white/[0.06]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-secondary/8 blur-[50px]" />
          <div className="px-4 py-4">
            <div className="grid grid-cols-5 gap-1">
              {filteredPrayers.map((p) => {
                const isCurrent = p.key === currentPrayer?.key;
                const isPast = p.time < now && !isCurrent;
                return (
                  <div
                    key={p.key}
                    className={`relative flex flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-3 transition-all ${
                      isCurrent
                        ? ""
                        : isPast
                          ? "opacity-40"
                          : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-[1px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
                    )}
                    <PrayerIcon
                      prayerKey={p.key}
                      className={`transition-all ${isCurrent ? "h-5 w-5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]" : "h-5 w-5"}`}
                    />
                    <span
                      className={`text-center text-[10px] font-semibold leading-tight ${
                        isCurrent ? "text-white" : "text-white/70"
                      }`}
                    >
                      {t(p.name)}
                    </span>
                    <span
                      className={`text-center text-[10px] tabular-nums leading-tight ${
                        isCurrent
                          ? "text-white/80 font-semibold"
                          : "text-white/40"
                      }`}
                    >
                      {formatTime(p.time)}
                    </span>
                    {isCurrent && (
                      <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/60">
                        Now
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Prayer Tracker */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1035] via-[#1c1238] to-[#181035] shadow-xl shadow-black/20 ring-1 ring-white/[0.06]">
        <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-secondary/8 blur-[50px]" />
        <div className="px-4 py-3.5">
          <PrayerGrid title={t("home.prayerTracker")} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1035] via-[#1c1238] to-[#181035] shadow-xl shadow-black/20 ring-1 ring-white/[0.06]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-secondary/8 blur-[50px]" />
        <div className="px-4 py-4">
          <div className="mb-3">
            <h2 className="text-[11px] font-semibold tracking-[0.15em] text-white/50 uppercase">
              {t("home.quickActions")}
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {GRID_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex flex-col items-center gap-1.5 rounded-2xl bg-white/[0.05] px-2 py-3 text-center transition-all duration-300 ring-1 ring-white/[0.06] hover:bg-white/[0.08] hover:ring-white/[0.1] hover:shadow-lg hover:shadow-black/10 active:scale-[0.96]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/[0.08] transition-all duration-300 group-hover:scale-110 group-hover:bg-secondary/15 group-hover:ring-secondary/30">
                  <item.icon className="text-sm text-white/55 transition-colors duration-300 group-hover:text-secondary" />
                </div>
                <span className="text-[10px] font-medium leading-tight text-white/65 transition-colors duration-300 group-hover:text-white/90">
                  {t(item.label)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Reading Streak */}
      <ReadingStreakWidget />

      {/* Did You Know? */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1035] via-[#1c1238] to-[#181035] px-6 py-4 shadow-xl shadow-black/20 ring-1 ring-white/[0.06]">
        <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-secondary/8 blur-[50px]" />
        <div className="flex items-center gap-2">
          <IoBulbOutline className="text-sm text-secondary/60" />
          <span className="text-[11px] font-semibold tracking-[0.15em] text-white/50 uppercase">
            {t("home.didYouKnow")}
          </span>
        </div>
        <p className="relative pl-4 text-sm leading-relaxed text-white/65">
          {fact.fact}
        </p>
      </div>

      {/* Daily Reflection */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1035] via-[#1c1238] to-[#181035] shadow-xl shadow-black/20 ring-1 ring-white/[0.06]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-secondary/8 blur-[50px]" />
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.15em] text-white/50 uppercase">
              {t("home.dailyReflection")}
            </span>
          </div>
          {contentLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
            </div>
          ) : items.length > 0 ? (
            <div>
              <Carousel className="-mx-1 px-1" setApi={setCarouselApi}>
                <CarouselContent>
                  {items.map((item) => (
                    <CarouselItem key={item.type}>
                      <div>
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {item.type === "verse"
                            ? t("home.verse")
                            : item.type === "hadith"
                              ? t("home.hadith")
                              : t("home.dua")}
                        </span>
                        {item.type === "verse" && (
                          <div className="mt-3">
                            <p className="font-arabic text-right text-2xl leading-loose text-white/90">
                              {item.verse.text.arText}
                            </p>
                            <div className="mt-2 h-px bg-gradient-to-r from-transparent via-secondary/15 to-transparent" />
                            <p className="mt-3 text-sm leading-relaxed text-white/60">
                              {translationLang === "bn"
                                ? item.verse.text.bnText
                                : item.verse.text.enText}
                            </p>
                            <p className="mt-2 text-xs text-white/40">
                              {item.surahName} · {t("home.verse")}{" "}
                              {item.verseNumber}
                            </p>
                          </div>
                        )}
                        {item.type === "hadith" && (
                          <div className="mt-3">
                            <p className="text-sm leading-relaxed text-white/70">
                              {item.text}
                            </p>
                            <p className="mt-2 text-xs text-white/40">
                              {item.source}
                            </p>
                          </div>
                        )}
                        {item.type === "dua" && (
                          <div className="mt-3">
                            <p className="font-arabic text-right text-2xl leading-loose text-white/90">
                              {item.arabic}
                            </p>
                            <div className="mt-2 h-px bg-gradient-to-r from-transparent via-secondary/15 to-transparent" />
                            <p className="mt-3 text-sm leading-relaxed text-white/60">
                              {item.translation}
                            </p>
                            <p className="mt-2 text-xs text-white/40">
                              {item.reference}
                            </p>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  className="hidden sm:inline-flex"
                  variant="secondary-ghost"
                  size="icon-sm"
                />
                <CarouselNext
                  className="hidden sm:inline-flex"
                  variant="secondary-ghost"
                  size="icon-sm"
                />
              </Carousel>
              <div className="mt-4 flex items-center justify-center gap-1.5">
                {items.map((item, index) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? "w-6 bg-secondary"
                        : "w-1.5 bg-white/20 hover:bg-white/30"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="py-4 text-sm text-white/30">{t("home.noContent")}</p>
          )}
        </div>
      </div>

      {/* Start Reading CTA */}
      <Link
        to="/surah"
        className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-secondary/20 via-secondary/15 to-secondary/20 px-6 py-4 text-sm font-semibold text-secondary shadow-lg shadow-black/20 ring-1 ring-secondary/20 transition-all duration-300 hover:from-secondary/25 hover:via-secondary/20 hover:to-secondary/25 hover:shadow-xl hover:shadow-secondary/5 active:scale-[0.98]"
      >
        <span className="relative z-10">{t("home.startReading")}</span>
        <BiChevronRight className="relative z-10 text-lg transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

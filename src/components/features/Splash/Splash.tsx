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
import { IoBulbOutline, IoReload } from "react-icons/io5";
import {
  MdAccessTime,
  MdChecklist,
  MdExplore,
  MdLoop,
  MdMenuBook,
  MdTrackChanges,
} from "react-icons/md";
import { Link } from "react-router-dom";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { parseHijriParts } from "@/data/islamicEvents";
import { useRandomContent } from "@/hooks/useRandomContent";
import { useLocale } from "@/i18n";
import {
  buildPrayerEntries,
  computePrayerTimes,
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

  if (goals.length === 0) return null;

  return (
    <Link
      to="/reading-goals"
      className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-3 ring-1 ring-amber-200/50 transition-all hover:shadow-sm dark:ring-amber-700/30"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{streak > 0 ? "🔥" : "📖"}</span>
        <div>
          <p className="text-xs font-semibold text-text-primary dark:text-dark-text-primary">
            {streak > 0
              ? t("home.streakDays", { streak })
              : t("home.readingGoals")}
          </p>
          <p className="text-[10px] text-text-muted">
            {todayCount > 0
              ? t("home.surahsReadToday", { count: todayCount })
              : t("home.noReadingToday")}
          </p>
        </div>
      </div>
      <span className="text-xs font-medium text-primary dark:text-secondary-light">
        {t("home.goalCount", { count: goals.length })} →
      </span>
    </Link>
  );
}

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

const KNOWLEDGE_FACTS = [
  { fact: "The Quran has 114 surahs and 6,236 verses.", category: "Quran" },
  {
    fact: "Surah Al-Baqarah is the longest surah in the Quran.",
    category: "Quran",
  },
  {
    fact: "Surah Al-Kawthar is the shortest surah in the Quran.",
    category: "Quran",
  },
  { fact: "The word 'Quran' means 'recitation' in Arabic.", category: "Quran" },
  {
    fact: "Laylatul Qadr is better than a thousand months.",
    category: "Worship",
  },
  { fact: "There are 99 names of Allah (Asma ul-Husna).", category: "Faith" },
  {
    fact: "The first revelation came in the cave of Hira.",
    category: "History",
  },
  { fact: "Ramadan is the month the Quran was revealed.", category: "Worship" },
  {
    fact: "Salah was made obligatory during the Mi'raj (ascension).",
    category: "Worship",
  },
  { fact: "Zakah is one of the five pillars of Islam.", category: "Faith" },
  {
    fact: "The Kaaba in Mecca is the qibla for all Muslims.",
    category: "Faith",
  },
  { fact: "There are 30 juz (paras) in the Quran.", category: "Quran" },
];

function getHijriDate(date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(date);
  } catch {
    return "";
  }
}

function getGregorianDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const { t, locale } = useLocale();
  const { lat, lng } = useLocationStore();
  const { prayerCalcMethod, prayerAsrMethod } = useSettings();
  const { items, loading: contentLoading, refresh } = useRandomContent();
  const translationLang = useSettings((s) => s.translationLang);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>(undefined);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    document.title = t("nav.brandTitle");
  }, [t]);

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

  const prayers = useMemo(() => {
    const times = computePrayerTimes(
      lat != null && lng != null ? { lat, lng } : null,
      prayerCalcMethod,
      prayerAsrMethod,
      now,
    );
    return buildPrayerEntries(times);
  }, [lat, lng, prayerCalcMethod, prayerAsrMethod, now]);

  const nextPrayer = useMemo(
    () => findNextPrayer(prayers, now),
    [prayers, now],
  );
  const nextCountdown = useMemo(
    () => (nextPrayer ? getCountdown(now, nextPrayer.time) : ""),
    [nextPrayer, now],
  );

  const sehriEnd = prayers.find((p) => p.key === "fajr");
  const iftar = prayers.find((p) => p.key === "maghrib");

  const hijriParts = useMemo(() => parseHijriParts(now), [now]);
  const isRamadan = hijriParts.month === 9;
  const hijriDate = useMemo(() => getHijriDate(now), [now]);
  const gregDate = useMemo(() => getGregorianDate(now, locale), [now, locale]);

  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * KNOWLEDGE_FACTS.length),
  );
  const fact = KNOWLEDGE_FACTS[factIndex];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6 md:px-6 md:py-10">
      {/* Date card */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
            {gregDate}
          </p>
          {isRamadan && (
            <span className="rounded-full bg-secondary/10 px-3 py-0.5 text-xs font-semibold text-secondary">
              {t("home.ramadan")}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-lg font-semibold text-primary dark:text-secondary-light">
          {hijriDate}
        </p>
      </div>

      {/* Prayer times */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        {nextPrayer && (
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                {t("home.nextPrayer")}
              </p>
              <p className="text-lg font-semibold text-text dark:text-dark-text">
                {nextPrayer.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                {t("home.remaining")}
              </p>
              <p className="text-lg font-semibold text-primary dark:text-secondary-light">
                {nextCountdown}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {prayers
            .filter((p) => p.key !== "sunrise")
            .map((p) => {
              const isNext = p.key === nextPrayer?.key;
              const isPast = p.time < now;
              return (
                <div
                  key={p.key}
                  className={`flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs transition-colors ${
                    isNext
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary-light"
                      : isPast
                        ? "text-text-muted/60 dark:text-dark-text-muted/60"
                        : "text-text-secondary dark:text-dark-text-secondary"
                  }`}
                >
                  <span className="text-sm">{p.icon}</span>
                  <span className="font-medium">{p.name}</span>
                  <span className="tabular-nums">{formatTime(p.time)}</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Sehri / Iftar (Ramadan months only) */}
      {isRamadan && sehriEnd && iftar && (
        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                {t("home.sehriEnds")}
              </p>
              <p className="text-base font-semibold text-text dark:text-dark-text">
                {formatTime(sehriEnd.time)}
              </p>
            </div>
            <div className="h-8 w-px bg-border dark:bg-dark-border" />
            <div>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                {t("home.iftar")}
              </p>
              <p className="text-base font-semibold text-text dark:text-dark-text">
                {formatTime(iftar.time)}
              </p>
            </div>
            <div className="ml-auto">
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                {now < sehriEnd.time
                  ? t("home.sehriRemaining")
                  : now < iftar.time
                    ? t("home.iftarIn")
                    : t("home.fastingCompleted")}
              </p>
              <p className="text-base font-semibold text-primary dark:text-secondary-light">
                {now < sehriEnd.time
                  ? getCountdown(now, sehriEnd.time)
                  : now < iftar.time
                    ? getCountdown(now, iftar.time)
                    : "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick action grid */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-dark-text-muted">
          {t("home.quickActions")}
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {GRID_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="card-hover flex flex-col items-center gap-1.5 rounded-xl bg-surface px-2 py-3 text-center shadow-sm ring-1 ring-border transition-all duration-200 hover:shadow-md active:scale-[0.97] dark:bg-dark-surface dark:ring-dark-border"
            >
              <item.icon className="text-xl text-primary dark:text-secondary-light" />
              <span className="text-[11px] leading-tight text-text-secondary dark:text-dark-text-secondary">
                {t(item.label)}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Reading streak widget */}
      <ReadingStreakWidget />

      {/* Did you know? */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IoBulbOutline className="text-lg text-primary dark:text-secondary-light" />
            <span className="text-xs font-semibold text-text-muted dark:text-dark-text-muted">
              {t("home.didYouKnow")}
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setFactIndex((prev) => (prev + 1) % KNOWLEDGE_FACTS.length)
            }
            className="flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80 dark:text-secondary-light"
          >
            <IoReload />
            {t("home.next")}
          </button>
        </div>
        <p className="text-sm leading-relaxed text-text dark:text-dark-text">
          {fact.fact}
        </p>
        <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
          {fact.category}
        </p>
      </div>

      {/* Random content */}
      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-muted dark:text-dark-text-muted">
            {t("home.dailyReflection")}
          </span>
          <button
            type="button"
            onClick={refresh}
            className="flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80 dark:text-secondary-light"
          >
            <IoReload />
            {t("home.refresh")}
          </button>
        </div>
        {contentLoading ? (
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            {t("common.loading")}
          </p>
        ) : items.length > 0 ? (
          <div>
            <Carousel className="-mx-1 px-1" setApi={setCarouselApi}>
              <CarouselContent>
                {items.map((item) => (
                  <CarouselItem key={item.type}>
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary dark:bg-secondary/15 dark:text-secondary-light">
                          {item.type === "verse"
                            ? t("home.verse")
                            : item.type === "hadith"
                              ? t("home.hadith")
                              : t("home.dua")}
                        </span>
                      </div>
                      {item.type === "verse" && (
                        <>
                          <p className="font-arabic text-right text-xl leading-loose text-text dark:text-dark-text">
                            {item.verse.text.arText}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                            {translationLang === "bn"
                              ? item.verse.text.bnText
                              : item.verse.text.enText}
                          </p>
                          <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
                            {item.surahName}
                          </p>
                        </>
                      )}
                      {item.type === "hadith" && (
                        <>
                          <p className="text-sm leading-relaxed text-text dark:text-dark-text">
                            {item.text}
                          </p>
                          <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
                            {item.source}
                          </p>
                        </>
                      )}
                      {item.type === "dua" && (
                        <>
                          <p className="font-arabic text-right text-xl leading-loose text-text dark:text-dark-text">
                            {item.arabic}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                            {item.translation}
                          </p>
                          <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
                            {item.reference}
                          </p>
                        </>
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
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {items.map((item, index) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-5 bg-primary dark:bg-secondary-light"
                      : "w-1.5 bg-border dark:bg-dark-border"
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            {t("home.noContent")}
          </p>
        )}
      </div>

      {/* Start Reading CTA */}
      <Link
        to="/surah"
        className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
      >
        {t("home.startReading")}
        <BiChevronRight className="text-lg" />
      </Link>
    </div>
  );
}

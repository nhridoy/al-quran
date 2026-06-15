import type { ComponentType } from "react";
import {
  AiOutlineCloudDownload,
  AiOutlineGift,
  AiOutlineHeart,
} from "react-icons/ai";
import { BiBook, BiBookmark } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import {
  FaBookOpen,
  FaCalculator,
  FaCheckCircle,
  FaHandHoldingHeart,
  FaMoon,
  FaPersonBooth,
  FaStar,
} from "react-icons/fa";
import {
  IoBulbOutline,
  IoDownloadOutline,
  IoHomeOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoTrendingUp,
} from "react-icons/io5";
import {
  MdAccessTime,
  MdCalendarMonth,
  MdChecklist,
  MdExplore,
  MdLoop,
  MdMenuBook,
} from "react-icons/md";

export interface NavItem {
  to: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const sidebarSections: NavSection[] = [
  {
    label: "nav.sectionQuran",
    items: [
      { to: "/", icon: IoHomeOutline, label: "nav.home" },
      { to: "/surah", icon: FaBookOpen, label: "nav.surahs" },
      { to: "/para", icon: MdMenuBook, label: "nav.paras" },
      { to: "/last-ten-surahs", icon: FaBookOpen, label: "nav.lastTenSurahs" },
      { to: "/bookmarks", icon: BiBookmark, label: "nav.bookmarks" },
      {
        to: "/reading-goals",
        icon: IoTrendingUp,
        label: "nav.readingProgress",
      },
    ],
  },
  {
    label: "nav.sectionWorship",
    items: [
      { to: "/daily-log", icon: MdChecklist, label: "nav.dailyLog" },
      {
        to: "/prayer-tracker",
        icon: FaCheckCircle,
        label: "nav.prayerTracker",
      },
      { to: "/fasting-calendar", icon: FaMoon, label: "nav.fastingCalendar" },
      { to: "/taraweeh-tracker", icon: FaMoon, label: "nav.taraweehTracker" },
      {
        to: "/sadaqah-tracker",
        icon: FaHandHoldingHeart,
        label: "nav.sadaqahTracker",
      },
      { to: "/tasbih", icon: MdLoop, label: "nav.tasbih" },
    ],
  },
  {
    label: "nav.sectionTools",
    items: [
      { to: "/prayer-times", icon: MdAccessTime, label: "nav.prayerTimes" },
      { to: "/qibla", icon: MdExplore, label: "nav.qibla" },
      {
        to: "/zakat-calculator",
        icon: FaCalculator,
        label: "nav.zakatCalculator",
      },
      {
        to: "/hijri-calendar",
        icon: MdCalendarMonth,
        label: "nav.hijriCalendar",
      },
      { to: "/asma-ul-husna", icon: FaStar, label: "nav.asmaUlHusna" },
      { to: "/duas", icon: MdMenuBook, label: "nav.duas" },
      { to: "/hadith", icon: BiBook, label: "nav.hadith" },
    ],
  },
  {
    label: "nav.sectionLearn",
    items: [
      { to: "/salah-guide", icon: FaPersonBooth, label: "nav.salahGuide" },
      { to: "/knowledge", icon: IoBulbOutline, label: "nav.knowledge" },
      {
        to: "/islamic-names",
        icon: IoPersonOutline,
        label: "nav.islamicNames",
      },
    ],
  },
  {
    label: "nav.sectionMore",
    items: [
      {
        to: "/downloads",
        icon: AiOutlineCloudDownload,
        label: "nav.downloads",
      },
      { to: "/data-export", icon: IoDownloadOutline, label: "nav.dataExport" },
      { to: "/settings", icon: IoSettingsOutline, label: "nav.settings" },
      { to: "/about", icon: BsInfoCircle, label: "nav.about" },
      { to: "/credits", icon: AiOutlineHeart, label: "nav.credits" },
      { to: "/donation", icon: AiOutlineGift, label: "nav.donation" },
    ],
  },
];

export const bottomNavPrimary: NavItem[] = [
  { to: "/", icon: IoHomeOutline, label: "nav.home" },
  { to: "/surah", icon: FaBookOpen, label: "nav.surah" },
  { to: "/para", icon: MdMenuBook, label: "nav.para" },
  { to: "/prayer-times", icon: MdAccessTime, label: "nav.prayer" },
  { to: "/daily-log", icon: MdChecklist, label: "nav.log" },
];

export const bottomNavOverflow: NavItem[] = [
  { to: "/bookmarks", icon: BiBookmark, label: "nav.bookmarks" },
  { to: "/last-ten-surahs", icon: FaBookOpen, label: "nav.lastTen" },
  { to: "/reading-goals", icon: IoTrendingUp, label: "nav.progress" },
  { to: "/prayer-tracker", icon: FaCheckCircle, label: "nav.prayerTracker" },
  { to: "/fasting-calendar", icon: FaMoon, label: "nav.fasting" },
  { to: "/taraweeh-tracker", icon: FaMoon, label: "nav.taraweeh" },
  { to: "/sadaqah-tracker", icon: FaHandHoldingHeart, label: "nav.sadaqah" },
  { to: "/tasbih", icon: MdLoop, label: "nav.tasbih" },
  { to: "/qibla", icon: MdExplore, label: "nav.qibla" },
  { to: "/zakat-calculator", icon: FaCalculator, label: "nav.zakat" },
  { to: "/hijri-calendar", icon: MdCalendarMonth, label: "nav.hijri" },
  { to: "/asma-ul-husna", icon: FaStar, label: "nav.asma" },
  { to: "/duas", icon: MdMenuBook, label: "nav.duas" },
  { to: "/hadith", icon: BiBook, label: "nav.hadith" },
  { to: "/salah-guide", icon: FaPersonBooth, label: "nav.salahGuide" },
  { to: "/knowledge", icon: IoBulbOutline, label: "nav.knowledge" },
  { to: "/islamic-names", icon: IoPersonOutline, label: "nav.names" },
  { to: "/downloads", icon: AiOutlineCloudDownload, label: "nav.downloads" },
  { to: "/settings", icon: IoSettingsOutline, label: "nav.settings" },
  { to: "/about", icon: BsInfoCircle, label: "nav.about" },
  { to: "/credits", icon: AiOutlineHeart, label: "nav.credits" },
  { to: "/donation", icon: AiOutlineGift, label: "nav.donate" },
];

export function isActiveMatch(pathname: string, to: string): boolean {
  if (pathname === to) return true;
  if (to === "/surah" && pathname.startsWith("/surah")) return true;
  if (to === "/para" && pathname.startsWith("/para")) return true;
  return false;
}

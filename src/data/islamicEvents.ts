export interface IslamicEvent {
  month: number;
  day: number;
  name: string;
  nameBn: string;
  type: "festival" | "observance" | "historical";
}

export const ISLAMIC_MONTHS = [
  { en: "Muharram", bn: "মুহররম", ar: "محرم" },
  { en: "Safar", bn: "সফর", ar: "صفر" },
  { en: "Rabi al-Awwal", bn: "রবিউল আউয়াল", ar: "ربيع الأول" },
  { en: "Rabi al-Thani", bn: "রবিউস সানি", ar: "ربيع الثاني" },
  { en: "Jumada al-Awwal", bn: "জমাদিউল আউয়াল", ar: "جمادى الأولى" },
  { en: "Jumada al-Thani", bn: "জমাদিউস সানি", ar: "جمادى الآخرة" },
  { en: "Rajab", bn: "রজব", ar: "رجب" },
  { en: "Shaban", bn: "শাবান", ar: "شعبان" },
  { en: "Ramadan", bn: "রমজান", ar: "رمضان" },
  { en: "Shawwal", bn: "শাওয়াল", ar: "شوال" },
  { en: "Dhul Qadah", bn: "জিলকদ", ar: "ذو القعدة" },
  { en: "Dhul Hijjah", bn: "জিলহজ", ar: "ذو الحجة" },
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    month: 1,
    day: 1,
    name: "Islamic New Year",
    nameBn: "ইসলামি নববর্ষ",
    type: "observance",
  },
  {
    month: 1,
    day: 10,
    name: "Day of Ashura",
    nameBn: "আশুরার দিন",
    type: "observance",
  },
  {
    month: 3,
    day: 12,
    name: "Mawlid (Birth of Prophet)",
    nameBn: "ঈদে মিলাদুন্নবী",
    type: "festival",
  },
  {
    month: 7,
    day: 27,
    name: "Isra & Mi'raj",
    nameBn: "লাইলাতুল মেরাজ",
    type: "observance",
  },
  {
    month: 8,
    day: 15,
    name: "Shab-e-Barat",
    nameBn: "লাইলাতুল বরাত",
    type: "observance",
  },
  {
    month: 9,
    day: 1,
    name: "Ramadan begins",
    nameBn: "রমজান শুরু",
    type: "festival",
  },
  {
    month: 9,
    day: 27,
    name: "Laylat al-Qadr",
    nameBn: "লাইলাতুল কদর",
    type: "observance",
  },
  {
    month: 10,
    day: 1,
    name: "Eid al-Fitr",
    nameBn: "ঈদুল ফিতর",
    type: "festival",
  },
  {
    month: 12,
    day: 9,
    name: "Day of Arafah",
    nameBn: "আরাফার দিন",
    type: "observance",
  },
  {
    month: 12,
    day: 10,
    name: "Eid al-Adha",
    nameBn: "ঈদুল আজহা",
    type: "festival",
  },
];

export function getIslamicMonthName(month: number): string {
  return ISLAMIC_MONTHS[month - 1]?.en ?? "";
}

export function getIslamicEvent(
  month: number,
  day: number,
): IslamicEvent | undefined {
  return ISLAMIC_EVENTS.find((e) => e.month === month && e.day === day);
}

export function getMonthEvents(month: number): IslamicEvent[] {
  return ISLAMIC_EVENTS.filter((e) => e.month === month);
}

export function getUpcomingEvents(
  hijriMonth: number,
  hijriDay: number,
  count = 5,
): (IslamicEvent & { daysUntil: number })[] {
  const results: (IslamicEvent & { daysUntil: number })[] = [];
  for (let offset = 0; offset < 366; offset++) {
    let m = hijriMonth;
    let d = hijriDay + offset;
    while (d > 30) {
      d -= 30;
      m++;
    }
    if (m > 12) m -= 12;
    for (const event of ISLAMIC_EVENTS) {
      if (event.month === m && event.day === d) {
        results.push({ ...event, daysUntil: offset });
      }
    }
    if (results.length >= count) break;
  }
  return results;
}

export function parseHijriParts(date: Date): {
  year: number;
  month: number;
  day: number;
} {
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);
  return { year: get("year"), month: get("month"), day: get("day") };
}

export function hijriPartsEqual(
  a: { month: number; day: number },
  b: { month: number; day: number },
): boolean {
  return a.month === b.month && a.day === b.day;
}

export function isSameHijriDate(a: Date, b: Date): boolean {
  const ha = parseHijriParts(a);
  const hb = parseHijriParts(b);
  return ha.year === hb.year && ha.month === hb.month && ha.day === hb.day;
}

export function findGregorianForHijri(
  year: number,
  month: number,
  day: number,
): Date {
  const daysSinceEpoch =
    (year - 1) * 354.367 + (month - 1) * 29.530589 + (day - 1);
  const epoch = new Date(622, 6, 19);
  const guess = new Date(epoch.getTime() + daysSinceEpoch * 86400000);
  guess.setDate(guess.getDate() - 365);
  for (let i = 0; i < 730; i++) {
    const h = parseHijriParts(guess);
    if (h.year === year && h.month === month && h.day === day) return guess;
    guess.setDate(guess.getDate() + 1);
  }
  return guess;
}

export function buildHijriMonthGrid(
  hijriYear: number,
  hijriMonth: number,
): Date[] {
  const firstGuess = findGregorianForHijri(hijriYear, hijriMonth, 1);
  const hFirst = parseHijriParts(firstGuess);
  const startDate = new Date(firstGuess);
  startDate.setDate(firstGuess.getDate() - (hFirst.day - 1));

  const days: Date[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const h = parseHijriParts(d);
    if (h.month === hijriMonth) {
      days.push(d);
    }
  }
  return days;
}

export function buildGregorianMonthGrid(year: number, month: number): Date[] {
  const days: Date[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= lastDay; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export const GREGORIAN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export interface DatedEvent extends IslamicEvent {
  gregorianDate: Date;
  hijriYear: number;
  daysUntil: number;
}

export function getEventGregorianDate(
  event: IslamicEvent,
  hijriYear: number,
): Date {
  return findGregorianForHijri(hijriYear, event.month, event.day);
}

export function getUpcomingDatedEvents(
  todayHijri: { year: number; month: number; day: number },
  count = 6,
): DatedEvent[] {
  const results: DatedEvent[] = [];
  for (const event of ISLAMIC_EVENTS) {
    const yearForEvent =
      event.month > todayHijri.month ||
      (event.month === todayHijri.month && event.day >= todayHijri.day)
        ? todayHijri.year
        : todayHijri.year + 1;
    const gregDate = getEventGregorianDate(event, yearForEvent);
    const eventHijri =
      yearForEvent === todayHijri.year
        ? { year: todayHijri.year, month: event.month, day: event.day }
        : { year: todayHijri.year + 1, month: event.month, day: event.day };
    const eventDate = new Date(gregDate);
    eventDate.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = Math.round((eventDate.getTime() - now.getTime()) / 86400000);
    if (diff >= 0) {
      results.push({
        ...event,
        gregorianDate: eventDate,
        hijriYear: eventHijri.year,
        daysUntil: diff,
      });
    }
  }
  results.sort((a, b) => a.daysUntil - b.daysUntil);
  return results.slice(0, count);
}

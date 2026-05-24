# Al Quran → Islamic App Expansion Roadmap

**Live tracker — keep the `[status]` badges updated as work progresses.**

---

## Status Key

| Badge | Meaning |
|---|---|
| `[📋]` | Planned (not started) |
| `[🚧]` | In progress |
| `[✅]` | Completed |
| `[❌]` | Cancelled / blocked |

---

## Global Status Dashboard

| Area | Phase 0 | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|---|
| Overall | [📋] | [📋] | [📋] | [📋] |

---

# Phase 0 — Foundation

> Core infra that all features depend on. Do this first.

---

## 0.1 Multi-store IndexedDB

[status: 📋] [priority: HIGH]

**What**: Rewrite `src/lib/db.ts` to support multiple named stores instead of a single hardcoded one.

**Why**: Bookmarks, settings, duas, and prayer config each need their own store. The current code can only store surahs.

### Files

| File | Action |
|---|---|
| `src/lib/db.ts` | Rewrite — generic multi-store helper |

### Implementation

```typescript
// src/lib/db.ts
import { type IDBPDatabase, openDB } from "idb";

const DB_NAME = "al-quran";
const DB_VERSION = 4;

const STORE_NAMES = [
  "surahs",
  "bookmarks",
  "settings",
  "duas",
  "prayerSettings",
] as const;

export type StoreName = (typeof STORE_NAMES)[number];

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        for (const store of STORE_NAMES) {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store);
          }
        }
      },
    }).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

export async function getFromStore<T>(
  storeName: StoreName,
  key: string,
): Promise<T | undefined> {
  const db = await getDb();
  return db.get(storeName, key) as Promise<T | undefined>;
}

export async function putInStore<T>(
  storeName: StoreName,
  key: string,
  value: T,
): Promise<void> {
  const db = await getDb();
  await db.put(storeName, value, key);
}

export async function deleteFromStore(
  storeName: StoreName,
  key: string,
): Promise<void> {
  const db = await getDb();
  await db.delete(storeName, key);
}

export async function getAllFromStore<T>(
  storeName: StoreName,
): Promise<T[]> {
  const db = await getDb();
  const result = await db.getAll(storeName);
  return result as T[];
}

export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await getDb();
  await db.clear(storeName);
}

// ── Existing surah-specific helpers (updated to use generic) ──

const API_URL =
  "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v2/singleSurah.min.json";

async function fetchAllSurahsFromApi(): Promise<Record<string, SurahData>> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch surah data");
  const data = await res.json();
  return data.singleSurah as Record<string, SurahData>;
}

export async function getSurahs(): Promise<Record<string, SurahData>> {
  const cached = await getFromStore<Record<string, SurahData>>("surahs", "allSurahs");
  if (cached) return cached;
  const fresh = await fetchAllSurahsFromApi();
  await putInStore("surahs", "allSurahs", fresh);
  return fresh;
}

export async function getSurah(id: string): Promise<SurahData | undefined> {
  const all = await getSurahs();
  return all[id];
}

export async function clearCache(): Promise<void> {
  await deleteFromStore("surahs", "allSurahs");
}

export async function refreshData(): Promise<Record<string, SurahData>> {
  await deleteFromStore("surahs", "allSurahs");
  const fresh = await fetchAllSurahsFromApi();
  await putInStore("surahs", "allSurahs", fresh);
  return fresh;
}
```

### Verify

- `pnpm typecheck` passes
- App loads surahs correctly from IndexedDB (check network tab — only 1 fetch)
- Splash page transitions to `/surah` after loading

### AI Instructions

When implementing:
1. Read the current `src/lib/db.ts` fully first
2. Replace entire file with the version above
3. Update `DB_VERSION` from `3` to `4`
4. Run `pnpm typecheck` to confirm no type errors
5. Test by reloading the app — surah data should still load from fresh API call (cache was in old DB version 3, upgrade triggers fresh fetch)

---

## 0.2 Centralized App Settings

[status: 📋] [priority: HIGH]

**What**: Create a settings service + zustand store for all user preferences.

**Why**: Multiple features (theme, font size, qari, prayer calc method) need shared state. Currently scattered in localStorage and component state.

### Files

| File | Action |
|---|---|
| `src/store/settings.ts` | Create — zustand store for app settings |
| `src/lib/settings.ts` | Create — default values + persistence helpers |
| `src/types/index.ts` | Add `AppSettings` interface |

### Dependencies

- `zustand` (add to package.json)

### Implementation

```typescript
// src/types/index.ts — add
export interface AppSettings {
  theme: "system" | "light" | "dark";
  arabicFontSize: number;       // 1.0 – 2.0, step 0.25
  translationFontSize: number;  // 0.75 – 1.5, step 0.125
  translationLang: "en" | "bn";
  qariId: string;
  prayerCalcMethod: string;
  prayerAsrMethod: "shafii" | "hanafi";
  hijriAdjust: number;
}
```

```typescript
// src/store/settings.ts
import { create } from "zustand";
import { getFromStore, putInStore } from "../lib/db";
import type { AppSettings } from "../types";

const SETTINGS_KEY = "appSettings";

const DEFAULTS: AppSettings = {
  theme: "system",
  arabicFontSize: 1.5,
  translationFontSize: 1,
  translationLang: "en",
  qariId: "alafasy",
  prayerCalcMethod: "MWL",
  prayerAsrMethod: "shafii",
  hijriAdjust: 0,
};

interface SettingsState extends AppSettings {
  loaded: boolean;
  load: () => Promise<void>;
  update: (partial: Partial<AppSettings>) => Promise<void>;
  reset: () => Promise<void>;
}

export const useSettings = create<SettingsState>((set, get) => ({
  ...DEFAULTS,
  loaded: false,

  load: async () => {
    const saved = await getFromStore<AppSettings>("settings", SETTINGS_KEY);
    if (saved) {
      set({ ...saved, loaded: true });
    } else {
      set({ loaded: true });
    }
  },

  update: async (partial) => {
    const current = get();
    const next = { ...current, ...partial };
    // Persist
    await putInStore("settings", SETTINGS_KEY, {
      theme: next.theme,
      arabicFontSize: next.arabicFontSize,
      translationFontSize: next.translationFontSize,
      translationLang: next.translationLang,
      qariId: next.qariId,
      prayerCalcMethod: next.prayerCalcMethod,
      prayerAsrMethod: next.prayerAsrMethod,
      hijriAdjust: next.hijriAdjust,
    } as AppSettings);
    set(partial);
  },

  reset: async () => {
    await putInStore("settings", SETTINGS_KEY, DEFAULTS);
    set({ ...DEFAULTS });
  },
}));
```

### Verify

- `pnpm typecheck` passes
- `useSettings().load()` runs on app mount (add to `App.tsx` inside a `useEffect`)
- Changing settings persists across refresh

### AI Instructions

1. Add `zustand` to `package.json` (`pnpm add zustand`)
2. Create `src/store/` directory
3. Create `src/store/settings.ts` with the code above
4. Add `AppSettings` interface to `src/types/index.ts`
5. In `src/App.tsx`, import `useSettings` and call `.load()` inside `AudioPlayerProvider` or a new initializer

---

## 0.3 Navigation Expansion

[status: 📋] [priority: HIGH]

**What**: Restructure Sidebar and BottomNav to support ~10 nav items organized in sections.

**Why**: Current nav lists all items flat. With new features, this won't scale.

### Files

| File | Action |
|---|---|
| `src/components/Sidebar/Sidebar.tsx` | Rewrite — sectioned nav |
| `src/components/BottomNav/BottomNav.tsx` | Rewrite — scrollable or "More" overflow |

### Implementation

**Sidebar** — grouped sections with headers:

```typescript
const navSections = [
  {
    label: "QURAN",
    items: [
      { to: "/surah", icon: FaBookOpen, label: "Surah" },
      { to: "/para", icon: MdMenuBook, label: "Para" },
      { to: "/last-ten-surahs", icon: FaBookOpen, label: "Last 10 Surahs" },
      { to: "/bookmarks", icon: BiBookmark, label: "Bookmarks" },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { to: "/prayer-times", icon: MdAccessTime, label: "Prayer Times" },
      { to: "/qibla", icon: MdExplore, label: "Qibla Finder" },
      { to: "/asma-ul-husna", icon: FaStar, label: "Asma ul-Husna" },
      { to: "/duas", icon: MdMenuBook, label: "Duas" },
      { to: "/tasbih", icon: MdLoop, label: "Tasbih" },
    ],
  },
  {
    label: "MORE",
    items: [
      { to: "/settings", icon: IoSettingsOutline, label: "Settings" },
      { to: "/about", icon: BsInfoCircle, label: "About" },
      { to: "/credits", icon: AiOutlineHeart, label: "Credits" },
      { to: "/donation", icon: AiOutlineGift, label: "Donation" },
    ],
  },
];
```

**BottomNav** — keep 5 most-used items, add "More" tab → opens drawer with remaining links.

Or: use scrollable bottom nav (horizontal scroll on mobile — less ideal but works).

**Recommended bottom nav tabs**:
```
Surah | Para | Prayer Times | Tasbih | More (≡)
```

### Verify

- All existing routes still work and highlight correctly
- Active indicator works for nested routes (e.g., `/surah/1` highlights "Surah")
- Mobile bottom nav doesn't overflow

### AI Instructions

1. Read current `Sidebar.tsx` and `BottomNav.tsx`
2. Restructure Sidebar.tsx to render from the sections array above
3. For BottomNav: pick 5 primary items, put rest in a "More" slide-up/drawer (reuse existing `Drawer.tsx` component)
4. Import new icons as needed
5. All routes referenced here won't exist yet — that's OK, use `to` string and they'll be inactive until the routes are added

---

# Phase 1 — Quick Wins

> Each item is independently shippable. Minimal external dependencies.

---

## 1.1 Hijri Date Display

[status: 📋] [priority: MEDIUM] [est: 30 min]

**What**: Show today's Hijri date in the sidebar footer area.

**Dependencies**: `0.1`, `0.3` (sidebar already being rewritten)

### Files

| File | Action |
|---|---|
| `src/components/HijriDate/HijriDate.tsx` | Create |
| `src/components/Sidebar/Sidebar.tsx` | Insert component in footer |

### Dependencies

- `pnpm add hijri-js` (or `@-utils/hijri`)

### Implementation

```typescript
// src/components/HijriDate/HijriDate.tsx
import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

// Minimal Hijri date conversion (no library needed for basic)
function toHijri(date: Date): { day: number; month: string; year: number } {
  const greg = new Date(date);
  // Simple approximation — for production use hijri-js library
  const jd = Math.floor(greg.getTime() / 86400000) + 2440588;
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
  const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  const MONTHS = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
  ];

  return { day, month: MONTHS[month - 1] || "", year };
}

export default function HijriDate() {
  const [hijri, setHijri] = useState<{ day: number; month: string; year: number } | null>(null);

  useEffect(() => {
    setHijri(toHijri(new Date()));
  }, []);

  const greg = new Date();
  const gregStr = greg.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  if (!hijri) return null;

  return (
    <div className="rounded-xl bg-linear-to-br from-primary/5 to-secondary/5 p-4 dark:from-primary/10 dark:to-secondary/10">
      <div className="flex items-center gap-2 mb-1">
        <FaCalendarAlt className="text-xs text-secondary" />
        <p className="text-xs font-medium text-text-muted dark:text-dark-text-muted">
          Islamic Date
        </p>
      </div>
      <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
        {hijri.day} {hijri.month} {hijri.year} AH
      </p>
      <p className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">
        {gregStr}
      </p>
    </div>
  );
}
```

**Note**: The above uses a manual calculation formula. In production, install `hijri-js` and use:
```typescript
import { toHijri } from "hijri-js";
const { hy, hm, hd } = toHijri(gregDate);
```

### AI Instructions

1. Create `src/components/HijriDate/HijriDate.tsx`
2. In `Sidebar.tsx`, replace the Quranic verse card in the footer with `<HijriDate />`
3. If using the manual calculation, verify output is correct (compare with known date)
4. The hijri date should update on app mount (no real-time ticking needed)

---

## 1.2 Bookmarks (Wire UI + Data)

[status: 📋] [priority: MEDIUM] [est: 2 hr]

**What**: Activate the bookmark buttons in `Ayahs.tsx`, add a bookmarks page.

**Dependencies**: `0.1` (multi-store DB)

### Files

| File | Action |
|---|---|
| `src/hooks/useBookmarks.ts` | Create |
| `src/components/pages/Ayahs/Ayahs.tsx` | Wire `onClick` on bookmark button |
| `src/components/pages/Bookmarks/Bookmarks.tsx` | Create — list page |
| `src/App.tsx` | Add route `/bookmarks` |

### Implementation

```typescript
// src/hooks/useBookmarks.ts
import { useCallback, useEffect, useState } from "react";
import { getAllFromStore, putInStore, deleteFromStore } from "../lib/db";

export interface Bookmark {
  id: string; // "surahNo-ayahNo"
  surahNo: number;
  ayahNo: number;
  surahName: string;
  enName: string;
  arabicText: string;
  timestamp: number;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const refresh = useCallback(async () => {
    const all = await getAllFromStore<Bookmark>("bookmarks");
    all.sort((a, b) => b.timestamp - a.timestamp);
    setBookmarks(all);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addBookmark = useCallback(async (bookmark: Omit<Bookmark, "timestamp">) => {
    const entry: Bookmark = { ...bookmark, timestamp: Date.now() };
    await putInStore("bookmarks", entry.id, entry);
    await refresh();
  }, [refresh]);

  const removeBookmark = useCallback(async (id: string) => {
    await deleteFromStore("bookmarks", id);
    await refresh();
  }, [refresh]);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks],
  );

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, refresh };
}
```

In `Ayahs.tsx`, the bookmark button currently has no `onClick`. Add:

```typescript
const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();

const ayahId = `${surah?.no || surahNo}-${ayah.numberInSurah}`;
const bookmarked = isBookmarked(ayahId);

<button
  type="button"
  onClick={() => {
    if (bookmarked) {
      removeBookmark(ayahId);
    } else if (surah) {
      addBookmark({
        id: ayahId,
        surahNo: surah.no,
        ayahNo: ayah.numberInSurah,
        surahName: surah.name,
        enName: surah.enName,
        arabicText: ayah.text,
      });
    }
  }}
  className="..."
  aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
  title={bookmarked ? "Remove bookmark" : "Bookmark"}
>
  <BiBookmark className={`text-base ${bookmarked ? "fill-current text-secondary" : ""}`} />
</button>
```

### Bookmarks Page

Simple list showing each bookmarked ayah grouped by surah name. Each item:
- Arabic text (1 line)
- Surah name + ayah number
- Tap → navigate to `/surah/:surahNo`
- Swipe or tap remove → delete from IndexedDB

### AI Instructions

1. Create `src/hooks/useBookmarks.ts`
2. Edit `src/components/pages/Ayahs/Ayahs.tsx` — import hook, wire onClick for bookmark button, add visual filled state
3. Create `src/components/pages/Bookmarks/Bookmarks.tsx`
4. Add route in `src/App.tsx`: `<Route path="/bookmarks" element={lazy(() => import("./components/pages/Bookmarks/Bookmarks"))} />`
5. Run `pnpm typecheck`

---

## 1.3 Share (Wire existing UI)

[status: 📋] [priority: LOW] [est: 15 min]

**What**: Activate share buttons in `Ayahs.tsx` using Web Share API.

### Files

| File | Action |
|---|---|
| `src/components/pages/Ayahs/Ayahs.tsx` | Wire `onClick` |

### Implementation

```typescript
const handleShare = useCallback(async () => {
  const text = `${ayah.text}\n\n${ayah.enText}\n${ayah.enTextTransliteration}\n\n— ${surah?.enName || ""} ${ayah.numberInSurah}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "Al Quran", text });
    } catch { /* user cancelled */ }
  } else {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }
}, [ayah, surah]);
```

### AI Instructions

1. In `Ayahs.tsx`, add `handleShare` callback
2. Wire to the share button's `onClick`
3. Import `toast` from `react-toastify` if not already imported
4. Run `pnpm typecheck`

---

## 1.4 Enhanced Settings

[status: 📋] [priority: MEDIUM] [est: 3 hr]

**What**: Full settings page with theme, font size, translation language, qari selection.

**Dependencies**: `0.2` (zustand settings store)

### Files

| File | Action |
|---|---|
| `src/components/pages/Settings/Settings.tsx` | Rewrite |

### Implementation

Settings sections:

1. **Appearance**
   - Theme: System / Light / Dark (segmented buttons)
   - Arabic font size: slider 1.0 → 2.0
   - Translation font size: slider 0.75 → 1.5

2. **Reading**
   - Translation language: English / Bengali (radio)
   - Qari/Reciter: dropdown list

3. **Prayer** (placeholder for Phase 2)
   - Calculation method: dropdown
   - Asr method: Shafii / Hanafi

4. **Data**
   - Current cache clear + refresh button (keep existing)

**Theme implementation**: Apply `.dark` class on `<html>` based on `useSettings().theme`. Add a `useEffect` in `App.tsx`:

```typescript
useEffect(() => {
  const theme = settings.theme;
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}, [settings.theme]);
```

**Font size implementation**: Set CSS custom properties on `<html>`:

```typescript
useEffect(() => {
  document.documentElement.style.setProperty("--arabic-font-size", `${settings.arabicFontSize}rem`);
  document.documentElement.style.setProperty("--translation-font-size", `${settings.translationFontSize}rem`);
}, [settings.arabicFontSize, settings.translationFontSize]);
```

Then in `index.css`:
```css
.font-arabic { font-size: var(--arabic-font-size, 1.5rem); }
```

### AI Instructions

1. Read current `Settings.tsx` fully
2. Rewrite with themed sections (use cards matching the current design pattern)
3. Import `useSettings` from `src/store/settings.ts`
4. Apply theme toggle + font sizes via `useEffect` (can go in `Settings.tsx` or `App.tsx`)
5. Keep the existing cache-clear section with SweetAlert2
6. Run `pnpm typecheck`

---

## 1.5 Verse Text Search

[status: 📋] [priority: MEDIUM] [est: 3 hr]

**What**: Extend search to search ayah text, not just surah names.

**Dependencies**: `0.1` (data accessible via `getSurahs()`)

### Files

| File | Action |
|---|---|
| `src/components/Search/Search.tsx` | Extend |

### Implementation

Current search only filters surahs by name. Add a toggle/input that searches ayah text:

1. Add a "Search in verses" toggle
2. When active, iterate all cached surahs and search `verse.text`, `verse.enText`, `verse.bnText`
3. Group results by surah, show ayah snippets
4. Tap result → navigate to `/surah/:id`

```typescript
interface SearchResult {
  type: "surah" | "ayah";
  surah: SurahData;
  ayah?: Verse;
}

// Filter logic:
function searchAyahs(query: string, surahs: Record<string, SurahData>): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  for (const [id, surah] of Object.entries(surahs)) {
    for (const verse of surah.verses) {
      if (
        verse.text.toLowerCase().includes(q) ||
        verse.enText.toLowerCase().includes(q) ||
        verse.bnText.toLowerCase().includes(q)
      ) {
        results.push({ type: "ayah", surah, ayah: verse });
      }
    }
  }
  return results.slice(0, 50); // limit results
}
```

**Performance note**: IndexedDB holds all surahs in memory once loaded, so iterating is fast. For very large search, debounce by 300ms.

### AI Instructions

1. Read current `Search.tsx` fully
2. Add a query mode toggle (surah name / verse text) using a segmented button or tab
3. Implement verse search function
4. Display results grouped by surah with ayah number + snippet
5. Run `pnpm typecheck`

---

## 1.6 Asma ul-Husna (99 Names)

[status: 📋] [priority: LOW] [est: 3 hr]

**What**: Grid of 99 Names with Arabic, transliteration, meaning.

### Files

| File | Action |
|---|---|
| `src/data/asmaUlHusna.json` | Create — static data |
| `src/components/pages/AsmaUlHusna/AsmaUlHusna.tsx` | Create |
| `src/App.tsx` | Add route |

### Data (sample structure)

```json
[
  {
    "id": 1,
    "arabic": "الرَّحْمَنُ",
    "transliteration": "Ar-Rahman",
    "meaningEn": "The Most Gracious",
    "meaningBn": "পরম দয়ালু"
  }
]
```

**Source**: Can be generated from known data or fetched from a reliable source.

### Implementation

- Full-screen grid (3 columns on desktop, 2 on mobile)
- Each card: Arabic (large, Amiri font) + transliteration + meaning
- Search bar to filter names
- Tap card → expand detail modal with description/blessings
- Bookmark individual names (reuse bookmark store or create dedicated `asmaBookmarks`)

### AI Instructions

1. Create `src/data/asmaUlHusna.json` with all 99 names (you can generate this from your training data)
2. Create `src/components/pages/AsmaUlHusna/AsmaUlHusna.tsx`
3. Follow existing page patterns (Header + content grid)
4. Add route in `App.tsx` as lazy-loaded
5. Run `pnpm typecheck`

---

## 1.7 Tasbih Counter

[status: 📋] [priority: LOW] [est: 2 hr]

**What**: Digital tasbih with presets.

### Files

| File | Action |
|---|---|
| `src/components/pages/Tasbih/Tasbih.tsx` | Create |
| `src/App.tsx` | Add route |

### Implementation

- Big circle in center showing count
- Tap to increment, long-press to reset
- 3 preset counters: SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (34)
- Target progress bar
- Haptic feedback on mobile (`navigator.vibrate`)
- Count persists to localStorage

```typescript
interface TasbihCounter {
  id: string;
  label: string;
  arabic: string;
  count: number;
  target: number;
}
```

### AI Instructions

1. Create `src/components/pages/Tasbih/Tasbih.tsx`
2. Follow the design conventions (use `glass`, `btn-primary`, etc.)
3. Add route in `App.tsx`
4. Run `pnpm typecheck`

---

# Phase 2 — New Islamic Features

> Requires GPS, compass, and/or external data.

---

## 2.1 Prayer Times

[status: 📋] [priority: MEDIUM] [est: 6 hr]

**What**: Daily prayer times with next-prayer countdown.

**GPS note**: Uses `navigator.geolocation.getCurrentPosition()` to get user's coordinates. These are passed to the `adhan` library for calculation. Works offline after initial location fetch.

### Files

| File | Action |
|---|---|
| `src/components/pages/PrayerTimes/PrayerTimes.tsx` | Create |
| `src/components/pages/PrayerTimes/PrayerSettings.tsx` | Create |
| `src/components/pages/PrayerTimes/NextPrayerBanner.tsx` | Create |
| `src/hooks/usePrayerTimes.ts` | Create |
| `src/App.tsx` | Add routes |

### Dependencies

- `pnpm add adhan`

### Data Flow

1. User opens Prayer Times page
2. Request geolocation permission (`navigator.geolocation.getCurrentPosition`)
3. If granted: save coords to settings store
4. If denied: show manual location input (city name)
5. Pass coords + calculation method to `adhan`:
   ```typescript
   import { PrayerTimes, Coordinates, CalculationMethod } from "adhan";
   const coords = new Coordinates(lat, lng);
   const params = CalculationMethod.MuslimWorldLeague();
   const times = new PrayerTimes(coords, new Date(), params);
   ```
6. Display 6 prayer times + next prayer highlighted with countdown

### GPS Implementation

```typescript
function requestLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}
```

### UI

- Cards for each prayer time (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
- Current prayer highlighted with glow
- Next prayer: prominent card with countdown timer (updates every second)
- Settings: calculation method picker, manual offset adjustments

### AI Instructions

1. `pnpm add adhan`
2. Create `src/hooks/usePrayerTimes.ts` — handles location + calculation
3. Create prayer times components
4. Add routes to `App.tsx`
5. **Important**: Prayer times should still render gracefully if location is denied (show manual input fallback)
6. Run `pnpm typecheck`

---

## 2.2 Qibla Finder

[status: 📋] [priority: LOW] [est: 4 hr]

**What**: Compass needle pointing toward Makkah.

**GPS/Compass notes**:
- Uses **GPS** (`navigator.geolocation`) to get user coordinates
- Uses **Compass** (`DeviceOrientationEvent` with `webkitCompassHeading` or absolute orientation) for device direction
- Calculates bearing from user → Kaaba (21.4225°N, 39.8262°E) using the `bearing()` formula

### Files

| File | Action |
|---|---|
| `src/components/pages/Qibla/QiblaFinder.tsx` | Create |
| `src/App.tsx` | Add route |

### Implementation

```typescript
function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(lat2 * (Math.PI / 180));
  const x = Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
            Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLng);
  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}
```

**Compass API**:
```typescript
window.addEventListener("deviceorientationabsolute", (event) => {
  const heading = event.webkitCompassHeading || event.alpha;
  // heading = degrees from North
  // qiblaDirection = bearing from user to Kaaba
  // needleRotation = qiblaDirection - heading (compensated)
});
```

**Fallback**: Show bearing degrees if compass unavailable.

**UI**:
- Large circular compass graphic
- Red needle pointing to Qibla direction
- Degree display + cardinal direction
- Background changes green when facing Qibla (±5°)

### AI Instructions

1. Create `src/components/pages/Qibla/QiblaFinder.tsx`
2. Use CSS `transform: rotate()` for the compass needle
3. Request geolocation for user coords
4. Request `DeviceOrientationEvent` permission (requires user gesture on iOS)
5. Add route in `App.tsx`
6. Test fallback paths (no GPS, no compass)
7. Run `pnpm typecheck`

---

## 2.3 Dua Collection

[status: 📋] [priority: LOW] [est: 5 hr]

**What**: Categorized library of daily duas with search + bookmark.

### Files

| File | Action |
|---|---|
| `src/data/duas.json` | Create — bundled data |
| `src/components/pages/Duas/Duas.tsx` | Create |
| `src/components/pages/Duas/DuaCategory.tsx` | Create |
| `src/components/pages/Duas/DuaDetail.tsx` | Create |
| `src/App.tsx` | Add routes |

### Implementation

- Category grid → Category page with dua list → Detail page
- Each dua: Arabic, transliteration, translation, reference, benefit
- Bookmark individual duas (use bookmarks store or dedicated)
- Search across all duas

**Categories**: Morning & Evening, Before Sleeping, After Waking, Before Eating, After Eating, Traveling, Entering Home, Leaving Home, etc.

### AI Instructions

1. Create `src/data/duas.json` with at least 30-50 common duas across 8-10 categories
2. Create pages following existing patterns (Header + cards/grid)
3. Add routes in `App.tsx`
4. Run `pnpm typecheck`

---

## 2.4 Multiple Qaris

[status: 📋] [priority: LOW] [est: 1 hr]

**What**: Let users switch reciter in Settings.

**Dependencies**: `0.2` (settings store has `qariId`)

### Files

| File | Action |
|---|---|
| `src/components/AudioPlayer/AudioPlayerContext.tsx` | Modify `getAudioUrl()` |
| `src/components/pages/Settings/Settings.tsx` | Add qari selector |
| `src/data/qaris.ts` | Create — mapping |

### Implementation

```typescript
// src/data/qaris.ts
export interface Qari {
  id: string;
  name: string;
  nameAr: string;
  baseUrl: string;
}

export const QARIS: Qari[] = [
  { id: "alafasy", name: "Mishary Al-Afasy", nameAr: "مشاري العفاسي", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy" },
  { id: "sudais", name: "Abdur Rahman As-Sudais", nameAr: "عبد الرحمن السديس", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.sudais" },
  { id: "shuraym", name: "Saud Al-Shuraym", nameAr: "سعود الشريم", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.shuraym" },
  { id: "ghamdi", name: "Saad Al-Ghamdi", nameAr: "سعد الغامدي", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.ghamdi" },
  { id: "basit", name: "Abdul Basit", nameAr: "عبد الباسط", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit" },
];
```

In `AudioPlayerContext.tsx`, modify `getAudioUrl` to accept a qari base URL:

```typescript
// Instead of hardcoded AUDIO_BASE, read from settings
import { useSettings } from "../../store/settings";

// getAudioUrl becomes:
export function getAudioUrl(totalNumber: number, qariBase?: string): string {
  return `${qariBase || AUDIO_BASE}/${totalNumber}.mp3`;
}
```

Then in `buildTrack`, pass the qari base from settings.

### AI Instructions

1. Create `src/data/qaris.ts`
2. In `AudioPlayerContext.tsx`, update `getAudioUrl()` to accept optional qari base URL
3. Wire `useSettings()` to pick the active qari base URL when building tracks
4. In `Settings.tsx`, add a qari selector section (dropdown or radio list with preview)
5. SW runtime cache in `vite.config.ts` already matches the CDN pattern — no change needed
6. Run `pnpm typecheck`

---

## 2.5 Last 10 Surahs

[status: 📋] [priority: LOW] [est: 30 min]

**What**: Quick access grid of Surahs 105-114 for prayer.

### Files

| File | Action |
|---|---|
| `src/components/pages/LastTenSurahs/LastTenSurahs.tsx` | Create |
| `src/App.tsx` | Add route |

### Implementation

- Hardcoded list of surah IDs 105-114
- Read from cached IndexedDB data
- Card grid, each card → navigate to `/surah/:id`
- Show surah name (Arabic + English), revelation type, ayah count

### AI Instructions

1. Create `src/components/pages/LastTenSurahs/LastTenSurahs.tsx`
2. Use `useSurahs()` hook to get data, filter IDs 105-114
3. Add route + sidebar navigation item
4. Run `pnpm typecheck`

---

# Phase 3 — Heavy Features

> Large data sets, multiple APIs, significant UI.

---

## 3.1 Bookmark Management Page

[status: 📋] [priority: MEDIUM] [est: 2 hr]

**What**: Dedicated page listing all bookmarked ayahs.

**Dependencies**: `1.2` (bookmark hook)

### Files

| File | Action |
|---|---|
| `src/components/pages/Bookmarks/Bookmarks.tsx` | Ensure exists and is polished |

### Implementation

- Group by surah (collapsible sections)
- Each item: ayah number + first few words of Arabic + English
- Tap → navigate to `/surah/:id`
- Swipe to delete or remove button
- Empty state with illustration

### AI Instructions

1. Create/update `Bookmarks.tsx`
2. Use `useBookmarks()` hook
3. Follow design patterns from existing pages
4. Add route if not already added
5. Run `pnpm typecheck`

---

## 3.2 Hadith Library

[status: 📋] [priority: LOW] [est: 8 hr]

**What**: Browse/search major hadith collections.

**Data**: Use a CDN-hosted hadith API. Options:
- `https://cdn.jsdelivr.net/gh/nhridoy/hadith-api` (if exists, same author as current quran API)
- `https://api.hadith.gading.dev/books` (free open API)
- `https://dorar.net/hadith/api` (Arabic-focused)

### Files

| File | Action |
|---|---|
| `src/hooks/useHadith.ts` | Create |
| `src/components/pages/Hadith/HadithCollections.tsx` | Create |
| `src/components/pages/Hadith/HadithBooks.tsx` | Create |
| `src/components/pages/Hadith/HadithDetail.tsx` | Create |
| `src/App.tsx` | Add routes |

### AI Instructions

1. Research available hadith API (start with the same source as quran-api)
2. Create data fetching hook with IndexedDB caching
3. Follow existing page patterns
4. Add routes
5. Run `pnpm typecheck`

---

## 3.3 Tafsir Integration

[status: 📋] [priority: LOW] [est: 6 hr]

**What**: Per-ayah commentary on the Surah page.

### Files

| File | Action |
|---|---|
| `src/hooks/useTafsir.ts` | Create |
| `src/components/pages/Surah/Surah.tsx` | Add tafsir tab |

### AI Instructions

1. Research tafsir API source (consider bundling JSON or fetching from CDN)
2. Add tab UI to Surah page (Verse / Tafsir toggle)
3. Cache tafsir data in IndexedDB
4. Run `pnpm typecheck`

---

## 3.4 Tajweed Coloring

[status: 📋] [priority: LOW] [est: 8 hr]

**What**: Color-code Arabic text with tajweed rules.

**Approach**: Client-side text processing → wrap letters in `<span>` with color classes.

### AI Instructions

1. Research tajweed rules implementation
2. Create `src/lib/tajweed.ts` — text processing function
3. Apply coloring via CSS classes in `Ayahs.tsx`
4. Add toggle in Settings
5. Run `pnpm typecheck`

---

## 3.5 Offline Download Manager

[status: 📋] [priority: LOW] [est: 6 hr]

**What**: Allow users to download surahs/paras for full offline use.

### Files

| File | Action |
|---|---|
| `src/hooks/useOfflineAudio.ts` | Create |
| `src/components/pages/OfflineManager/OfflineManager.tsx` | Create |
| `src/App.tsx` | Add route |

### AI Instructions

1. Use Cache API to store audio files
2. Add download button UI on SurahHead
3. Create offline manager page showing downloaded content + storage usage
4. Add route
5. Run `pnpm typecheck`

---

# Appendix: Route Map (Complete)

All routes to add in `src/App.tsx`:

```typescript
// ── Phase 1 ──
<Route path="/bookmarks" element={<Bookmarks />} />
<Route path="/asma-ul-husna" element={<AsmaUlHusna />} />
<Route path="/tasbih" element={<Tasbih />} />

// ── Phase 2 ──
<Route path="/prayer-times" element={<PrayerTimes />} />
<Route path="/prayer-times/settings" element={<PrayerSettings />} />
<Route path="/qibla" element={<QiblaFinder />} />
<Route path="/duas" element={<Duas />} />
<Route path="/duas/:categoryId" element={<DuaCategory />} />
<Route path="/last-ten-surahs" element={<LastTenSurahs />} />

// ── Phase 3 ──
<Route path="/hadith" element={<HadithCollections />} />
<Route path="/hadith/:collection" element={<HadithBooks />} />
<Route path="/hadith/:collection/:bookId" element={<HadithDetail />} />
<Route path="/offline" element={<OfflineManager />} />
```

---

# Appendix: GPS & Compass API Summary

| Feature | API Used | Permission | Fallback |
|---|---|---|---|
| Prayer Times | `navigator.geolocation.getCurrentPosition()` | Yes (browser prompt) | Manual city name input |
| Qibla Finder | `navigator.geolocation` + `deviceorientationabsolute` | Yes (both) | Show bearing degrees without compass |
| Hijri Date | None (date math) | None | Always works |

**Notes**:
- On iOS 13+, `DeviceOrientationEvent` requires explicit permission request via `DeviceOrientationEvent.requestPermission()` triggered by user gesture
- `enableHighAccuracy: true` gives best Qibla result but uses more battery
- All GPS/compass features gracefully degrade if permissions are denied

---

# Appendix: Dependency Decisions

| Package | Size | Phase | Status |
|---|---|---|---|
| `zustand` | ~2KB | 0 | ✅ Approved — recommended for global state |
| `hijri-js` | ~3KB | 1 | ✅ Approved — lightweight |
| `adhan` | ~15KB | 2 | ✅ Approved — prayer times |
| `react-query` | — | — | ❌ Rejected — overkill for this app's data pattern |
| `dexie` | — | — | ❌ Rejected — `idb` already works, no need to migrate |

---

*Last updated: 2026-05-17*

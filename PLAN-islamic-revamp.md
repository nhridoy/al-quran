# Pure — Islamic App Revamp Plan

---

## Brand

- **App Name:** Pure
- **Tagline:** Your daily companion for faith & reflection
- **Visual Direction:** Minimal, warm, spiritual. Current design language fits well — keep the gradient (primary→secondary), glass effects, and dark mode.

---

## Feature Inventory

### ✅ Already Built (no change needed)

| Feature | Route | Notes |
|---------|-------|-------|
| Surah reader | `/surah`, `/surah/:id` | Fully functional |
| Para reader | `/para`, `/para/:id` | Fully functional |
| Last 10 Surahs | `/last-ten-surahs` | Fully functional |
| Prayer Times | `/prayer-times` | Countdown, current prayer, adhan lib |
| Qibla Finder | `/qibla` | Compass, device orientation, geolocation |
| Asma ul-Husna | `/asma-ul-husna` | Searchable grid + detail dialog |
| Duas | `/duas`, `/duas/:categoryId` | Categories, search, accordion |
| Hadith | `/hadith`, `/hadith/:slug`, `/hadith/:slug/books/:bookIndex` | Collections, books, search |
| Tasbih | `/tasbih` | Counter, presets, haptic, persistence |
| Downloads | `/downloads` | Audio download manager |
| Hijri Date | (embedded component) | Shown in some views |
| Settings | `/settings` | Already has prayer, hadith, hijri settings |

### 🔧 Needs Rework / Enhancement

| Feature | What's Missing |
|---------|---------------|
| **Splash → Homepage Dashboard** | Complete rewrite. Currently just a brand splash. Needs to become live dashboard with prayer times, sahri/iftar, quick actions, dual date, random content. |
| **Asma ul-Husna → Tracker** | Add memorization tracking per name |
| **Bookmarks** | Placeholder buttons, no logic wired |
| **Last 10 Surahs** | Add tafsir integration |
| **Tajweed color-coded Quran** | Feature exists but colours/rules may be inaccurate. Audit against established tajweed rules and fix. Make it a toggle in the surah reader. |

### 🆕 New Features

| Feature | Priority | Description |
|---------|----------|-------------|
| **Homepage Dashboard** | P0 | Prayer times side-by-side with shortcuts, dual date, sahri/iftar, random content at bottom |
| **Hijri Calendar** | P0 | Full month grid with dual dates + Islamic events + upcoming events list |
| **Fasting Calendar** | P0 | Sahri + Iftar times for every day of the year |
| **Worship Daily Log** | P0 | Track prayers, Quran reading, adhkar, charity in one place with streak |
| **Prayer Tracker** | P1 | Mark 5 prayers + Witr, monthly heatmap |
| **Zakat Calculator** | P1 | Asset inputs, nisab check, 2.5% calculation |
| **Quran Reading Progress** | P1 | Visual progress across 30 juz / 114 surahs |
| **Sadaqah/Charity Tracker** | P1 | Log charity, monthly goals, totals |
| **Salah Learning Guide** | P2 | Step-by-step how-to-pray guide with illustrations |
| **99 Names Memorization** | P2 | Track which names you've memorized |
| **Knowledge Section** | P2 | "Did You Know" cards — short Islamic facts |
| **Islamic Name Finder** | P3 | Search/explore meanings of Islamic names |
| **Reading Goals & Reminders** | P3 | Set daily/weekly Quran reading targets with push reminders |
| **Data Export** | P3 | Export all tracked data (bookmarks, prayers, sadaqah, progress) as JSON |
| **Language Expansion (EN + BN)** | P3 | Full app UI in both English and Bengali, toggle in settings |
| **Ramadan Mode** | Seasonal | Auto-detected, special theme, taraweeh tracker |
| **Mosque Finder** | Future | Map-based nearby mosque locator |
| **Widget Support** | Future | Mobile home screen widgets (iOS/Android) |
| **Digital Hajj Tracker** | Future | Step-by-step Hajj ritual guide |

---

## Architecture Approach

### Routes
All lazy-loaded:
```
/                     ← Homepage Dashboard (rewrite Splash)
/hijri-calendar       ← NEW
/fasting-calendar     ← NEW
/prayer-tracker       ← NEW
/daily-log            ← NEW
/zakat-calculator     ← NEW
/quran-progress       ← NEW
/sadaqah-tracker      ← NEW
/salah-guide          ← NEW
/asma-tracker         ← NEW (reuse existing /asma-ul-husna route)
/knowledge            ← NEW
/islamic-names        ← NEW
/reading-goals        ← NEW
/ramadan              ← NEW (activated during Ramadan)
```

### Nav Structure
```
QURAN
├── Surahs
├── Paras
├── Last 10 Surahs
├── Bookmarks
├── Reading Progress      ← NEW

WORSHIP
├── Daily Log             ← NEW
├── Prayer Tracker        ← NEW
├── Fasting Calendar      ← NEW
├── Sadaqah Tracker       ← NEW
├── Tasbih

TOOLS
├── Prayer Times
├── Qibla
├── Zakat Calculator      ← NEW
├── Hijri Calendar        ← NEW
├── Asma ul-Husna         ← integrate memorization tracker
├── Duas
├── Hadith

LEARN
├── Salah Guide           ← NEW
├── Knowledge             ← NEW
├── Islamic Names         ← NEW

MORE
├── Downloads
├── Reading Goals         ← NEW
├── Language              ← NEW (EN/BN toggle)
├── Data Export           ← NEW
├── Settings
├── About / Credits / Donation
```

### Data Layer
No new external APIs needed:
- **Fasting/sawm times** → Existing `adhan` library. Fajr = Sahri end. Maghrib = Iftar.
- **Hijri calendar** → `Intl.DateTimeFormat("en-u-ca-islamic")` — built-in, offline.
- **Islamic events** → Static lookup table.
- **Random hadith/ayah/dua** → Query existing IDB cache + static JSON.
- **Prayer records** → New IndexedDB store.
- **Zakat calculator** → Pure client-side math. Gold/silver rates: manual entry initially.
- **Reading progress** → New IndexedDB store.
- **Sadaqah records** → New IndexedDB store.
- **99 Names memorization** → New IndexedDB store (or extend existing asma component).
- **Salah guide** → Static content bundled with app.
- **Islamic names** → Static data file bundled with app.
- **Knowledge facts** → Static data file bundled with app.
- **Tajweed rules** → Static rule map per character/word in the mushaf. Audit current implementation against established tajweed standards.
- **Reading goals** → New IndexedDB store for goals + `Notification API` for reminders.
- **Data export** → Pure client-side: read all IDB stores → serialize to JSON → trigger file download.
- **Language (EN/BN)** → i18n JSON files for all UI strings. Use React context for current locale. Settings toggle persists choice.

---

## Detailed Feature Specs

### 1. Homepage Dashboard (rewrite Splash)

**Layout:**

```
┌─────────────────────────────────────────┐
│  📅 Wednesday, 15 March 2026            │
│     24 Ramadan 1447 AH                  │
├─────────────────────────────────────────┤
│  🕌 Next Prayer: Asr                     │
│     ⏱ 2h 34m remaining                 │
│  ┌───────────────────────────────────────────────────────────────────────┐│
│  │ Fajr 4:53 ✓ │ Dhuhr 12:15 ✓ │ Asr 3:45 ◉ │ Maghrib 6:07 │ Isha 7:45 ││
│  └───────────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  🌙 Sehri ends:  4:53 AM                │  ← Ramadan conditional
│  🌙 Iftar:       6:07 PM                │
│     Remaining:   2h 14m                 │
├─────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │📖    │ │🕌    │ │🧭    │ │📿    │  │
│  │Surah │ │Prayer│ │Qibla │ │Tasbih│  │
│  ├──────┤ ├──────┤ ├──────┤ ├──────┤  │
│  │🤲    │ │📚    │ │⭐    │ │📅    │  │
│  │Duas  │ │Hadith│ │Asma  │ │Log   │  │
│  ├──────┤ ├──────┤ ├──────┤ ├──────┤  │
│  │💰    │ │🌙    │ │📖    │ │⚙️    │  │
│  │Zakat │ │Fasting│ │Para  │ │More  │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│  💡 Did you know?                       │  ← knowledge snippet
├─────────────────────────────────────────┤
│  الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ       │
│  Random hadith / ayah / dua card        │  ← at bottom
│  [🔄 Refresh]                           │
└─────────────────────────────────────────┘
```

**Interactive prayer tracking:**
- Each prayer name is **tappable** — tap to mark as prayed (✓) or undo
- Checkmark fills with the primary colour when toggled
- The current prayer time is highlighted with ◉ and a coloured background
- Synced with the same IndexedDB store used by the Prayer Tracker and Daily Log pages — mark it anywhere, it reflects everywhere
- Past missed prayers show unfilled

**Conditional Sahri/Iftar logic:**
- Before Fajr → "Sehri ends at XX:XX" with countdown
- Between Fajr and Maghrib → "Iftar at XX:XX" with countdown
- After Maghrib → "Iftar at XX:XX" with "Completed" badge
- Non-Ramadan → hide or show simplified note

**Random content:** On mount, pick one random item from each category (hadith, ayah, dua). Cycle through them with a carousel/tab or show one and let user tap to cycle. Persist in session state.

### 2. Hijri Calendar Page (`/hijri-calendar`)

- Month grid view
- Each cell: Gregorian date + small Hijri date
- Islamic events highlighted with colored dot/badge
- Events list:
  - Islamic New Year (1 Muharram)
  - Day of Ashura (10 Muharram)
  - Mawlid (12 Rabi al-Awwal)
  - Isra & Mi'raj (27 Rajab)
  - Shab-e-Barat (15 Shaban)
  - Ramadan starts (1 Ramadan)
  - Laylat al-Qadr (27 Ramadan)
  - Eid al-Fitr (1 Shawwal)
  - Day of Arafah (9 Dhul Hijjah)
  - Eid al-Adha (10 Dhul Hijjah)
- Navigation: prev/next month, jump to today
- Sidebar: "Upcoming Events" with days-until countdown

### 3. Fasting Calendar (`/fasting-calendar`)

- Month-by-month view
- Each day shows: Gregorian date, Hijri date, Fajr (Sahri end), Maghrib (Iftar), fasting duration
- Ramadan days highlighted visually
- Uses `adhan` library with user's saved location
- Fully offline — no API needed

### 4. Worship Daily Log (`/daily-log`)

Central daily worship checklist:
- [ ] Fajr prayed
- [ ] Quran read (tap to log pages/verses)
- [ ] Morning adhkar
- [ ] Duha prayer
- [ ] Dhuhr prayed
- [ ] Asr prayed
- [ ] Evening adhkar
- [ ] Maghrib prayed
- [ ] Isha prayed
- [ ] Witr prayed
- [ ] Tahajjud prayed
- [ ] Charity given today (tap to enter amount)
- [ ] Fasting today (Ramadan season)

Shows **streak** (consecutive days of completion). Weekly stats (best day, average completion %). Monthly calendar view with completion heatmap.

**Storage:** IndexedDB store `worship-records` + streak computation.

### 5. Prayer Tracker (`/prayer-tracker`)

- Today's 5 prayers + Witr
- Checkbox/button per prayer
- Circular checkmark or filled badge
- Streak counter (consecutive full days)
- Monthly calendar with heatmap
- Per-month filter

### 6. Zakat Calculator (`/zakat-calculator`)

**Inputs:** Cash, gold (grams + karat), silver (grams), investments, business inventory, property (investment only), debts receivable, debts payable (subtracted).

**Logic:**
- Nisab threshold: value of 85g gold OR 595g silver (user chooses)
- Compare total assets against nisab
- Zakat = 2.5% of qualifying assets if above nisab
- Step-by-step breakdown with numbered sections
- Option to save calculation result

**Gold/silver rates:** Manual entry with a "last used" localStorage cache.

### 7. Quran Reading Progress (`/quran-progress`)

- Visual progress: "You've read 23% of the Quran"
- Per-juz progress bar (30 bars)
- Per-surah completion checkmarks
- Syncs with "last read" position from ayah pages
- Optional: time estimate to complete (based on reading speed)

### 8. Sadaqah/Charity Tracker (`/sadaqah-tracker`)

- Quick-add: amount + category + date
- Categories: Sadaqah, Zakat, Sponsorship, Emergency, Other
- Monthly total, yearly total
- Monthly bar chart
- Optional: weekly/monthly goal setting
- Optional: recurring reminder

### 9. Salah Learning Guide (`/salah-guide`)

- Step-by-step guide: Wudu → Niyyah → Takbir → Qiyam → Ruku → Sujud → Tashahhud → Salam
- Each step: arabic text, transliteration, translation, illustration/icon
- Tabs: Fajr (2 rakat), Dhuhr (4), Asr (4), Maghrib (3), Isha (4), Witr (3)
- Common mistakes section
- Printable cheat-sheet view
- Content is static, bundled with app — fully offline

### 10. 99 Names Memorization Tracker (`/asma-tracker`)

Integrate into existing `/asma-ul-husna` page:
- Toggle "memorized" on each name
- Progress: "You've memorized 45/99 names"
- Quiz mode: show meaning, guess the name (or vice versa)
- Spaced repetition review queue

### 11. Knowledge Section (`/knowledge`)

- Curated Islamic facts displayed as cards
- Categories: Quran, Hadith, History, Prophets, Angels, Hereafter, Science
- "Did You Know" daily widget on homepage
- Swipeable card stack (like flashcards)
- Bookmark interesting facts
- Content is static, bundled with app

### 12. Islamic Name Finder (`/islamic-names`)

- Search by name or meaning
- Alphabetical browse
- Each entry: name (Arabic + transliteration), meaning, origin
- Filter by gender (boy/girl/both)
- Favorites list
- Share button

### 13. Ramadan Mode (Seasonal)

- Auto-activated when Hijri date enters Ramadan
- Amber/crescent theme accent
- Homepage prioritizes fasting info
- Taraweeh rakat tracker
- Extended sahri/iftar notifications
- Daily Ramadan dua push
- Automatically deactivates after Eid

### 14. Bookmarks (wire up)

- `useBookmarks` hook with IDB persistence
- Bookmark/unbookmark on ayah pages
- Bookmark list page at `/bookmarks`
- Organize by surah or date

### 15. Tajweed Color-Coded Quran (fix)

- Audit current colour rules against established tajweed standards (Ghunnah, Idgham, Ikhfa, Izhar, Qalqalah, Madd, etc.)
- Correct any miscoloured characters
- Ensure toggle is in the surah reader settings
- Add a small legend/tooltip so users know what each colour means

### 16. Reading Goals & Reminders

- **Set goals:** Daily verses (e.g. "Read 1 juz per day") or daily minutes (e.g. "Read 10 minutes")
- **Track progress:** Show today's progress on the homepage and in the Quran reading progress page
- **Reminders:** Schedule push notification at a chosen time (e.g. "8:00 AM — Read your Quran for today!")
- **Streak:** Consecutive days hitting the goal
- **Storage:** IndexedDB store `reading-goals` + `Notification API` with permission prompt

### 17. Data Export

- Single button in Settings → "Export My Data"
- Collects: bookmarks, prayer records, worship logs, sadaqah entries, reading progress, tasbih counts
- Serializes to a single JSON file with metadata (export date, app version)
- Triggers browser download as `pure-data-2026-06-05.json`
- No import/restore for v1 (read-only export)

### 18. Language Expansion (EN + BN)

- Extract all hardcoded UI strings into JSON files: `src/locales/en.json`, `src/locales/bn.json`
- Create a `LocaleProvider` React context + `useLocale()` hook
- Settings page gets a "Language" selector (English / বাংলা)
- Persist choice in settings store
- Bengali font already supported (the app shows Arabic + Bengali text already)
- Scope: all UI chrome (nav, buttons, labels, settings) — Quran/dua/hadith content is already bilingual

---

## Future (Post v1)

- **Mosque Finder** — map + distance + prayer times for that mosque
- **Widget Support** — iOS home screen widget, Android app widget
- **Digital Hajj Tracker** — step-by-step ritual guide for pilgrims
- **Community Features** — reading groups, progress sharing
- **Arabic Learning** — basic Arabic lessons integrated with Quran vocab
- **AI Features** — ask questions about Islam, get answers from curated sources

---

## Phasing & Execution

### Phase 1: Foundation + Homepage (Week 1)

| Day | Task |
|-----|------|
| 1 | Brand update: rename "Al Quran" → "Pure" everywhere |
| 1 | Sidebar nav restructure with new sections |
| 2 | Add new routes + update router |
| 2 | Create `useRandomContent` hook + IDB helpers |
| 3–5 | **Homepage Dashboard** — full rewrite with side-by-side layout, dual date, countdown, sahri/iftar, random content at bottom, knowledge snippet |

### Phase 2: Calendar & Fasting (Week 2)

| Day | Task |
|-----|------|
| 1 | Islamic events lookup table + utility functions |
| 2–3 | **Hijri Calendar page** — month grid, dual dates, events, upcoming list |
| 3 | **Fasting Calendar page** — adhan-powered per-day sahri/iftar |
| 4 | Integrate fasting info + hijri date into homepage |
| 5 | Responsive pass + edge case handling |

### Phase 3: Trackers (Week 3)

| Day | Task |
|-----|------|
| 1–2 | **Worship Daily Log** — checklist, streak, IDB storage, monthly heatmap |
| 2–3 | **Quran Reading Progress** — per-juz/surah visualization |
| 3–4 | **Prayer Tracker** — daily marks, streak, heatmap |
| 4 | **Sadaqah Tracker** — quick-add, monthly totals, goals |
| 5 | **Bookmarks** — wire up hook + UI |

### Phase 4: Tools & Learning (Week 4)

| Day | Task |
|-----|------|
| 1–2 | **Zakat Calculator** — form, nisab logic, breakdown |
| 2 | **99 Names Memorization** — integrate tracker into existing page |
| 3 | **Salah Learning Guide** — static content + step UI |
| 3 | **Knowledge Section** — fact cards + daily widget |
| 4 | **Islamic Name Finder** — search + browse |
| 4 | **Tajweed audit** — review + fix colour rules |
| 5 | **Ramadan Mode** — auto-detection + theme + taraweeh tracker |

### Phase 5: Goals, Language & Export (Week 5)

| Day | Task |
|-----|------|
| 1–2 | **Reading Goals & Reminders** — goal setting UI, notification scheduling, streak, homepage widget |
| 2–3 | **Language Expansion** — extract all strings, create en.json + bn.json, LocaleProvider, settings toggle |
| 4 | **Data Export** — collect all IDB stores, serialize, download |
| 5 | Full app lint, typecheck, test, deploy |

---

## Key Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| **Hijri conversion** | `Intl.DateTimeFormat("en-u-ca-islamic")` | Built-in, offline, zero deps |
| **Fasting times** | Existing `adhan` library | Already in project |
| **Islamic events** | Static lookup table | Small data, never changes |
| **Gold/silver rates** | Manual entry initially | Avoid API dependency |
| **All trackers** | IndexedDB stores | Matches existing pattern |
| **Homepage random content** | On-mount seed from IDB | No API call, instant |
| **Learning content** | Static files bundled with app | Fully offline, no API needed |
| **99 Names tracker** | Extend existing page | Reuse existing UI + data |
| **Ramadan detection** | Check Hijri month on mount | Simple, reliable |

## What Does NOT Change

- All existing Quran reading features (surah, para, last ten)
- Audio player
- Existing tools (prayer times, qibla, duas, hadith, tasbih)
- Existing settings
- Theme system, dark mode
- Service worker, PWA config
- Build system, lint, formatting

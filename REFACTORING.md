# Refactoring Plan

## Overview

- **Total TS/TSX files:** 98
- **Total lines (TS/TSX):** ~11,374
- **Files > 200 lines:** 14
- **Distinct duplication patterns:** 10 (A–J)

---

## Large Components (>200 lines)

| Priority | File | Lines | What to do |
|----------|------|-------|------------|
| P0 | `src/components/features/AudioPlayer/ExpandedPlayer.tsx` | 648 | Extract 12 inline sub-components into separate files (SeekBar, PlayPauseButton, PrevButton, NextButton, ShuffleButton, RepeatButton, MuteButton, PlaylistButton, MinimizeButton, DesktopPlayerContent, MobilePlayerContent, TopProgressBar) |
| P0 | `src/components/features/Onboarding/Onboarding.tsx` | 607 | Extract each step into its own file; unify `StepReciter` and `StepTafsir` into a reusable list-select component |
| P0 | `src/pages/Settings/Settings.tsx` | 590 | Replace inline toggle switch with existing `<Switch>` component; extract `SettingCard`; break settings groups into separate sections |
| P0 | `src/components/features/AudioPlayer/AudioPlayerContext.tsx` | 504 | Split into sub-hooks: `useAudioPlayback`, `useAudioPlaylist`, `useAudioShuffle` |
| P1 | `src/lib/db.ts` | 439 | Abstract repetitive fetch/store patterns into a generic `createCache<T>` factory |
| P1 | `src/pages/Qibla/QiblaFinder.tsx` | 376 | Extract compass math and coordinate helpers into `lib/qibla.ts` |
| P1 | `src/pages/Downloads/Downloads.tsx` | 365 | Extract `SurahDownloadCard` to its own file; share URL dedup utility |
| P1 | `src/components/features/Search/Search.tsx` | 284 | Split search results into separate `SearchResults` component |
| P1 | `src/components/quran/Ayah/Ayah.tsx` | 276 | Extract bookmark button, audio button, tafsir panel into sub-components |
| P1 | `src/pages/PrayerTimes/PrayerTimes.tsx` | 242 | Extract prayer calculation logic into `lib/prayerTimes.ts` |
| P2 | `src/pages/Hadith/HadithBook.tsx` | 232 | Extract `HadithAccordion` and `HadithPagination` components |
| P2 | `src/pages/Bookmarks/Bookmarks.tsx` | 228 | Extract search/filter logic into shared hook `useFilteredList` |
| P2 | `src/pages/Tasbih/Tasbih.tsx` | 203 | Extract `CounterRing` SVG component |

---

## Duplication Patterns

### Pattern A: Page Layout Boilerplate

**Files affected (17):** About, AsmaUlHusna, Bookmarks, Credits, Donation, Downloads, Duas, DuaCategory, HadithBook, HadithBooks, HadithCollections, LastTenSurahs, PrayerTimes, Qibla, Settings, Surahs, Tasbih (also SurahHead, Para pages).

Every page uses the same wrapper:

```tsx
<div className="min-h-screen">
  <Header head="..." showBack />
  <div className="mx-4 space-y-4 pb-8 md:mx-6">
    <div className="mb-2">
      <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">...</h2>
      <p className="text-sm text-text-muted dark:text-dark-text-muted">...</p>
    </div>
    {/* content */}
  </div>
</div>
```

**Fix:** Create `src/components/common/PageShell/PageShell.tsx` with props: `title`, `description?`, `showBack?`, `children`. Refactor all 17+ pages to use it.

---

### Pattern B: Card Container Classes

**Files affected (8+):** About, Bookmarks, Credits, Donation, DuaCategory, PrayerTimes, Qibla, Settings, Surahs

Same class string repeated:

```tsx
className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card"
```

**Fix:** Add a utility class in `src/index.css`:
```css
.card-surface {
  @apply overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card;
}
```

---

### Pattern C: Loading Skeletons

**Files affected (6):** Downloads, HadithBook, HadithBooks, HadithCollections, DuaCategory, Duas

Same pattern:

```tsx
<div className="space-y-3">
  {[1, 2, 3, 4, 5].map((n) => (
    <div key={n} className="h-24 animate-pulse rounded-2xl bg-surface-alt dark:bg-dark-surface-alt" />
  ))}
</div>
```

**Fix:** Create `src/components/common/SkeletonLoader/SkeletonLoader.tsx` with props: `count`, `height`, `className?`.

---

### Pattern D: Error / Empty States

**Files affected (4+):** HadithBook, HadithBooks, HadithCollections, Bookmarks, Search

Near-identical error display:

```tsx
<div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface-card">
  <BiErrorCircle className="text-4xl text-red-400" />
  <p className="text-sm text-text-muted">{error}</p>
  <button onClick={refetch} className="...">Try Again</button>
</div>
```

**Fix:** Create `src/components/common/ErrorState/ErrorState.tsx` with props: `message`, `onRetry?`.

---

### Pattern E: Inline Toggle Switch

**File:** `src/pages/Settings/Settings.tsx` (lines ~367, ~400)

Toggle reimplemented inline despite having a `<Switch>` shadcn component:

```tsx
<Button role="switch" aria-checked={bool} onClick={...} className="relative h-6 w-11 rounded-full ...">
  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ..." />
</Button>
```

**Fix:** Replace with `<Switch checked={bool} onCheckedChange={...} />` from `@/components/ui/switch`.

---

### Pattern F: Shared Filter Logic

**Files affected:** `Bookmarks.tsx`, `Downloads.tsx`

```tsx
const filtered = useMemo(() => {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter((item) => item.name.toLowerCase().includes(q));
}, [search, items]);
```

**Fix:** Create `src/hooks/useFilteredList.ts` — generic hook that accepts items, search term, and key extractors.

---

### Pattern G: Audio URL Deduplication

**Files affected (3):** `AudioPlayerContext.tsx`, `Downloads.tsx` (x2)

```tsx
const urls = [primary, secondary, tertiary, alternative].filter(
  (u, idx, arr) => u && arr.indexOf(u) === idx,
);
```

**Fix:** Create `src/lib/audio.ts` utility function `dedupeUrls(...urls: (string | undefined)[])`.

---

### Pattern H: StepReciter / StepTafsir Duplicate Layout

**File:** `src/components/features/Onboarding/Onboarding.tsx`

Both steps share identical list-select layout with different title and data source.

**Fix:** Extract `ListSelectStep` component with props: `title`, `items`, `selectedId`, `onSelect`, `onContinue`.

---

### Pattern I: Store Boilerplate

**Files affected (5):** `store/audio.ts`, `bookmarks.ts`, `downloads.ts`, `location.ts`, `settings.ts`

All follow:

```ts
interface Store { ... }
const useStore = create<Store>((set, get) => ({
  load: async () => { /* read from IDB */ },
  ...
}));
```

**Fix:** Create `src/lib/createStore.ts` factory with common `load` / `persist` middleware.

---

### Pattern J: Audio Player Button Components

**File:** `src/components/features/AudioPlayer/ExpandedPlayer.tsx`

8 button components with identical structure (PrevButton, NextButton, ShuffleButton, RepeatButton, MuteButton, PlaylistButton, MinimizeButton, PlayPauseButton).

**Fix:** Create a single configurable `PlayerButton` component with props: `icon`, `label`, `active?`, `onClick`, `size?`.

---

## Implementation Order (Recommended)

| Phase | Patterns | Est. Impact |
|-------|----------|-------------|
| 1 | A (PageShell), C (SkeletonLoader), D (ErrorState), E (use Switch) | High — reduces boilerplate in 20+ files |
| 2 | G (dedupeUrls), F (useFilteredList) | Medium — shared utilities |
| 3 | B (card utility class), J (PlayerButton) | Medium — CSS + small components |
| 4 | H (ListSelectStep for Onboarding) | Medium — unifies duplicate step |
| 5 | I (store factory) | Low — nice but low visibility |
| 6 | Split the 14 large files listed above | High — reduces complexity |

---

## Verification

After each change, run:

```bash
pnpm lint-format && pnpm typecheck && pnpm build
```

# SOLID Principles — Refactor Plan

> Analysis date: 2026-06-02
> Codebase: Al-Quran React SPA

---

## S — Single Responsibility Principle

A class/component/hook should have one reason to change.

### Violation #1: `Ayah.tsx` — God component

- **File:** `src/components/quran/Ayah/Ayah.tsx`
- **Problem:** Renders verse display + audio playback + bookmarking + sharing + tajweed coloring + tafsir + scroll-into-view + sajdah indicator. ~200 lines of mixed concerns.
- **Action:** Extract audio, bookmark, share concerns into custom hooks.

### Violation #2: `AudioPlayerContext.tsx` — Monolithic orchestrator

- **File:** `src/components/features/AudioPlayer/AudioPlayerContext.tsx`
- **Problem:** 364 lines managing 13+ state fields, 14+ actions, 7 `useEffect`s, audio element lifecycle, next/prev/shuffle/repeat/seek/volume/playlist logic.
- **Action:** Split playback orchestration from state management. Extract audio element lifecycle into a separate service class.

### Violation #3: `Settings.tsx` — Page does too much

- **File:** `src/pages/Settings/Settings.tsx`
- **Problem:** 497 lines mixing UI rendering, reciter change flow (prompt → clear cache → re-cache), batch caching across all surahs/juz, tafsir grouping/filtering, data refresh.
- **Action:** Extract reciter-change orchestration and batch-caching logic into a dedicated hook or service.

### Violation #4: `db.ts` — Data access monolith

- **File:** `src/lib/db.ts`
- **Problem:** Mixes IndexedDB CRUD, HTTP fetching (hardcoded URLs), data transformation/merging, and cache orchestration.
- **Action:** Split into separate modules: `apiClient.ts` (HTTP), `cache.ts` (IDB), `dataService.ts` (orchestration).

### Violation #5: `Search.tsx` — UI + search algorithm

- **File:** `src/components/features/Search/Search.tsx`
- **Problem:** Renders modal UI and implements full-text search over 6,236 verses inline in a `useMemo`.
- **Action:** Move search algorithm to `src/lib/search.ts`.

---

## O — Open/Closed Principle

Entities should be open for extension, closed for modification.

### Violation #1: `prayerTimes.ts` switch statement

- **File:** `src/lib/prayerTimes.ts` (lines 30–43)
- **Problem:** `getAdhanMethod` uses a `switch` statement. Adding a new calculation method requires editing this file.
- **Action:** Replace with a registry/map of methods that can be extended without modifying the function.

### Violation #2: Duplicated nav arrays

- **Files:** `src/components/common/Sidebar/Sidebar.tsx`, `src/components/common/BottomNav/BottomNav.tsx`
- **Problem:** Navigation arrays are hardcoded and duplicated. Adding a route requires editing both files.
- **Action:** Extract nav config to a single source of truth (`src/lib/navigation.ts`).

### Violation #3: All routes in `App.tsx`

- **File:** `src/App.tsx` (lines 129–157)
- **Problem:** Every route is an explicit `<Route>` element. New route = edit this file.
- **Action:** Define routes as a config array; render via a loop.

### Violation #4: `cycleRepeat` state machine

- **File:** `src/components/features/AudioPlayer/AudioPlayerContext.tsx` (lines 247–253)
- **Problem:** Hardcoded `none → all → one → none` cycle. Adding "shuffle-repeat" requires modifying the function.
- **Action:** Make repeat modes extensible via a config array.

---

## L — Liskov Substitution Principle

Subtypes should be substitutable for their base types.

### Violation #1: Incompatible Desktop/Mobile player props

- **Files:** `src/components/features/AudioPlayer/DesktopPlayerContent.tsx`, `src/components/features/AudioPlayer/MobilePlayerContent.tsx`
- **Problem:** Different prop interfaces despite same conceptual role. `DesktopPlayerContent` requires `volume`/`setVolume`/`muteToggle`; `MobilePlayerContent` does not. Not interchangeable.
- **Action:** Define a common `PlayerContentProps` interface both can implement. If layout is the only difference, unify into one component with responsive CSS.

---

## I — Interface Segregation Principle

Clients should not depend on interfaces they don't use.

### Violation #1: `AppSettings` fat interface

- **File:** `src/types/index.ts` (lines 136–148)
- **Problem:** 15-field interface. `LastReadBanner` only needs font sizes but gets all fields. Selectors mitigate runtime impact but interface is monolithic.
- **Action:** Split into smaller role-based interfaces (e.g., `DisplaySettings`, `AudioSettings`, `ReciterSettings`).

### Violation #2: `AudioPlayerState` 9-field interface

- **File:** `src/components/features/AudioPlayer/types.ts` (lines 17–27)
- **Problem:** `MiniPlayer.tsx` only needs 4 fields (`currentTrack`, `isExpanded`, `isPlaying`, `isLoading`) but receives all 9.
- **Action:** Consider smaller slices or keep current split-context pattern (already partially solved by state/actions split).

### Violation #3: `Bookmark` 11-field interface

- **File:** `src/store/bookmarks.ts` (lines 4–14)
- **Problem:** Callers must construct all required fields even when `timestamp` is auto-generated.
- **Action:** Split into `NewBookmark` (input) and `Bookmark` (stored with generated fields).

---

## D — Dependency Inversion Principle

High-level modules should not depend on low-level modules; both should depend on abstractions.

### Violation #1: Hardcoded `fetch()` in data layer

- **Files:** `src/lib/db.ts`, `src/lib/batchCache.ts`
- **Problem:** High-level functions like `getSurahs()`, `getJuzData()`, `getAudioData()` directly call `fetch()` with hardcoded CDN URLs. No injectable HTTP abstraction.
- **Action:** Create an `ApiClient` interface/abstract class. Inject it into data services.

### Violation #2: Hardcoded `new Audio()` in audio player

- **File:** `src/components/features/AudioPlayer/useAudioElement.ts`
- **Problem:** Direct dependency on browser `Audio` API. No abstraction layer for testing or alternative audio backends.
- **Action:** Create an `AudioEngine` interface. Inject into the player context.

### Violation #3: Hardcoded Cache Storage API

- **File:** `src/lib/downloadManager.ts`
- **Problem:** Directly uses `caches.open("quran-audio-cache")`. Cache name and API are concrete dependencies.
- **Action:** Create an abstraction over the Cache Storage API; inject cache name as config.

### Violation #4: Direct `adhan` dependency in prayer times

- **File:** `src/lib/prayerTimes.ts`
- **Problem:** `computePrayerTimes` creates concrete `Coordinates` and `Madhab` instances. Hard to test or swap libraries.
- **Action:** Abstract calculation method behind a `PrayerTimeCalculator` interface.

### Violation #5: Orchestration logic in `Settings.tsx`

- **File:** `src/pages/Settings/Settings.tsx` (lines 103–137)
- **Problem:** Reciter change flow (prompt → clear downloads → clear audio cache → re-cache) depends on 4+ concrete stores and DB modules.
- **Action:** Extract into a `ReciterService` that depends on abstractions.

---

## Implementation Order (Recommended)

| # | Violation | Effort | Impact | Quick win? |
|---|-----------|--------|--------|------------|
| 1 | **D#4** — `createStore.ts` is already a good DIP example; replicate this pattern | Small | Medium | ✅ |
| 2 | **O#2** — Centralize nav config | Small | Medium | ✅ |
| 3 | **I#3** — Split `Bookmark` into input/stored interfaces | Small | Low | ✅ |
| 4 | **S#5** — Extract search to `lib/search.ts` | Small | Medium | ✅ |
| 5 | **S#4** — Split `db.ts` into `apiClient.ts` + `cache.ts` + `dataService.ts` | Medium | High | |
| 6 | **D#1** — `ApiClient` abstraction | Medium | High | |
| 7 | **O#3** — Config-driven routes | Medium | Medium | |
| 8 | **S#1** — Decompose `Ayah.tsx` | Medium | High | |
| 9 | **I#1** — Split `AppSettings` | Medium | Medium | |
| 10 | **S#2** — Decompose `AudioPlayerContext.tsx` | Large | High | |
| 11 | **D#2** — `AudioEngine` abstraction | Large | Medium | |
| 12 | **S#3** — Extract settings orchestration | Large | High | |
| 13 | **O#1** — Replace switch in `prayerTimes.ts` | Small | Low | |
| 14 | **L#1** — Unify Desktop/Mobile player props | Small | Low | |
| 15 | **O#4** — Make `cycleRepeat` extensible | Tiny | Low | ✅ |


## Note:
Make sure to not change UI/UX or change any features or business logic during refactoring. The goal is to improve code structure while keeping behavior identical.

## Verification

After each change, run:

```bash
pnpm lint-format && pnpm typecheck && pnpm build
```
# Codebase Refactoring Report — Al-Quran

## Overall Verdict: **HIGH QUALITY**

The codebase is well-architected with strong TypeScript usage, proper component decomposition, and several advanced React patterns. Issues below are refinements, not foundational problems.

---

## ✅ Strong Points

### AudioPlayer Architecture (`src/components/features/AudioPlayer/`)
- **Context splitting**: State and Actions are in separate contexts (`AudioPlayerStateContext` / `AudioPlayerActionsContext`), so consumers only re-render when their subscription changes — a top-tier performance pattern.
- **Ref-based state management**: `usePlayback.ts` uses refs for the audio engine state to avoid re-render cascades, with `useMemo`-stabilized context values.
- **Well-decomposed**: Split into 12 focused files (MiniPlayer, ExpandedPlayer, SeekBar, PlaylistDrawer, etc.), each with a single responsibility.

### State Management (`src/store/`)
- **Zustand with selectors**: Fine-grained subscriptions via selector functions: `useSettings((s) => s.theme)` instead of full-object subscriptions.
- **Custom persistence layer**: `createPersistedStore` in `src/lib/createStore.ts` is a clean abstraction over IndexedDB-backed Zustand stores.
- **No Redux bloat**: No action types, reducers, or dispatch boilerplate.

### Custom Hooks (`src/hooks/`)
- Single-responsibility hooks: `useAyahAudio`, `useAyahBookmark`, `useScrollToCurrentAyah`, `useShareAyah`, `useVerseTafsir` — each does exactly one thing.
- Cancellation pattern in data-fetching hooks (`useSurahs.ts:11`, `useSurah.ts:14`): uses `cancelled` flag in `useEffect` cleanup.
- Proper dependency arrays across all hooks.

### TypeScript
- Discriminated unions (`ReciterKey`, `TafsirId`), interface composition (`AppSettings extends ThemeSettings & FontSettings`), generics (`createPersistedStore<T, A>`).
- No `any` abuse found across the entire source tree.

### React.memo Usage
- 12 components already wrapped: `Ayahs`, `SurahItem`, `ParaItem`, `ParaHeader`, `SurahHead`, `Header`, `SurahDownloadCard`, `VinylDisc`, `RepeatButton`, `MuteButton`, `DesktopPlayerContent`, `MobilePlayerContent`.

---

## 🔴 Critical

### 1. Random keys on every render — SkeletonLoader

**File**: `src/components/common/SkeletonLoader/SkeletonLoader.tsx:12`

**Issue**: `crypto.randomUUID()` called in render produces new keys every time. React unmounts/remounts all skeleton elements on every re-render, breaking CSS animations.

**Fix**: Replace `crypto.randomUUID()` with stable, deterministic unique IDs. Do NOT use array indices.

---

## 🟡 High

### 2. Text-based React keys — Ayah

**File**: `src/components/quran/Ayah/Ayah.tsx:132`

**Issue**: `key={`${seg.text}-${seg.color ?? "none"}`}` — if the same word with the same color appears twice in a verse, keys collide.

**Fix**: Use a deterministic unique identifier per segment (e.g., a combination of segment position + surah + ayah context). Do NOT use array indices.

### 3. Weak React keys — ParaHeader

**File**: `src/components/quran/ParaHeader/ParaHeader.tsx:149`

**Issue**: `key={`${verse.numberInSurah} + ${verse.juz}`}` — uses `+` as separator (ambiguous), missing `surahNo` so keys could collide across surahs.

**Fix**: Use a properly unique compound key that includes surah number.

### 4. Stale closure risk — Search

**File**: `src/components/features/Search/Search.tsx:50`

**Issue**: Keyboard event handler effect has `[]` deps — works because it only uses stable `setOpen`/`setQuery`, but fragile under future edits.

**Fix**: Add proper dependencies or use a ref-based stable callback.

---

## 🟠 Medium

### 5. Unnecessary effect dependency — ParaHeader

**File**: `src/components/quran/ParaHeader/ParaHeader.tsx:33`

**Issue**: `segmentsWithAudio` in the effect dependency array, protected by a guard — redundant, could cause confusion.

**Fix**: Remove unnecessary dep from the useEffect dependency array.

### 6. DRY violation — Splash

**File**: `src/components/features/Splash/Splash.tsx`

**Issue**: Mobile layout (lines 24-76) and desktop layout (lines 79-130) are nearly identical duplicated JSX.

**Fix**: Use responsive Tailwind classes (e.g., `hidden md:block`, `block md:hidden`) instead of full conditional branches with duplicated markup.

### 7. Prop drilling — Bookmark components

**Files**:
- `src/components/pages/Bookmarks/BookmarkRow.tsx` — receives 8 individual fields
- `src/components/pages/Bookmarks/SurahGroupItem.tsx` — destructures Bookmark and passes individual fields

**Fix**: Pass the full `Bookmark` object instead of destructured fields.

### 8. Function defined in render — HijriDate

**File**: `src/components/features/HijriDate/HijriDate.tsx:11-29`

**Issue**: `gregToHijri` is recreated on every render, along with locale-formatted `gregStr`.

**Fix**: Move `gregToHijri` outside the component or memoize with `useMemo`/`useCallback`.

### 9. Fragile string parsing — db

**File**: `src/lib/db.ts:129`

**Issue**: `tafsirId.split("-")[0]` silently breaks if tafsir ID format changes.

**Fix**: Use a safer parsing approach (e.g., explicit field from data, or validate the split result).

---

## 🔵 Low

### 10. Inline styles break theming — ConfirmModal

**File**: `src/components/common/ConfirmModal/ConfirmModal.tsx:28`

**Issue**: `style={{ backgroundColor: options.confirmColor ?? "#ef4444" }}` instead of CSS classes.

**Fix**: Use Tailwind classes or CSS variables.

### 11. Hardcoded colors — StepPermissions

**File**: `src/components/features/Onboarding/StepPermissions.tsx`

**Issue**: Hex colors `#22c55e`, `#16a34a` instead of Tailwind utilities.

**Fix**: Replace with Tailwind's `green-*` utilities or theme CSS variables.

### 12. Redundant key prop — VerseResultItem

**File**: `src/components/features/Search/VerseResultItem.tsx:14`

**Issue**: `key` prop inside the component — it's unused; keys belong on the parent's `.map()`.

**Fix**: Remove the redundant key prop.

### 13. Verbose audio ref syncing — usePlayback

**File**: `src/components/features/AudioPlayer/usePlayback.ts:44-58`

**Issue**: 6 separate `useEffect` hooks to sync state → refs.

**Fix**: Consolidate into a single custom hook or helper.

### 14. Named export confusion — Search

**File**: `src/components/features/Search/Search.tsx:182`

**Issue**: Imports `SurahList` from `SurahItem/SurahItem` — the default export is `SurahList` but the file is named `SurahItem`.

**Fix**: Rename to be consistent (file or import).

---

## Missing Memoization — Top Candidates

These components re-render unnecessarily:

| # | Component | Reason |
|---|-----------|--------|
| 15 | `Sidebar` (`src/components/common/Sidebar/`) | Re-renders on every route change via `useLocation()`; static content. |
| 16 | `BottomNav` (`src/components/common/BottomNav/`) | Same as Sidebar. |
| 17 | `BookmarkRow` (`src/components/pages/Bookmarks/`) | Rendered in lists. |
| 18 | `VerseResultItem` (`src/components/features/Search/`) | Rendered in search results list. |
| 19 | `HadithItem` (`src/components/pages/Hadith/`) | Rendered in paginated hadith lists. |
| 20 | `PlayerButton` (`src/components/features/AudioPlayer/`) | Used 4-6 times in the expanded player. |
| 21 | `LastReadBanner` (`src/components/quran/LastReadBanner/`) | Subscribes to audio progress. |

---

## Performance Notes

| Concern | Detail |
|---------|--------|
| Audio player is well-optimized | Context splitting + ref sync pattern means the expanded/mini player doesn't cascade re-renders. |
| Zustand selectors are fine-grained | Store consumers subscribe to atomic values, not full objects. |
| Lazy loading | All non-critical page components use `React.lazy` + `Suspense`. |
| `react-toastify` import | Imported globally in `main.tsx` (full CSS bundle) — minor, but could be lazy-loaded. |

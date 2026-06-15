# Al Quran — AGENTS.md

## Stack

- **React 19** + **TypeScript 6** + **Vite 8**
- **Tailwind CSS v4** (no `tailwind.config.js`; theme in `src/index.css` `@theme`)
- **pnpm** only (has `pnpm-lock.yaml`; do NOT use npm/yarn)
- **Biome** for linting + formatting

## Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | `tsc -b && vite build` — typecheck first, then build |
| `pnpm preview` | Preview production build |
| `pnpm lint-format` | Biome check + auto-fix |
| `pnpm typecheck` | `tsc --noEmit` |

Always run `pnpm lint-format && pnpm typecheck` before committing.

## Architecture

- **SPA** with React Router v7. Routes: `/` (splash), `/surah`, `/surah/:id`, `/para`, `/para/:id`, `/settings`, `/about`, `/credits`, `/donation`. Catch-all redirects to `/surah`.
- **Data source v4**: `cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v4/surah/verse/{id}.min.json` (id 1–114, fetched in parallel) — cached in **IndexedDB** (`idb` lib, `src/lib/db.ts`). Per-surah audio, tafsir, and juz data fetched on demand from the same base..
- **Audio**: `cdn.islamic.network/quran/audio/128/ar.alafasy/{totalNumber}.mp3`. Workbox runtime cache (30-day, max 10 entries). Audio URLs also available via v4 API per-verse `audio.primary` field.
- **PWA**: `vite-plugin-pwa` with `registerType: "prompt"`. SW in `main.tsx`. Install prompt + update banner components.
- **Responsive layout**: Desktop sidebar (`md:block`), mobile bottom nav (`md:hidden`).
- **Dark mode**: via `.dark` class on ancestor. CSS custom properties.

## Key conventions

- **Tailwind v4**: Use `@theme` in CSS, not JS. No `@apply`.
- **Lazy loading**: All page components via `React.lazy` + `Suspense`.
- **AudioPlayer**: Context-based (`AudioPlayerContext.tsx`). Use `buildPlaylistFromSurah()` + `setPlaylist()` to play. Hook: `useAudioPlayer()`.
- **UI**: shadcn/ui with `base-nova` preset (Base UI primitives). All buttons use `<Button>` from `@/components/ui/button`.
- **Button variants**: `secondary-ghost` (transparent, hover-primary-tint), `gradient` (primary→secondary gradient), `white-ghost` (white-on-dark), plus default shadcn ones.
- **Utility classes** in `index.css`: `.glass`, `.glass-strong`, `.text-gradient`, `.text-gradient-gold`, `.card-hover`, `.page-enter`.
- **Animations** in `@theme`: `animate-slide-up`, `animate-fade-in`, `animate-scale-in`, etc.
- **Custom scrollbar** defined in `index.css` (thin, themed by mode).

## Data flow

1. Splash fetches all surah data from API → cached in IndexedDB (`surahs` store)
2. `useSurahs()` → reads from IDB (fetches on miss)
3. `useSurah(id)` → reads single surah from cache
4. `usePara(id)` → fetches juz/para data from v4 API `/v4/juz/verse/{id}.json`
5. Settings "Refresh" clears cache + re-fetches

## Build & Deploy

- **Output**: `dist/`
- **Docker**: Multi-stage `node:24-alpine`, serves via `serve` on port 3000
- **SPA routing**: `public/_redirects` has `/* /index.html 200`
- **`robots.txt`**: allows all crawlers

## i18n / Locale

- **System**: `src/i18n/LocaleContext.tsx` — React context with `useLocale()` hook returning `{ t, locale, setLocale }`.
- **Translation files**: `src/i18n/en.json` (English), `src/i18n/bn.json` (Bengali). Keys use dot notation like `"zakat.pageTitle"`.
- **`t(key, params?)`**: Resolves key from current locale bundle, interpolates `{param}` placeholders.
- **Locale setting**: Stored in `settings.locale` (type `"en" | "bn"`). `LocaleProvider` in `App.tsx` wraps root. `LocaleSync` syncs setting → context.
- **Pattern**: Import `useLocale` at top of page, destructure `{ t }`, replace strings with `t("namespace.key")`.
- **Available locales**: English (`en`), Bengali (`bn`).

## Data Export

- **Page**: `/data-export` — collects all IndexedDB stores via `getAllFromStore` / `getKeys`, serializes to JSON, triggers file download.
- **All 17 stores exported**: surah-verses, surah-list, surah-audio, surah-tafsir, juz-verses, juz-audio, juz-tafsir, bookmarks, settings, duas, prayerSettings, hadith, worship-records, prayer-records, quran-progress, sadaqah-records, reading-goals.
- Uses `STORE_NAMES` from `src/lib/cache.ts` (now exported). Single-key stores ("all") dump all values; multi-key stores dump key-value pairs.

## Form Control Standardization (Completed Jun 2026)

All form controls have been standardized to shadcn components:

- **`input.tsx`**: `rounded-xl`, `h-10`, `bg-muted`, `px-4 py-2.5`, `text-sm` — dark mode uses app's custom tokens (`dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary`).
- **`select.tsx`** SelectTrigger: Same defaults as Input (rounded-xl, h-10, bg-muted, etc.) — redundant class overrides stripped from all usage sites.
- **`input-group.tsx`**: Uses `<fieldset>` (a11y-compliant) instead of `<div role="group">`. Container matches Input styling. `<InputGroupInput>` strips border/background (container handles it). Applied to Surah page search filter.
- **All native `<input>` replaced** with shadcn `<Input>` across 13+ files.
- **All native `<select>` replaced** with shadcn `<Select>` across all feature pages (AsmaUlHusna, SadaqahTracker, ZakatCalculator, ReadingGoals, HijriCalendar, FastingCalendar).
- **Range inputs** (`<input type="range">`) kept native — shadcn Input doesn't support range type.
- **Search modal** (`Search.tsx`) uses InputGroup for icon + input; clear + Esc buttons kept outside.

## Expansion areas

- Bookmark/share buttons in `src/components/pages/Ayahs/Ayahs.tsx` are placeholders (no logic wired)
- No Islamic features beyond Quran/paras — no prayer times, Islamic calendar, dua collection, qibla finder, etc.

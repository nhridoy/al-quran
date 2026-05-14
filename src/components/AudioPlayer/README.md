# AudioPlayer

A full-featured Quran audio player component built with React + Tailwind CSS.

## Features

- Circular mini player with progress ring
- Expanded player: desktop bottom bar + mobile fullscreen view
- Playlist drawer grouped by surah
- Shuffle, repeat (all/one), seek, volume controls
- Animations: slide-up/fade-in entry, slide-down/fade-out exit
- Persistent volume (localStorage)

## Requirements

- **React** 18+
- **Tailwind CSS** 3+ or 4+

## Setup

### 1. Copy the folder

Copy the entire `AudioPlayer` folder into your project's components directory.

### 2. Add Tailwind theme values

Add these to your Tailwind config:

**Tailwind v4** (`app.css` with `@theme`):
```css
@theme {
  --color-primary: #2e0d8a;
  --color-secondary: #9345f2;
  --color-secondaryLight: #faf8fc;
  --animate-slide-up: slideUp 0.3s ease-out;
  --animate-fade-in: fadeIn 0.2s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

**Tailwind v3** (`tailwind.config.js`):
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#2e0d8a",
        secondary: "#9345f2",
        secondaryLight: "#faf8fc",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
      },
    },
  },
};
```

> The player uses `animate-[keyframes_duration_timing]` arbitrary values (Tailwind v3.3+). If you're on an older version, define the animations in your config and replace the inline classes.

## Usage

### Basic setup

Wrap your app with `AudioPlayerProvider` and render `<AudioPlayer />`:

```tsx
import AudioPlayer, { AudioPlayerProvider } from "./components/AudioPlayer";

function App() {
  return (
    <AudioPlayerProvider>
      <YourRoutes />
      <AudioPlayer />
    </AudioPlayerProvider>
  );
}
```

By default the player starts minimized when you play an ayah. Pass `expandOnPlay` to change this:

```tsx
<AudioPlayerProvider expandOnPlay>
  {/* player will expand immediately on play */}
  <AudioPlayer />
</AudioPlayerProvider>
```

### Building a playlist and playing

```tsx
import { buildPlaylistFromSurah, useAudioPlayer } from "./components/AudioPlayer";

function SurahPage({ surah }) {
  const { setPlaylist, currentTrack, isPlaying, togglePlay } = useAudioPlayer();

  const handlePlayAyah = (ayahNumber: number) => {
    const tracks = buildPlaylistFromSurah(surah);
    setPlaylist(tracks, ayahNumber - 1);
  };

  return (
    <button onClick={() => handlePlayAyah(1)}>Play</button>
  );
}
```

### Playing a single track

```tsx
const { playTrack } = useAudioPlayer();

playTrack({
  id: "1-1",
  surahNo: 1,
  ayahNumber: 1,
  totalNumber: 1,
  surahName: "الفاتحة",
  enName: "Al-Fatiha",
  arabicText: "...",
  translationText: "...",
  transliterationText: "...",
  audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
});
```

## API

### `Track`

```ts
interface Track {
  id: string;              // unique, e.g. "{surahNo}-{ayahNumber}"
  surahNo: number;
  ayahNumber: number;      // 1-based within surah
  totalNumber: number;     // global ayah number (1-6236)
  surahName: string;       // arabic name
  enName: string;          // english transliterated name
  arabicText: string;
  translationText: string;
  transliterationText: string;
  audioUrl: string;        // mp3 source
}
```

### `useAudioPlayer()`

| Return         | Description                                |
|----------------|--------------------------------------------|
| `currentTrack` | Currently playing `Track` or `null`        |
| `isPlaying`    | Whether audio is playing                   |
| `isExpanded`   | Whether expanded player is open            |
| `currentTime`  | Current playback time in seconds           |
| `duration`     | Total duration of current track            |
| `volume`       | Current volume (0-1)                       |
| `isShuffled`   | Whether shuffle is active                  |
| `repeatMode`   | `"none"` \| `"all"` \| `"one"`            |
| `playlist`     | Array of `Track`                           |
| `showPlaylist` | Whether playlist drawer is open            |
| `playTrack`    | `(track: Track) => void` — play one track  |
| `togglePlay`   | Play/pause                                 |
| `next`         | Next track                                 |
| `prev`         | Previous track (or restart if > 3s in)     |
| `seek`         | `(seconds: number) => void`                |
| `setVolume`    | `(vol: number) => void`                    |
| `toggleShuffle`| Toggle shuffle                             |
| `cycleRepeat`  | Cycle: none → all → one → none             |
| `setPlaylist`  | `(tracks: Track[], startIndex?: number)`   |
| `expand`       | Open expanded player                       |
| `minimize`     | Close expanded player                      |
| `formatTime`   | `(seconds: number) => string` ("1:23")     |

### `buildPlaylistFromSurah(surahData)`

Builds a `Track[]` from a surah object. Expected shape:

```ts
{
  no: number;              // surah number
  name: string;            // arabic name
  enName: string;          // english transliterated name
  verses: Array<{
    numberInSurah: number; // 1-based ayah number within surah
    totalNumber: number;   // global ayah number
    text: string;
    enText: string;
    enTextTransliteration: string;
    audioSecond?: string;  // optional audio URL override
  }>;
}
```

### `AudioPlayerProvider`

| Prop           | Type      | Default | Description                                        |
|----------------|-----------|---------|----------------------------------------------------|
| `children`     | `ReactNode` | —     | App tree                                           |
| `expandOnPlay` | `boolean` | `false` | If `true`, the expanded player opens automatically when `setPlaylist` is called |

### `getAudioUrl(totalNumber: number)`

Constructs the default audio URL: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/{totalNumber}.mp3`

## File structure

```
AudioPlayer/
├── AudioPlayerContext.tsx  — React context, provider, hooks, utilities
├── ExpandedPlayer.tsx      — Desktop bar + mobile fullscreen
├── MiniPlayer.tsx          — Circular FAB with progress ring
├── PlaylistDrawer.tsx      — Slide-up playlist by surah
├── index.tsx               — Default export + re-exports
├── types.ts                — Track, RepeatMode, context types
└── README.md
```

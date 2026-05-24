import { getAudioUrl } from "../components/features/AudioPlayer";

const CACHE_NAME = "quran-audio-cache";

const ESTIMATED_AYAH_SIZE = 50000;

export async function getCacheSize(): Promise<number> {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  let total = 0;
  for (const req of keys) {
    const res = await cache.match(req);
    if (res && res.type !== "opaque") {
      const blob = await res.blob();
      total += blob.size;
    } else {
      total += ESTIMATED_AYAH_SIZE;
    }
  }
  return total;
}

export async function getCachedUrls(): Promise<Set<string>> {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  return new Set(keys.map((r) => r.url));
}

export async function isAudioCached(
  totalNumber: number,
  qariBase?: string,
): Promise<boolean> {
  const url = getAudioUrl(totalNumber, qariBase);
  const cache = await caches.open(CACHE_NAME);
  const match = await cache.match(url);
  return !!match;
}

export async function downloadAyahAudio(
  totalNumber: number,
  qariBase?: string,
): Promise<boolean> {
  const url = getAudioUrl(totalNumber, qariBase);
  const cache = await caches.open(CACHE_NAME);
  try {
    const res = await fetch(url, { mode: "no-cors" });
    await cache.put(url, res);
    return true;
  } catch {
    return false;
  }
}

export async function removeFromCache(
  verses: { totalNumber: number }[],
  qariBase?: string,
): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  for (const v of verses) {
    const url = getAudioUrl(v.totalNumber, qariBase);
    await cache.delete(url);
  }
}

export async function clearAllAudio(): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  for (const req of keys) {
    await cache.delete(req);
  }
}

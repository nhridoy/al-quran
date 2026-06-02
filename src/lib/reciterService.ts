import {
  cacheAllAudioForReciter,
  cacheAllJuz,
  cacheAllJuzAudioForReciter,
  cacheAllJuzTafsirFor,
  cacheAllTafsirFor,
} from "@/lib/batchCache";
import { confirm } from "@/lib/confirm";
import { clearAudioCache, clearCache, clearTafsirCache } from "@/lib/db";
import { removeFromCache } from "@/lib/downloadManager";
import { useDownloadsStore } from "@/store/downloads";

export async function handleReciterChange(
  oldReciterId: string,
  newReciterId: string,
): Promise<void> {
  const oldDownloads = useDownloadsStore
    .getState()
    .items.filter((d) => d.qariId === oldReciterId);
  if (oldDownloads.length > 0) {
    const result = await confirm({
      title: "Delete old reciter's downloads?",
      message: `You have ${oldDownloads.length} surah(s) downloaded for the old reciter. Delete cached audio for the old reciter?`,
      confirmText: "Delete",
      cancelText: "Keep",
    });
    if (result) {
      const urls = oldDownloads.flatMap((d) => d.cachedUrls);
      await removeFromCache(urls);
      for (const d of oldDownloads) {
        await useDownloadsStore.getState().remove(d.surahNo, d.qariId);
      }
    }
  }
  await clearAudioCache();
  await Promise.all([
    cacheAllAudioForReciter(newReciterId),
    cacheAllJuzAudioForReciter(newReciterId),
  ]);
}

export async function handleTafsirChange(
  _oldTafsirId: string,
  newTafsirId: string,
): Promise<void> {
  await clearTafsirCache();
  await Promise.all([
    cacheAllTafsirFor(newTafsirId),
    cacheAllJuzTafsirFor(newTafsirId),
  ]);
}

export async function handleRefresh(
  reciterId: string,
  tafsirId: string,
  refreshSurahs: () => Promise<void>,
): Promise<void> {
  await clearCache();
  await refreshSurahs();
  await cacheAllJuz();
  await Promise.all([
    cacheAllAudioForReciter(reciterId),
    cacheAllJuzAudioForReciter(reciterId),
    cacheAllTafsirFor(tafsirId),
    cacheAllJuzTafsirFor(tafsirId),
  ]);
}

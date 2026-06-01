import { PauseIcon } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoPlayCircleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Header } from "../../components/common/Header/Header";
import { useSurahs } from "../../hooks/useSurahs";
import { confirm } from "../../lib/confirm";
import { getAudioData, mergeAudioWithSurah } from "../../lib/db";
import {
  clearAllAudio,
  downloadAudioWithFallback,
  getCacheSize,
  removeFromCache,
} from "../../lib/downloadManager";
import { useDownloadsStore } from "../../store/downloads";
import { useSettings } from "../../store/settings";
import type { SurahData } from "../../types";

interface SurahDownloadCardProps {
  surah: SurahData;
  reciterId: string;
  onDownloaded?: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const SurahDownloadCard = memo(
  ({ surah, reciterId, onDownloaded }: SurahDownloadCardProps) => {
    const addItem = useDownloadsStore((s) => s.add);
    const updateItem = useDownloadsStore((s) => s.update);
    const removeItem = useDownloadsStore((s) => s.remove);
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const cancelled = useRef(false);
    const paused = useRef(false);

    const downloadItem = useDownloadsStore((s) =>
      s.items.find((i) => i.surahNo === surah.no && i.qariId === reciterId),
    );
    const isDownloaded = downloadItem?.progress === 100;
    const isPaused =
      !downloading &&
      !!downloadItem &&
      downloadItem.progress > 0 &&
      downloadItem.progress < 100;

    const displayProgress = downloading
      ? progress
      : (downloadItem?.progress ?? 0);

    const runDownload = useCallback(async () => {
      cancelled.current = false;
      paused.current = false;
      setDownloading(true);
      setProgress(0);
      const total = surah.verses.length;
      const storeItems = useDownloadsStore.getState().items;
      const existing = storeItems.find(
        (i) => i.surahNo === surah.no && i.qariId === reciterId,
      );
      if (!existing) {
        addItem({
          surahNo: surah.no,
          qariId: reciterId,
          surahName: surah.enName,
          totalAyahs: total,
          downloadedAyahs: 0,
          progress: 0,
          cachedUrls: [],
        });
      }

      const audioUrls = await getAudioData(reciterId, surah.no);
      const merged = await mergeAudioWithSurah(surah, audioUrls);

      let downloadedCount = 0;
      const cached: string[] = existing?.cachedUrls ?? [];
      for (let i = 0; i < merged.verses.length; i++) {
        if (cancelled.current || paused.current) break;
        const verse = merged.verses[i];
        if (!verse.audio?.primary) continue;
        const { primary, secondary, tertiary, alternative } = verse.audio;
        const urls = [primary, secondary, tertiary, alternative].filter(
          (u, idx, arr) => u && arr.indexOf(u) === idx,
        );
        const result = await downloadAudioWithFallback(urls);
        if (result) {
          downloadedCount++;
          if (!cached.includes(result)) cached.push(result);
        }
        const pct = Math.round(((i + 1) / total) * 100);
        setProgress(pct);
      }
      setDownloading(false);

      const finalPct = cancelled.current
        ? 0
        : Math.round((downloadedCount / total) * 100);

      if (cancelled.current) {
        await removeFromCache(cached);
        await removeItem(surah.no, reciterId);
      } else {
        updateItem(surah.no, reciterId, {
          downloadedAyahs: Math.round((finalPct / 100) * total),
          progress: finalPct,
          cachedUrls: cached,
        });
      }
      if (!paused.current && !cancelled.current) {
        onDownloaded?.();
      }
    }, [surah, reciterId, addItem, updateItem, removeItem, onDownloaded]);

    const handlePause = useCallback(() => {
      paused.current = true;
    }, []);

    const handleCancel = useCallback(() => {
      cancelled.current = true;
    }, []);

    const handleDelete = useCallback(async () => {
      const urls = downloadItem?.cachedUrls ?? [];
      if (urls.length === 0) {
        const audioUrls = await getAudioData(reciterId, surah.no);
        const merged = await mergeAudioWithSurah(surah, audioUrls);
        for (const v of merged.verses) {
          if (!v.audio) continue;
          const { primary, secondary, tertiary, alternative } = v.audio;
          urls.push(
            ...[primary, secondary, tertiary, alternative].filter(
              (u, idx, arr) => u && arr.indexOf(u) === idx,
            ),
          );
        }
      }
      await removeFromCache(urls);
      await removeItem(surah.no, reciterId);
      onDownloaded?.();
    }, [surah, reciterId, downloadItem, removeItem, onDownloaded]);

    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-all hover:bg-surface-alt dark:border-dark-border dark:bg-dark-surface-card dark:hover:bg-dark-surface-alt">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 to-secondary/10 text-xs font-bold text-primary dark:from-primary/20 dark:to-secondary/20 dark:text-secondary-light">
          {surah.no}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate">
            <span className="font-arabic text-lg text-text-primary dark:text-dark-text-primary">
              {surah.name}
            </span>
            <span className="ml-2 text-xs text-text-muted dark:text-dark-text-muted">
              {surah.enName}
            </span>
          </p>
          <p className="mt-0.5 truncate text-xs text-text-muted dark:text-dark-text-muted">
            {surah.numberOfAyahs} verses
          </p>
          {displayProgress > 0 && displayProgress < 100 && (
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt dark:bg-dark-surface-alt">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-secondary transition-all"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          )}
        </div>
        <div className="shrink-0">
          {isDownloaded ? (
            <Button
              onClick={handleDelete}
              variant="danger"
              size="icon"
              className="rounded-lg"
              title="Remove download"
              aria-label="Remove download"
            >
              <FiTrash2 className="text-sm" />
            </Button>
          ) : isPaused ? (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-warning">
                {displayProgress}%
              </span>
              <Button
                onClick={runDownload}
                variant="secondary-ghost"
                size="icon-sm"
                className="rounded-lg text-text-muted hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-secondary-light"
                title="Resume download"
                aria-label="Resume download"
              >
                <IoPlayCircleOutline className="text-sm" />
              </Button>
              <Button
                onClick={handleCancel}
                variant="danger"
                size="icon-sm"
                className="rounded-lg"
                title="Cancel download"
                aria-label="Cancel download"
              >
                <FiTrash2 className="text-xs" />
              </Button>
            </div>
          ) : downloading ? (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-secondary">
                {displayProgress}%
              </span>
              <Button
                onClick={handlePause}
                variant="secondary-ghost"
                size="icon-sm"
                className="rounded-lg text-text-muted hover:bg-warning/10 hover:text-warning dark:hover:bg-warning/20"
                title="Pause download"
                aria-label="Pause download"
              >
                <PauseIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
              <Button
                onClick={handleCancel}
                variant="danger"
                size="icon-sm"
                className="rounded-lg"
                title="Cancel download"
                aria-label="Cancel download"
              >
                <FiTrash2 className="text-xs" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={runDownload}
              variant="secondary-ghost"
              size="icon"
              className="rounded-lg text-text-muted hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-secondary-light"
              title="Download"
              aria-label="Download"
            >
              <IoPlayCircleOutline className="text-lg" />
            </Button>
          )}
        </div>
      </div>
    );
  },
);

export default function DownloadsPage() {
  const { surahList, loading } = useSurahs();
  const reciterId = useSettings((s) => s.reciterId);
  const loadDownloads = useDownloadsStore((s) => s.load);
  const [search, setSearch] = useState("");
  const [cacheSize, setCacheSize] = useState(0);

  const refreshCacheSize = useCallback(async () => {
    const size = await getCacheSize();
    setCacheSize(size);
  }, []);

  useEffect(() => {
    loadDownloads();
    refreshCacheSize();
  }, [loadDownloads, refreshCacheSize]);

  const filtered = useMemo(
    () =>
      surahList.filter(
        (s) =>
          s.enName.toLowerCase().includes(search.toLowerCase()) ||
          s.name.includes(search) ||
          `${s.no}` === search,
      ),
    [surahList, search],
  );

  const handleClearAll = useCallback(async () => {
    const ok = await confirm({
      title: "Clear all downloads?",
      message: "This will remove all cached audio files.",
      confirmText: "Clear All",
    });
    if (!ok) return;
    await clearAllAudio();
    const storeItems = useDownloadsStore.getState().items;
    for (const item of storeItems) {
      await useDownloadsStore.getState().remove(item.surahNo, item.qariId);
    }
    await refreshCacheSize();
  }, [refreshCacheSize]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header head="Downloads" />
        <div className="mx-4 space-y-3 md:mx-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={`skel-${n}`}
              className="h-16 animate-pulse rounded-xl bg-surface-alt dark:bg-dark-surface-alt"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header head="Downloads" />
      <div className="mx-4 pb-8 md:mx-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
              Offline Downloads
            </h2>
            <p className="text-sm text-text-muted dark:text-dark-text-muted">
              Cache: {formatBytes(cacheSize)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {cacheSize > 0 && (
              <Button
                onClick={handleClearAll}
                variant="danger"
                className="gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
              >
                <FiTrash2 />
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surahs..."
            className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-secondary dark:border-dark-border dark:bg-dark-surface-alt dark:text-dark-text-primary"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((surah) => (
            <SurahDownloadCard
              key={surah.no}
              surah={surah}
              reciterId={reciterId}
              onDownloaded={refreshCacheSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

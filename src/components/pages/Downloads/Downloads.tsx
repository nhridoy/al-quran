import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoPlayCircleOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { QARIS } from "../../../data/qaris";
import { useSurahs } from "../../../hooks/useSurahs";
import {
  clearAllAudio,
  downloadAyahAudio,
  getCacheSize,
  isAudioCached,
  removeFromCache,
} from "../../../lib/downloadManager";
import { useDownloadsStore } from "../../../store/downloads";
import { useSettings } from "../../../store/settings";
import type { SurahData } from "../../../types";
import { Header } from "../../Header/Header";

interface SurahDownloadCardProps {
  surah: SurahData;
  qariId: string;
  qariBase?: string;
  onDownloaded?: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SurahDownloadCard({
  surah,
  qariId,
  qariBase,
  onDownloaded,
}: SurahDownloadCardProps) {
  const addItem = useDownloadsStore((s) => s.add);
  const updateItem = useDownloadsStore((s) => s.update);
  const removeItem = useDownloadsStore((s) => s.remove);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelled = useRef(false);
  const paused = useRef(false);

  const downloadItem = useDownloadsStore((s) =>
    s.items.find((i) => i.surahNo === surah.no && i.qariId === qariId),
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
    if (!qariBase) return;
    cancelled.current = false;
    paused.current = false;
    setDownloading(true);
    setProgress(0);
    const total = surah.verses.length;
    const storeItems = useDownloadsStore.getState().items;
    const existing = storeItems.find(
      (i) => i.surahNo === surah.no && i.qariId === qariId,
    );
    if (!existing) {
      addItem({
        surahNo: surah.no,
        qariId,
        surahName: surah.enName,
        totalAyahs: total,
        downloadedAyahs: 0,
        progress: 0,
      });
    }

    for (let i = 0; i < surah.verses.length; i++) {
      if (cancelled.current || paused.current) break;
      const verse = surah.verses[i];
      const cached = await isAudioCached(verse.totalNumber, qariBase);
      if (!cached) {
        await downloadAyahAudio(verse.totalNumber, qariBase);
      }
      const pct = Math.round(((i + 1) / total) * 100);
      setProgress(pct);
    }
    setDownloading(false);

    let cachedCount = 0;
    if (paused.current) {
      for (const v of surah.verses) {
        if (await isAudioCached(v.totalNumber, qariBase)) cachedCount++;
      }
    }
    const finalPct = paused.current
      ? Math.round((cachedCount / total) * 100)
      : 100;

    if (cancelled.current) {
      await removeFromCache(surah.verses, qariBase);
      await removeItem(surah.no, qariId);
    } else {
      updateItem(surah.no, qariId, {
        downloadedAyahs: Math.round((finalPct / 100) * total),
        progress: finalPct,
      });
    }
    if (!paused.current && !cancelled.current) {
      onDownloaded?.();
    }
  }, [surah, qariBase, qariId, addItem, updateItem, removeItem, onDownloaded]);

  const handlePause = useCallback(() => {
    paused.current = true;
  }, []);

  const handleCancel = useCallback(() => {
    cancelled.current = true;
  }, []);

  const handleDelete = useCallback(async () => {
    await removeFromCache(surah.verses, qariBase);
    await removeItem(surah.no, qariId);
    onDownloaded?.();
  }, [surah, qariBase, qariId, removeItem, onDownloaded]);

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
          <button
            type="button"
            onClick={handleDelete}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            title="Remove download"
          >
            <FiTrash2 className="text-sm" />
          </button>
        ) : isPaused ? (
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-warning">
              {displayProgress}%
            </span>
            <button
              type="button"
              onClick={runDownload}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-all hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-secondary-light"
              title="Resume download"
            >
              <IoPlayCircleOutline className="text-sm" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              title="Cancel download"
            >
              <FiTrash2 className="text-xs" />
            </button>
          </div>
        ) : downloading ? (
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-secondary">
              {displayProgress}%
            </span>
            <button
              type="button"
              onClick={handlePause}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-all hover:bg-warning/10 hover:text-warning dark:hover:bg-warning/20"
              title="Pause download"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              title="Cancel download"
            >
              <FiTrash2 className="text-xs" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={runDownload}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-all hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-secondary-light"
            title="Download"
          >
            <IoPlayCircleOutline className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function DownloadsPage() {
  const { surahList, loading } = useSurahs();
  const qariId = useSettings((s) => s.qariId);
  const qariBase = QARIS.find((q) => q.id === qariId)?.baseUrl;
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
    const result = await Swal.fire({
      title: "Clear all downloads?",
      text: "This will remove all cached audio files.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b5e80",
      confirmButtonText: "Clear All",
      background: "#1a1228",
      color: "#f0ecf8",
    });
    if (!result.value) return;
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
              <button
                type="button"
                onClick={handleClearAll}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FiTrash2 />
                Clear All
              </button>
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
              qariId={qariId}
              qariBase={qariBase}
              onDownloaded={refreshCacheSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

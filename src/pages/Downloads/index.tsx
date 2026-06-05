import { useCallback, useEffect, useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { SkeletonLoader } from "@/components/common/SkeletonLoader/SkeletonLoader";
import SurahDownloadCard, {
  formatBytes,
} from "@/components/pages/Downloads/SurahDownloadCard";
import { Button } from "@/components/ui/button";
import { useSurahs } from "@/hooks/useSurahs";
import { confirm } from "@/lib/confirm";
import { clearAllAudio, getCacheSize } from "@/lib/downloadManager";
import { useDownloadsStore } from "@/store/downloads";
import { useSettings } from "@/store/settings";

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
      <PageShell head="Downloads">
        <SkeletonLoader count={6} height="h-16" />
      </PageShell>
    );
  }

  return (
    <PageShell head="Downloads">
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
    </PageShell>
  );
}

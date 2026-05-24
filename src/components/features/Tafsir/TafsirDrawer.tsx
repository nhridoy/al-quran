import { type TafsirId, useTafsir } from "../../../hooks/useTafsir";
import Drawer from "../../common/Drawer/Drawer";

interface TafsirDrawerProps {
  open: boolean;
  onClose: () => void;
  chapterNumber: number;
  tafsirId?: TafsirId;
  surahName?: string;
}

function TafsirContent({ html }: { html: string }) {
  return (
    <div
      className="tafsir-content prose-sm prose prose-headings:text-text-primary prose-headings:font-semibold prose-p:text-text-secondary prose-strong:text-text-primary max-w-none leading-relaxed dark:prose-headings:text-dark-text-primary dark:prose-p:text-dark-text-secondary dark:prose-strong:text-dark-text-primary [&_h1]:text-lg [&_h2]:text-base [&_h2]:font-semibold [&_p]:mb-3 [&_p]:text-sm [&_ul]:mb-3 [&_li]:text-sm"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: tafsir text from trusted quran.com API
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function TafsirDrawer({
  open,
  onClose,
  chapterNumber,
  tafsirId = 169,
  surahName,
}: TafsirDrawerProps) {
  const { data, loading, error } = useTafsir(chapterNumber, tafsirId);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      direction="bottom"
      className="bg-surface dark:bg-dark-surface-card"
    >
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
              Tafsir
            </h2>
            {surahName && (
              <p className="text-sm text-text-muted dark:text-dark-text-muted">
                {surahName} &mdash; {data?.resourceName ?? ""}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-secondary transition-all hover:bg-surface-alt dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={`skel-${n}`}
                className="h-4 animate-pulse rounded bg-surface-alt dark:bg-dark-surface-alt"
                style={{ width: `${60 + (n - 1) * 15}%` }}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            Failed to load tafsir.
          </div>
        )}

        {data && !loading && <TafsirContent html={data.text} />}
      </div>
    </Drawer>
  );
}

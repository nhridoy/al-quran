import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useTafsir } from "../../../hooks/useTafsir";

interface TafsirDrawerProps {
  open: boolean;
  onClose: () => void;
  chapterNumber: number;
  tafsirId?: string;
  surahName?: string;
}

function TafsirContent({ html }: { html: string }) {
  return (
    <div
      className="tafsir-content prose-sm prose prose-headings:text-text-primary prose-headings:font-semibold prose-p:text-text-secondary prose-strong:text-text-primary max-w-none leading-relaxed dark:prose-headings:text-dark-text-primary dark:prose-p:text-dark-text-secondary dark:prose-strong:text-dark-text-primary [&_h1]:text-lg [&_h2]:text-base [&_h2]:font-semibold [&_p]:mb-3 [&_p]:text-sm [&_ul]:mb-3 [&_li]:text-sm"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: tafsir text from trusted CDN API
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function TafsirDrawer({
  open,
  onClose,
  chapterNumber,
  tafsirId,
  surahName,
}: TafsirDrawerProps) {
  const { data, loading, error } = useTafsir(chapterNumber, tafsirId);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh]">
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
                Tafsir
              </h2>
              {surahName && (
                <p className="text-sm text-text-muted dark:text-dark-text-muted">
                  {surahName} &mdash; {data?.tafsirName ?? ""}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close"
            >
              <XIcon />
            </Button>
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <Skeleton
                  key={`skel-${n}`}
                  className="h-4"
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
      </SheetContent>
    </Sheet>
  );
}

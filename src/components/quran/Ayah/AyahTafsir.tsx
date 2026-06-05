import DOMPurify from "dompurify";
import { BiBook } from "react-icons/bi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AyahTafsirProps {
  loading: boolean;
  data: { text: string } | null;
}

export default function AyahTafsir({ loading, data }: AyahTafsirProps) {
  return (
    <Accordion className="mt-2">
      <AccordionItem value="tafsir" className="border-0">
        <AccordionTrigger className="flex w-full items-center justify-between rounded-xl border border-border bg-surface-alt/50 px-3 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-surface-alt hover:no-underline dark:border-dark-border dark:bg-dark-surface-alt/50 dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt">
          <span className="flex items-center gap-1.5">
            <BiBook className="text-sm" />
            Show Tafsir
          </span>
        </AccordionTrigger>
        <AccordionContent className="mt-1 overflow-hidden rounded-xl border border-border bg-surface-alt/30 dark:border-dark-border dark:bg-dark-surface-alt/30">
          {loading ? (
            <div className="space-y-2 p-3">
              <div
                className="h-3 animate-pulse rounded bg-surface-alt dark:bg-dark-surface-alt"
                style={{ width: "80%" }}
              />
              <div
                className="h-3 animate-pulse rounded bg-surface-alt dark:bg-dark-surface-alt"
                style={{ width: "60%" }}
              />
              <div
                className="h-3 animate-pulse rounded bg-surface-alt dark:bg-dark-surface-alt"
                style={{ width: "70%" }}
              />
            </div>
          ) : data ? (
            <div className="prose-sm prose max-w-none p-3 text-sm leading-relaxed text-text-secondary dark:prose-invert dark:text-dark-text-secondary">
              <div
                // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized via DOMPurify
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data.text),
                }}
              />
            </div>
          ) : (
            <p className="p-3 text-xs text-text-muted dark:text-dark-text-muted">
              Tafsir not available for this verse
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

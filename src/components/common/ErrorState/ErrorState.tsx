import { BiErrorCircle, BiRefresh } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center gap-4 card-surface p-8 text-center">
      <BiErrorCircle className="text-4xl text-red-400" />
      <p className="text-sm text-text-muted">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="gradient"
          className="gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
        >
          <BiRefresh className="text-base" />
          {t("error.tryAgain")}
        </Button>
      )}
    </div>
  );
}

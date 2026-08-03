import { HiOutlineTrash } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import SettingCard from "@/components/pages/Settings/SettingCard";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";

interface DataSettingsProps {
  loading: boolean;
  onRefresh: () => void;
}

export default function DataSettings({
  loading,
  onRefresh,
}: DataSettingsProps) {
  const { t } = useLocale();

  return (
    <SettingCard
      icon={
        <IoSettingsOutline className="text-lg text-primary dark:text-secondary-light" />
      }
      title={t("settings.dataSettings")}
      description={t("settings.dataSettingsDesc")}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HiOutlineTrash className="text-lg text-text-muted dark:text-dark-text-muted" />
          <div>
            <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
              {t("settings.cachedData")}
            </p>
            <p className="text-xs text-text-muted dark:text-dark-text-muted">
              {t("settings.cachedDataDesc")}
            </p>
          </div>
        </div>
        <Button
          onClick={onRefresh}
          disabled={loading}
          variant="gradient"
          className="rounded-xl px-4 py-2 text-sm font-semibold"
        >
          {loading ? t("settings.refreshing") : t("settings.refresh")}
        </Button>
      </div>
    </SettingCard>
  );
}

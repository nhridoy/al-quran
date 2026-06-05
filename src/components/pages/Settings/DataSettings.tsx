import { HiOutlineTrash } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import SettingCard from "@/components/pages/Settings/SettingCard";
import { Button } from "@/components/ui/button";

interface DataSettingsProps {
  loading: boolean;
  onRefresh: () => void;
}

export default function DataSettings({
  loading,
  onRefresh,
}: DataSettingsProps) {
  return (
    <SettingCard
      icon={
        <IoSettingsOutline className="text-lg text-primary dark:text-secondary-light" />
      }
      title="Data Settings"
      description="Clear and refresh cached Quran data"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HiOutlineTrash className="text-lg text-text-muted dark:text-dark-text-muted" />
          <div>
            <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
              Cached Data
            </p>
            <p className="text-xs text-text-muted dark:text-dark-text-muted">
              Quran verses and surah data
            </p>
          </div>
        </div>
        <Button
          onClick={onRefresh}
          disabled={loading}
          variant="gradient"
          className="rounded-xl px-4 py-2 text-sm font-semibold"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </SettingCard>
  );
}

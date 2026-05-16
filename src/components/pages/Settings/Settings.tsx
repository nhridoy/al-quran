import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useSurahs } from "../../../hooks/useSurahs";
import { Header } from "../../Header/Header";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const { refresh } = useSurahs();

  const handleUpdate = () => {
    Swal.fire({
      title: "Refresh Data?",
      text: "This will clear the cached data and fetch fresh content.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9345f2",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, refresh!",
      background: "#1a1228",
      color: "#f0ecf8",
    }).then(async (result) => {
      if (result.value) {
        setLoading(true);
        try {
          await refresh();
          toast.success("Data refreshed successfully!");
        } catch {
          toast.error("Failed to refresh data");
        }
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen">
      <Header head="Settings" />
      <div className="mx-4 space-y-4 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Settings
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Manage application data and preferences
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card">
          <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
              <IoSettingsOutline className="text-lg text-primary dark:text-secondary-light" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                Data Settings
              </h3>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                Clear and refresh cached Quran data
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4">
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
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all ${
                loading
                  ? "cursor-not-allowed bg-text-muted"
                  : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              }`}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </div>
  );
}

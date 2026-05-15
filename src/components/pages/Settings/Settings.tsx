import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useSurahs } from "../../../hooks/useSurahs";
import { Header } from "../../Header/Header";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const { refresh } = useSurahs();

  const handleUpdate = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.value) {
        setLoading(true);
        try {
          await refresh();
          toast.success("Data has been refreshed!");
        } catch {
          toast.error("Failed to refresh data");
        }
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 left-0 z-10 w-full bg-white">
        <Header head="Settings" />
      </div>
      <div className="grid grid-rows-5">
        <div className="flex items-center justify-center row-span-1 text-lg font-bold">
          <h2 className="md:text-2xl dark:text-white">Configure Settings</h2>
        </div>
        <div className="flex flex-col row-span-4 p-5 text-white divide-y bg-secondary rounded-t-3xl">
          <div className="pb-5">
            <h2 className="px-2 py-3 md:text-2xl">Data Settings:</h2>
            <h2 className="flex justify-between p-3 text-sm bg-purple-500 md:text-xl">
              <p>Clear Data:</p>
              <div
                className={`${loading ? "cursor-not-allowed" : "cursor-auto"}`}
              >
                <button
                  type="button"
                  onClick={handleUpdate}
                  className={`${
                    loading ? "pointer-events-none" : "pointer-events-auto"
                  } bg-red-500 text-white px-2 py-1 active:scale-95 rounded text-sm cursor-pointer`}
                >
                  {loading ? "Updating..." : "Refresh Data"}
                </button>
              </div>
            </h2>
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
        theme="light"
      />
    </div>
  );
}

import type React from "react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { dataFetching } from "../../../utilities/dataFetching";
import { Header } from "../../Header/Header";
import "react-toastify/dist/ReactToastify.css";

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = "Al Quran - Settings";
    document.querySelector("html")?.classList.remove("overflow-x-hidden");
    document.querySelector("body")?.classList.remove("overflow-x-hidden");
  }, []);
  const notify = () => toast.success("Your file has been updated!");
  const handleUpdate = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.value) {
        localStorage.clear();
        localStorage.getItem("isLoaded") === null && setLoading(true);
        dataFetching(setLoading).then(() => {
          notify();
        });
      }
    });
  };

  return (
    <div className="h-screen">
      <div className="bg-white sticky top-0 left-0 w-full z-10">
        <Header head="Settings" />
      </div>
      <div className="grid grid-rows-5">
        <div className="row-span-1 flex items-center justify-center text-lg font-bold">
          <h2 className=" md:text-2xl dark:text-white">Configure Settings</h2>
        </div>
        <div className="row-span-4 bg-secondary text-white p-5 rounded-t-3xl flex flex-col divide-y">
          <div className="pb-5">
            <h2 className="md:text-2xl px-2 py-3">Data Settings:</h2>
            <h2 className="text-sm md:text-xl bg-purple-500 p-3 flex justify-between">
              <p>Clear Data:</p>
              <div
                className={`${loading ? "cursor-not-allowed" : "cursor-auto"}`}
              >
                <button
                  onClick={handleUpdate}
                  className={`${
                    loading ? "pointer-events-none" : "pointer-events-auto"
                  } bg-red-500 text-white px-2 py-1 active:scale-95 rounded text-sm`}
                >
                  {loading ? "Updating..." : "Update Data"}
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
};

export default Settings;

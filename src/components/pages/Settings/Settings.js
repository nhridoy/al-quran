import React, { useEffect, useState } from "react";
import { Header } from "../../Header/Header";
import { GoPrimitiveDot } from "react-icons/go";
import {
  AiFillTwitterCircle,
  AiOutlineMail,
  AiOutlineGithub,
} from "react-icons/ai";
import { IoLogoFacebook, IoLogoWhatsapp } from "react-icons/io5";

import Swal from "sweetalert2";
import { dataFetching } from "../../../utilities/dataFetching";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  // const [toast, setToast] = useState(false);
  useEffect(() => {
    document.querySelector("html").classList.remove("overflow-x-hidden");
    document.querySelector("body").classList.remove("overflow-x-hidden");
  }, []);
  const notify = () => toast.success("Wow so easy !");
  const handleUpdate = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    })
      .then((result) => {
        if (result.value) {
          localStorage.clear();
          localStorage.getItem("isLoaded") === null && setLoading(true);
          dataFetching(setLoading).then((data) => {
            console.log(data);
            notify();
          });
        }
      })
      .then((result) => {
        if (result) {
          Swal.fire("Updated!", "Your file has been updated.", "success");
        }
      });
  };

  return (
    <div>
      <div className="bg-white sticky top-0 left-0 w-full z-10">
        <Header head="Settings" />
      </div>
      <div className="grid grid-rows-5">
        <div className="row-span-1 flex items-center justify-center text-lg font-bold">
          <h2 className=" md:text-2xl">Configure Settings</h2>
        </div>
        <div className="row-span-4 bg-secondary text-white p-5 rounded-t-3xl flex flex-col divide-y">
          <div className="pb-5">
            <h2 className="md:text-2xl px-2 py-3">App Settings:</h2>
            <h2 className="text-sm md:text-xl bg-purple-500 p-3 flex justify-between">
              <p>Dark Mode</p>
              <div>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer
    appearance-none cursor-pointer
    border border-gray-300 rounded-full
    checked:border-gray-900 w-12 h-6"
                  />
                  <span
                    className="peer-checked:left-7
    peer-checked:bg-gray-900
    transition-all duration-200
    pointer-events-none w-4 h-4
    block absolute top-1 left-1
    rounded-full bg-gray-300"
                  ></span>
                </div>
              </div>
            </h2>
          </div>
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
                  } bg-red-500 text-white px-2 py-1 active:scale-95  rounded text-sm`}
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

import React from "react";
import { toast } from "react-toastify";

export const serviceWorkerDev = () => {
  // let serviceWorkerUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;
  // navigator.serviceWorker.register(serviceWorkerUrl).then((registration) => {
  //   console.log("Service Worker Registered");
  // });
  // toast.info(`Update available! To update, close all windows and reopen.`, {
  //   toastId: "appUpdateAvailable", // Prevent duplicate toasts
  //   onClick: () => window.close(), // Closes windows on click
  //   autoClose: false, // Prevents toast from auto closing
  // });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then((registration) => {
        registration.update();
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                alert("Update available! To update, close app and reopen.");
              } else {
                console.log("Content is cached for offline use.");
              }
            }
          };
        };
        console.log("Service Worker Registered", registration);
      })
      .catch((err) => {
        console.log("Service Worker Failed to Register", err);
      });
  }
};

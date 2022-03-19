import logo from "../logo.png";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AddToHomeScreen } from "react-pwa-add-to-homescreen";
import { InstallButton } from "./InstallButton";

export const Splash = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Enabling the loading state
    localStorage.getItem("isLoaded") === null && setLoading(true);
    apiLoad();
  }, []);

  useEffect(() => {
    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    function checkCookie() {
      var user = getCookie("username");
      if (user != "") {
        alert("Welcome again " + user);
      } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
          setCookie("username", user, 365);
        }
      }
    }

    window.addEventListener("load", () => {
      // When the user clicks on Close, we need to keep this in mind and not annoy him again
      document
        .getElementById("BlockInstallClose")
        .addEventListener("click", (e) => {
          document.getElementById("BlockInstall").classList.remove("isActive");
          setCookie("BlockInstallCookieHide", 1, 14);
        });
    });
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", function (event) {
      // Don't display the standard one
      event.preventDefault();

      // We check if the user has the Don't Show Cookie stored. If not, we'll show him the banner.
      let cookieBlockInstallCookieHide = getCookie("BlockInstallCookieHide");
      console.log(cookieBlockInstallCookieHide);
      if (!cookieBlockInstallCookieHide) {
        console.log(document.getElementById("BlockInstall"));
        // document.getElementById("BlockInstall").classList.remove("isActive");
        // document.getElementById("BlockInstall").classList.add("isActive");
        document.getElementById("BlockInstall").style.display = "block";
      }

      // Save the event to use it later
      window.promptEvent = event;
    });

    // If the visitor clicks on `Install` button, we'll show the banner
    document.addEventListener("click", (event) => {
      if (event.target.matches("#BlockInstallButton")) {
        addToHomeScreen();
      }
    });

    function addToHomeScreen() {
      // Install prompt
      // (window.promptEvent || {}).prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // gtag("event", "Installed PWA", {
          //   event_category: "PWA",
          //   value: 1,
          // });
          console.log("installed");
        } else {
          // Do nothing
          console.log("not installed");
        }
        deferredPrompt = null;
      });
    }
  }, []);

  const apiLoad = () => {
    document.title = "Al Quran";
    let count = 0;
    console.log(localStorage.getItem("isLoaded") === null);
    localStorage.getItem("isLoaded") === null &&
      localStorage.setItem("isLoaded", 0);

    parseInt(localStorage.getItem("isLoaded")) < 114 &&
      fetch(
        "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v1/singleSurah.min.json"
      )
        .then((res) => res.json())
        .then((data) => {
          let loadedData = {};
          Object.keys(data.singleSurah).map((key) => {
            loadedData[key] = {};
            loadedData[key] = {
              no: data.singleSurah[key].no,
              name: data.singleSurah[key].name,
              enName: data.singleSurah[key].enName,
              enNameTranslation: data.singleSurah[key].enNameTranslation,
              bnNameTranslation: data.singleSurah[key].bnNameTranslation,
              revelationType: data.singleSurah[key].revelationType,
              numberOfAyahs: data.singleSurah[key].numberOfAyahs,
              verses: data.singleSurah[key].verses.map((verse) => {
                return {
                  text: verse.text,
                  bnText: verse.bnText,
                  enText: verse.enText,
                  enTextTransliteration: verse.enTextTransliteration,
                  audioPrimary: verse.audioPrimary,
                  numberInSurah: verse.numberInSurah,
                };
              }),
            };
          });

          console.log("Loaded");

          Object.keys(loadedData).length > 0 &&
            Object.keys(loadedData).map((key) => {
              try {
                localStorage.setItem(key, JSON.stringify(loadedData[key]));
                localStorage.setItem("isLoaded", ++count);

                // Disabling the loading state
                setLoading(parseInt(localStorage.getItem("isLoaded")) < 114);
                // console.log(parseInt(localStorage.getItem("isLoaded")) < 114);

                // setLoading(!(parseInt(localStorage.getItem("isLoaded")) < 114));
                console.log("Surah", key, "Loaded");
              } catch (error) {
                // alert("Error Fetching Surah! Please Reload The Page Again.");
                if (!alert("Error Fetching Surah! Press OK to Try Again.")) {
                  window.location.reload();
                }
                console.log(error);
                localStorage.clear();
                return;
              }
            });
        });
  };

  return (
    <div className="h-screen grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-primary font-bold text-3xl">
          بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h2>
        <h2 className="text-primary font-bold text-3xl">Al Quran</h2>
        <p className="text-gray-700">Full Quran with Audio Player</p>
      </div>
      <div className="bg-primary py-4 h-full w-full rounded-3xl">
        <div className="h-full w-full grid justify-center items-end">
          <div className="relative">
            <lottie-player
              src="https://assets9.lottiefiles.com/packages/lf20_5mpwodai.json"
              background="transparent"
              speed="1"
              style={{ width: 300, height: 300 }}
              loop
              autoplay
            ></lottie-player>
            <img
              src={logo}
              className="absolute inset-0 p-16 w-full"
              alt="logo"
            />
          </div>
          <div
            className={`${
              loading ? "cursor-not-allowed" : "cursor-auto"
            } flex items-center justify-center`}
          >
            <Link
              disabled
              to="/surah"
              className={`${
                loading ? "pointer-events-none" : "pointer-events-auto"
              } text-center bg-alternateSecond px-5 py-2 rounded-2xl text-white font-semibold`}
            >
              {loading ? "Loading Surah Please Wait..." : "Browse Surah"}
            </Link>
          </div>
        </div>
        {/* <p className="text-red-400">
          {loading ? "First time loading needed about 10Mb of Internet" : ""}
        </p> */}
      </div>
      <InstallButton />
      {/* <AddToHomeScreen
        skipFirstVisit={false}
        styles={{
          body: {
            // display: "flex",
            textAlign: "center",
            borderRadius: "0.5rem",
            border: "1px solid white",
            boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.5)",
          },
          button: {
            background: "#2E0D8A",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            outline: "none",
            padding: "0.5rem",
            transition: "all 0.2s",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.1)",
            },
          },
        }}
        translate={{
          headline: "Head",
          // bottomline: "Bottom",
          safariTapShare: "Share",
          safariAddHomeScreen: "Install to Home Screen",
          chromiumAddHomeScreen: "Install to Home Screen",
          chromiumInstall: "Install to Home Screen",
          // buttonInstall: "buttonInstall",
        }}
      /> */}
    </div>
  );
};

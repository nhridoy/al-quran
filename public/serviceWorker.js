let cacheName = "quran-cache-v1";
let cacheList = [
  // "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v1/singleSurah.min.json",
  // Extarnal CSS Files and JS and Images
  // "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap",
  // "https://fonts.gstatic.com/s/poppins/v19/pxiEyp8kv8JHgFVrJJfecg.woff2",
  // "https://fonts.gstatic.com/s/poppins/v19/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2",
  // "https://fonts.gstatic.com/s/poppins/v19/pxiByp8kv8JHgFVrLDD4Z1xlFQ.woff2",
  "https://fonts.gstatic.com/s/poppins/v19/pxiEyp8kv8JHgFVrJJbecmNE.woff2",
  // "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
  // "https://unpkg.com/@lottiefiles/lottie-player@1.5.6/dist/lottie-player.js",
  // "https://assets9.lottiefiles.com/packages/lf20_5mpwodai.json",
  "https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png",
  "https://img.icons8.com/external-color-outline-adri-ansyah/64/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png",
  "https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-13.png",
  "https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/000000/external-_10-ramadan-jumpicon-(glyph)-jumpicon-glyph-ayub-irawan.png ",

  // Local React Files
  "/",
  "/surah",
  "/para",
  "/settings",
  "/about",
  "/credits",
  "/donation",
  // "/index.html",
  // "/static/css/main.92447845.css",
  // "/static/js/main.f8ea3893.js",
  // "/static/js/bundle.js",

  // "/static/js/main.bd80fb27.js",
  // "/static/js/main.67f5a4cc.js",
  // "/static/css/main.7dc91d28.css",
  // "/static/css/main.37d711dd.css",

  // New Version
  "/static/js/main.cdecf905.js",
  "/static/js/30.afc08775.chunk.js",
  "/static/js/51.a5724ecc.chunk.js",
  "/static/js/65.14d7bf6e.chunk.js",
  "/static/js/146.c0791d76.chunk.js",
  "/static/js/239.29f9d589.chunk.js",
  "/static/js/355.3bd8f202.chunk.js",
  "/static/js/369.cdc1d334.chunk.js",
  "/static/js/402.5408a570.chunk.js",
  "/static/js/415.eb20db5d.chunk.js",
  "/static/js/428.2059aa09.chunk.js",
  "/static/js/465.ca7a8710.chunk.js",
  "/static/js/470.2f3e4d28.chunk.js",
  "/static/js/485.fac5130a.chunk.js",
  "/static/js/718.18f6b4b7.chunk.js",
  "/static/js/763.63927e76.chunk.js",
  "/static/js/787.9da3075b.chunk.js",
  "/static/js/830.2305d6e8.chunk.js",
  "/static/js/977.b4f49bff.chunk.js",
  "/static/js/997.f0989691.chunk.js",
  "/static/css/51.cb7158f9.chunk.css",
  "/static/css/369.383a4248.chunk.css",
  "/static/css/415.9a92256c.chunk.css",
  "/static/css/718.383a4248.chunk.css",
  "/static/css/main.5d26cf31.css",
  // "/static/css/main.5d26cf31.css",
  // "/static/js/146.c0791d76.chunk.js",
  // "/static/js/src_components_Splash_js.chunk.js",
  // "/static/js/src_logo_svg.chunk.js",
  // "/static/js/src_components_pages_Home_Home_js.chunk.js",
  // "/static/js/src_components_pages_Surahs_Surahs_js.chunk.js",
  // "/static/js/src_components_pages_SurahList_SurahList_js.chunk.js",
  // "/static/js/src_components_pages_Paras_Paras_js.chunk.js",
  // "/static/js/src_components_pages_ParaList_ParaList_js.chunk.js",
  // "/static/js/vendors-node_modules_react-icons_fa_index_esm_js.chunk.js",
  // "/static/js/vendors-node_modules_react-jinke-music-player_es_index_js-node_modules_react-jinke-music-play-66228d.chunk.js",
  // "/static/js/src_components_pages_Surah_Player_js.chunk.js",
  // "/static/js/src_components_pages_Ayahs_Ayahs_js.chunk.js",
  // "/static/js/vendors-node_modules_sweetalert2_dist_sweetalert2_all_js.chunk.js",
  // "/static/js/src_components_pages_Settings_Settings_js.chunk.js",
  // "/static/js/vendors-node_modules_react-icons_go_index_esm_js.chunk.js",
  // "/static/js/src_components_pages_About_About_js.chunk.js",
  // "/static/js/src_components_pages_Credits_Credits_js.chunk.js",
  // "/static/js/vendors-node_modules_swiper_modules_effect-cards_effect-cards_min_css-node_modules_swiper_swi-db49fc.chunk.js",
  // "/static/js/src_components_pages_Donation_Donation_js-data_application_font-woff_charset_utf-8_base64_d09-72267a.chunk.js",
  // "/static/css/main.ba696bdd.css",
  // "/static/css/main.ba696bdd.css.map",

  // "/static/media/logo.cc2bc814ed3554c7522ccb45ea1a73a2.svg",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/ios/144.png",

  // "/logo.png",
  // "/serviceWorker.js",
  // "/src/index.js",
  // "/src/index.css",
  // "/src/App.js",
  // "/src/components/pages/Surah/Player.js",
  // "/src/components/pages/Surah/Player.css",
];

for (let index = 1; index <= 114; index++) {
  cacheList.push(`/surah/${index}`);
}
for (let index = 1; index <= 30; index++) {
  cacheList.push(`/para/${index}`);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheList);
    })
  );
});

self.addEventListener("fetch", (event) => {
  // console.log(event.request);
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // return response || fetch(event.request.clone());
        return (
          response ||
          fetch(event.request).then((res) => {
            if (!res || res.status !== 200 || res.type !== "basic") {
              return res;
            }
            return caches.open(staticCacheName).then((cache) => {
              cache.put(event.request, res.clone());
              return res;
            });
          })
        );
      })
    );
  }
});

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cache) => {
//           if (cache !== cacheName) {
//             return caches.delete(cache);
//           }
//         })
//       );
//     })
//   );
// });

// self.addEventListener("message", (event) => {
//     if (event.data.action === "skipWaiting") {
//         self.skipWaiting();
//     }
// }
// );

// self.addEventListener("push", (event) => {
//     let data = event.data.json();
//     console.log("Push Recieved", data);

//     self.registration.showNotification(data.title, {
//         body: data.content,
//         icon: "https://.quran.com/images/quran-logo-white.png",
//     });
// }
// );

// self.addEventListener("notificationclick", (event) => {
//     event.notification.close();

//     event.waitUntil(
//         clients.openWindow("https://.quran.com")
//     );
// }
// );

// self.addEventListener("sync", (event) => {

//     console.log("Sync event fired", event);
// }
// );

// self.addEventListener("pushsubscriptionchange", (event) => {
//     console.log("Push subscription changed", event);
// }
// );

// self.addEventListener("notificationclose", (event) => {
//     console.log("Notification was closed", event);
// }
// );

// self.addEventListener("push", (event) => {
//     console.log("Push recieved", event);
// }
// );

// self.addEventListener("pushsubscriptionchange", (event) => {
//     console.log("Push subscription changed", event);
// }
// );

// self.addEventListener("notificationclick", (event) => {
//     console.log("Notification was clicked", event);
// }
// );

// self.addEventListener("notificationclose", (event) => {
//     console.log("Notification was closed", event);
// }
// );

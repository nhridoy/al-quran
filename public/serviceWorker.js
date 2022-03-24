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
  "/static/js/bundle.js",

  // "/static/js/main.bd80fb27.js",
  // "/static/js/main.67f5a4cc.js",
  // "/static/css/main.7dc91d28.css",
  // "/static/css/main.37d711dd.css",
  // "/static/css/main.7dc91d28.css.map",

  // New Version
  // "/static/js/main.45a91c53.js",
  // "/static/js/146.c0791d76.chunk.js",
  "/static/js/src_components_SplashImage_SplashImage_js.chunk.js",
  // "/static/css/main.7b39bbdc.css",
  // "/static/css/main.7b39bbdc.css.map",

  "/static/media/logo.cc2bc814ed3554c7522ccb45ea1a73a2.svg",
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

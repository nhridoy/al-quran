let catchName = "Cache-Control";
let catchValue = "no-cache";
let cacheName = "quran-cache-v1";
let cacheList = [
  // "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v1/singleSurah.min.json",
  // Extarnal CSS Files and JS and Images
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap",
  "https://fonts.gstatic.com/s/poppins/v19/pxiEyp8kv8JHgFVrJJfecg.woff2",
  "https://fonts.gstatic.com/s/poppins/v19/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2",
  "https://fonts.gstatic.com/s/poppins/v19/pxiByp8kv8JHgFVrLDD4Z1xlFQ.woff2",
  "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
  "https://unpkg.com/@lottiefiles/lottie-player@1.5.6/dist/lottie-player.js",
  "https://assets9.lottiefiles.com/packages/lf20_5mpwodai.json",
  "https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png",
  "https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-13.png",

  // Local React Files
  "/",
  "/surah",
  "/para",
  "/index.html",
  "/static/css/main.92447845.css",
  "/static/js/main.f8ea3893.js",
  "/static/js/bundle.js",
  "/static/media/logo.e4a082d466ccc7346f5b.png",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/ios/144.png",

  // "/index.js",
  // "/index.css",
  // "/logo.png",
  "/serviceWorker.js",
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
        return response || fetch(event.request.clone());
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

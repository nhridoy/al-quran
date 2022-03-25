let cacheName = "quran-cache-v1";
let cacheList = [
  // "https://cdn.jsdelivr.net/gh/nhridoy/quran-api@main/v1/singleSurah.min.json",
  // Extarnal CSS Files and JS and Images
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap",
  "https://fonts.gstatic.com/s/poppins/v19/pxiEyp8kv8JHgFVrJJfecg.woff2",
  "https://fonts.gstatic.com/s/poppins/v19/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2",
  "https://fonts.gstatic.com/s/poppins/v19/pxiByp8kv8JHgFVrLDD4Z1xlFQ.woff2",
  "https://fonts.gstatic.com/s/poppins/v19/pxiEyp8kv8JHgFVrJJbecmNE.woff2",
  // "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
  "https://unpkg.com/@lottiefiles/lottie-player@1.5.6/dist/lottie-player.js",
  "https://assets9.lottiefiles.com/packages/lf20_5mpwodai.json",
  "https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png",
  "https://img.icons8.com/external-color-outline-adri-ansyah/64/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-8.png",
  "https://img.icons8.com/external-color-outline-adri-ansyah/16/000000/external-islam-islam-and-ramadhan-color-outline-adri-ansyah-13.png",
  "https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/000000/external-_10-ramadan-jumpicon-(glyph)-jumpicon-glyph-ayub-irawan.png",
  "https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/ffffff/external-_10-ramadan-jumpicon-(glyph)-jumpicon-glyph-ayub-irawan.png",

  // Local React Files
  "/",
  "/surah",
  "/para",
  "/settings",
  "/about",
  "/credits",
  "/donation",
  // "/index.html",

  // New Version
  "/static/js/main.575ced14.js",
  "/static/js/30.b196cc04.chunk.js",
  "/static/js/51.a5724ecc.chunk.js",
  "/static/js/65.14d7bf6e.chunk.js",
  "/static/js/146.c0791d76.chunk.js",
  "/static/js/239.134d84c2.chunk.js",
  "/static/js/355.3bd8f202.chunk.js",
  "/static/js/369.cdc1d334.chunk.js",
  "/static/js/402.03d8955b.chunk.js",
  "/static/js/415.bc2a1c25.chunk.js",
  "/static/js/428.2059aa09.chunk.js",
  "/static/js/465.f24d10cf.chunk.js",
  "/static/js/470.2f3e4d28.chunk.js",
  "/static/js/485.fac5130a.chunk.js",
  "/static/js/718.ac301a6b.chunk.js",
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

  // "/static/media/logo.cc2bc814ed3554c7522ccb45ea1a73a2.svg",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/ios/144.png",
  // "/serviceWorker.js",
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

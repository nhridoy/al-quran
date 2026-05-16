import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo192.png", "logo512.png", "screenshots/*.svg"],
      manifest: {
        name: "Al Quran",
        short_name: "Al Quran",
        description: "Read the Holy Quran with translations and audio",
        theme_color: "#9345F2",
        background_color: "#9345F2",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "logo192.png", sizes: "192x192", type: "image/png" },
          { src: "logo512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable/maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "maskable/maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshots/mobile.svg",
            sizes: "414x896",
            type: "image/svg+xml",
            form_factor: "narrow",
          },
          {
            src: "screenshots/desktop.svg",
            sizes: "1280x800",
            type: "image/svg+xml",
            form_factor: "wide",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.islamic\.network\/quran\/audio\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-audio-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});

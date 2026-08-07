import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icons/favicon-16x16.png",
        "icons/favicon-32x32.png",
        "icons/apple-touch-icon.png",
        "map/festival-map.svg",
      ],
      manifest: {
        name: "Vegan Camp Out",
        short_name: "VCO",
        description: "Offline companion app for the Vegan Camp Out festival — lineup, schedule, food and map.",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#151b10",
        theme_color: "#151b10",
        icons: [
          { src: "icons/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        // Precache the JSON data and map so the whole app works offline after first load.
        additionalManifestEntries: [
          { url: "data/lineup.json", revision: null },
          { url: "data/vendors.json", revision: null },
          { url: "map/festival-map.svg", revision: null },
        ],
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*\.json$/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "vco-data" },
          },
          {
            urlPattern: /\/map\/.*\.svg$/,
            handler: "CacheFirst",
            options: { cacheName: "vco-map" },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});

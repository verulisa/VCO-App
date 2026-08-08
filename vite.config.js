import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: [
        "icons/favicon-16x16.png",
        "icons/favicon-32x32.png",
        "icons/apple-touch-icon.png",
        "map/festival-map.svg",
        "brand/logo.jpg",
      ],
      manifest: {
        name: "Vegan Camp Out (Unofficial Fan App)",
        short_name: "VCO",
        description: "Unofficial fan-made offline companion app for the Vegan Camp Out festival — lineup, schedule, food and map. Not affiliated with or endorsed by the festival organisers.",
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
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,ico,woff2}"],
        // Without this, a fresh cold navigation to the app's URL (closing it
        // fully, or restarting the phone, then reopening) only matches the
        // precache on the exact literal "index.html" path — the actual
        // start-url navigation request falls through to the network and
        // fails offline, even though every other cached asset works fine.
        navigateFallback: "index.html",
        // Precache the JSON data so the whole app works offline after first load.
        // (map/site-map.jpg is NOT listed here — globPatterns above already picks
        // it up automatically with a real content-hash revision. Re-adding it here
        // with revision:null gave Workbox two different cache keys for the same
        // URL, which makes precacheAndRoute() throw at startup — silently killing
        // ALL service-worker caching, not just the map: no NavigationRoute, no
        // runtime caching, nothing. That's what caused both the map failing to
        // load offline and the repeated native "no internet" dialog, since with
        // no fetch handler registered at all, every request hit the dead network
        // directly instead of being served from cache.)
        additionalManifestEntries: [
          { url: "data/lineup.json", revision: null },
          { url: "data/vendors.json", revision: null },
        ],
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*\.json$/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "vco-data" },
          },
          {
            urlPattern: /\/map\/.*\.(svg|jpg)$/,
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

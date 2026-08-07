import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The splash (index.html, painted before this script even ran) used to get
// yanked out instantly the moment React's first render replaced #root's
// children — on a fast/cached load that meant it was on screen for barely
// a frame, which read as a glitchy flash rather than an intentional splash.
// Give it a minimum on-screen time and a real fade instead, so it always
// looks deliberate regardless of how fast the app underneath is ready.
const MIN_VISIBLE_MS = 550;
const FADE_MS = 400;
const splash = document.getElementById("vco-splash");
if (splash) {
  const elapsed = performance.now();
  window.setTimeout(() => {
    splash.classList.add("vco-splash-hide");
    window.setTimeout(() => splash.remove(), FADE_MS);
  }, Math.max(0, MIN_VISIBLE_MS - elapsed));
}

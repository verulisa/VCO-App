import { useCallback, useEffect, useRef } from "react";
import { registerSW } from "virtual:pwa-register";

const CHECK_INTERVAL_MS = 20 * 60 * 1000;

// vite-plugin-pwa's autoUpdate mode only actually checks for a new worker on
// registration (i.e. a fresh navigation) — a tab left open for hours, which
// is exactly what happens at a festival with patchy signal, never notices a
// new release ships behind the scenes. Two things close that gap:
//
// 1. A periodic timer forces the same cache-busted check "Refresh data &
//    app" does, so a long-lived tab discovers updates on its own.
// 2. Once a new worker actually takes control, reload once so the update
//    becomes visible immediately instead of sitting there unused until the
//    person happens to close and reopen the tab themselves.
export function useAppUpdate() {
  const registrationRef = useRef(null);

  const forceCheck = useCallback(async () => {
    try {
      // GitHub Pages can't set no-cache headers on sw.js, so the browser's
      // own HTTP cache can make registration.update() compare against a
      // stale copy and never notice a real change. Force a fresh network
      // fetch of the worker script first so that cache entry isn't stale.
      const reg = registrationRef.current || (await navigator.serviceWorker?.getRegistration());
      const swUrl = reg?.active?.scriptURL || new URL("sw.js", document.baseURI).href;
      await fetch(swUrl, { cache: "no-store" }).catch(() => {});
      if (reg) await reg.update();
    } catch {
      // Offline, or service workers unsupported — nothing more we can do here.
    }
  }, []);

  useEffect(() => {
    registerSW({
      onRegisteredSW(_swUrl, registration) {
        registrationRef.current = registration || null;
      },
    });

    if (!navigator.serviceWorker) return;

    let reloaded = false;
    function handleControllerChange() {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    }
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") forceCheck();
    }, CHECK_INTERVAL_MS);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      clearInterval(interval);
    };
  }, [forceCheck]);

  return { checkNow: forceCheck };
}

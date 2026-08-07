import { useCallback, useEffect, useRef } from "react";
import { registerSW } from "virtual:pwa-register";

// vite-plugin-pwa's autoUpdate mode already activates any newly-installed
// worker on its own — what's missing is a way for a button to force an
// immediate, cache-busted check instead of waiting for the browser's lazy
// background check interval.
export function useAppUpdate() {
  const registrationRef = useRef(null);

  useEffect(() => {
    registerSW({
      onRegisteredSW(_swUrl, registration) {
        registrationRef.current = registration || null;
      },
    });
  }, []);

  const checkNow = useCallback(async () => {
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

  return { checkNow };
}

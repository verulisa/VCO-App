import { useCallback, useEffect, useRef, useState } from "react";
import { registerSW } from "virtual:pwa-register";

// Manual "refresh" control on top of vite-plugin-pwa's auto-update: lets a
// button force an immediate check instead of waiting for the browser's own
// (often lazy) background check interval.
export function useAppUpdate() {
  const updateSWRef = useRef(null);
  const registrationRef = useRef(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    updateSWRef.current = registerSW({
      onNeedRefresh() {
        setNeedsRefresh(true);
      },
      onRegisteredSW(_swUrl, registration) {
        registrationRef.current = registration || null;
      },
    });
  }, []);

  const checkNow = useCallback(async () => {
    try {
      const reg = registrationRef.current || (await navigator.serviceWorker?.getRegistration());
      if (reg) await reg.update();
    } catch {
      // Offline, or service workers unsupported — nothing more we can do here.
    }
  }, []);

  const applyUpdate = useCallback(() => {
    updateSWRef.current?.(true);
  }, []);

  return { needsRefresh, checkNow, applyUpdate };
}

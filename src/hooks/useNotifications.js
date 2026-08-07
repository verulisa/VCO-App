import { useEffect, useRef, useState } from "react";
import { minutesUntilStart } from "../utils/time";
import { useLocalStorage } from "./useLocalStorage";

const REMINDER_WINDOW_MIN = 15;
const CHECK_INTERVAL_MS = 30_000;
const MAX_REMINDERS_PER_ACT = 2;

const supportsNotifications = typeof window !== "undefined" && "Notification" in window;

export function useNotifications(savedActs) {
  const [permission, setPermission] = useState(supportsNotifications ? Notification.permission : "unsupported");
  // Persisted (not just in-memory) so a saved act already reminded twice
  // doesn't fire again every time the app is reopened.
  const [firedCounts, setFiredCounts] = useLocalStorage("vco_notif_fired", {});
  const firedCountsRef = useRef(firedCounts);
  firedCountsRef.current = firedCounts;

  function requestPermission() {
    if (!supportsNotifications) return;
    Notification.requestPermission().then(setPermission);
  }

  useEffect(() => {
    if (!supportsNotifications || permission !== "granted") return;

    const check = () => {
      const now = new Date();
      for (const act of savedActs) {
        const mins = minutesUntilStart(act, now);
        const count = firedCountsRef.current[act.id] || 0;
        if (mins > 0 && mins <= REMINDER_WINDOW_MIN && count < MAX_REMINDERS_PER_ACT) {
          try {
            new Notification(`Starting in ${mins} min: ${act.name}`, {
              body: `${act.stage} · ${act.startTime}`,
              tag: act.id,
            });
            setFiredCounts((prev) => ({ ...prev, [act.id]: (prev[act.id] || 0) + 1 }));
          } catch {
            // Some browsers only allow Notification via a registered service worker; fail silently.
          }
        }
      }
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [savedActs, permission, setFiredCounts]);

  // Best-effort only: this relies on the app being open in the foreground. It will not
  // fire while the phone is locked or the app is backgrounded — see the Map & Info FAQ.
  const nextReminder = savedActs
    .map((act) => ({ act, mins: minutesUntilStart(act) }))
    .filter((x) => x.mins > 0 && x.mins <= 60)
    .sort((a, b) => a.mins - b.mins)[0];

  return {
    supported: supportsNotifications,
    permission,
    requestPermission,
    nextReminder,
  };
}

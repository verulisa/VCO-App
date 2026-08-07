import { useEffect, useRef, useState } from "react";
import { minutesUntilStart } from "../utils/time";

const REMINDER_WINDOW_MIN = 15;
const CHECK_INTERVAL_MS = 30_000;

const supportsNotifications = typeof window !== "undefined" && "Notification" in window;

export function useNotifications(savedActs) {
  const [permission, setPermission] = useState(supportsNotifications ? Notification.permission : "unsupported");
  const firedRef = useRef(new Set());

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
        if (mins > 0 && mins <= REMINDER_WINDOW_MIN && !firedRef.current.has(act.id)) {
          firedRef.current.add(act.id);
          try {
            new Notification(`Starting in ${mins} min: ${act.name}`, {
              body: `${act.stage} · ${act.startTime}`,
              tag: act.id,
            });
          } catch {
            // Some browsers only allow Notification via a registered service worker; fail silently.
          }
        }
      }
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [savedActs, permission]);

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

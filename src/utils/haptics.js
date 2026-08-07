// No-op on iOS Safari (no Vibration API there) — this is a bonus for Android, never required.
export function tapFeedback(ms = 10) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}

import { useEffect, useState } from "react";

// Ticks so "happening now" / "up next" / progress bars stay accurate while a
// page sits open, instead of freezing at whatever time the page last rendered.
export function useNow(intervalMs = 20_000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

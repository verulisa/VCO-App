import { useState } from "react";
import { Clock } from "lucide-react";
import { formatDuration } from "../utils/time";

const LONG_HINTS = [
  "time to grab food",
  "toilet run now — you won't want to leave later",
  "tried that amazing pizza stall yet?",
  "coffee o'clock — the night's still young",
  "perfect time to hunt down a snack",
  "stretch your legs, refill your water bottle",
  "go on, treat yourself to dessert",
];
const MEDIUM_HINTS = [
  "quick breather",
  "maybe a toilet stop?",
  "just enough time for a snack run",
  "stretch those legs before the next one",
  "top up your water bottle",
];
const SHORT_HINTS = ["tight turnaround — get moving", "no time to lose — next one's close", "quick, don't miss the start"];

function pickHint(minutes) {
  const pool = minutes >= 30 ? LONG_HINTS : minutes >= 12 ? MEDIUM_HINTS : SHORT_HINTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function BreakRow({ minutes }) {
  // Picked once per mount (not every render) so it doesn't flicker between
  // different jokes while the schedule just sits there.
  const [hint] = useState(() => pickHint(minutes));

  return (
    <div className="flex items-center gap-2 py-1 pl-7 text-[11px] text-[var(--vco-text-faint)]">
      <Clock size={12} />
      {formatDuration(minutes)} break — {hint}
    </div>
  );
}

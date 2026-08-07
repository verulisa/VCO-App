import { Clock } from "lucide-react";
import { formatDuration } from "../utils/time";

export default function BreakRow({ minutes }) {
  const hint = minutes >= 30 ? "time to grab food" : minutes >= 12 ? "quick breather" : "tight turnaround — get moving";

  return (
    <div className="flex items-center gap-2 py-1 pl-7 text-[11px] text-[var(--vco-text-faint)]">
      <Clock size={12} />
      {formatDuration(minutes)} break — {hint}
    </div>
  );
}

import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { formatDayHeading, overlapRange } from "../utils/time";

export default function ClashBanner({ clashPairs }) {
  const [open, setOpen] = useState(true);
  if (!clashPairs.length) return null;

  return (
    <div className="rounded-xl border border-[var(--vco-danger-border)] bg-[var(--vco-danger-bg)] text-[12px] text-[var(--vco-danger-text)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="tap flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <AlertTriangle size={15} className="shrink-0" />
        <span className="flex-1 font-semibold">
          {clashPairs.length} clash{clashPairs.length === 1 ? "" : "es"}
        </span>
        <ChevronDown size={15} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="reveal-in flex flex-col gap-1.5 px-3 pb-2.5">
          {clashPairs.map(([a, b]) => (
            <div key={`${a.id}-${b.id}`} className="flex items-start gap-2">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 opacity-0" />
              <span>
                <b>{a.name}</b> and <b>{b.name}</b> overlap on <b>{formatDayHeading(a.date)}</b> ({overlapRange(a, b)})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { AlertTriangle } from "lucide-react";

export default function ClashBanner({ clashPairs }) {
  if (!clashPairs.length) return null;

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--vco-danger-border)] bg-[var(--vco-danger-bg)] px-3 py-2.5 text-[12px] text-[var(--vco-danger-text)]">
      {clashPairs.map(([a, b]) => (
        <div key={`${a.id}-${b.id}`} className="flex items-start gap-2">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>
            Clash: <b>{a.name}</b> and <b>{b.name}</b> overlap ({a.startTime}–{b.endTime})
          </span>
        </div>
      ))}
    </div>
  );
}

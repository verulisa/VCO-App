import { Star } from "lucide-react";
import { formatTimeRange, isLiveNow, progressPercent } from "../utils/time";
import { tapFeedback } from "../utils/haptics";

export default function ActCard({ act, saved, onToggleSave, now = new Date() }) {
  const live = isLiveNow(act, now);

  return (
    <div
      className={`relative grid grid-cols-[56px_1px_1fr_auto] rounded-xl border bg-[var(--vco-surface)] shadow-[var(--vco-shadow)] ${
        live ? "border-[var(--vco-red)]/35" : "border-[var(--vco-border)]"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-0.5 px-1.5 py-3 font-mono text-[12px] tabular-nums text-[var(--vco-text)]">
        <span>{act.startTime}</span>
        <span className="text-[10.5px] text-[var(--vco-text-faint)]">{act.endTime}</span>
      </div>

      <div className="perf" />

      <div className="min-w-0 px-3 py-3">
        <p className="truncate font-bold text-[13.5px] text-[var(--vco-text)]">{act.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {live && (
            <span className="rounded-full border border-[var(--vco-red)]/40 bg-[var(--vco-red-soft)] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-[var(--vco-red)]">
              Live
            </span>
          )}
          <span className="rounded-full border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-2 py-0.5 text-[9.5px] uppercase tracking-wide text-[var(--vco-text-muted)]">
            {act.stage}
          </span>
          <span className="text-[11px] text-[var(--vco-text-muted)]">{act.category}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          tapFeedback();
          onToggleSave(act.id);
        }}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${act.name} from schedule` : `Save ${act.name} to schedule`}
        className="tap flex items-center px-3"
      >
        <Star
          key={saved}
          size={19}
          className={saved ? "pop-in fill-[var(--vco-yellow)] stroke-[var(--vco-yellow)]" : "stroke-[var(--vco-text-faint)]"}
        />
      </button>

      {live && (
        <div className="col-span-4 mx-3 mb-2.5 h-[3px] overflow-hidden rounded-full bg-[var(--vco-border)]">
          <div className="h-full bg-[var(--vco-yellow)]" style={{ width: `${progressPercent(act, now)}%` }} />
        </div>
      )}
    </div>
  );
}

export function actSubtitle(act) {
  return `${act.stage} · ${formatTimeRange(act)}`;
}

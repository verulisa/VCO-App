import { memo } from "react";
import { Star } from "lucide-react";
import { formatTimeRange, isLiveNow, progressPercent } from "../utils/time";
import { tapFeedback } from "../utils/haptics";
import { stageColor } from "../utils/stageColor";

function ActCard({ act, saved, onToggleSave, now = new Date() }) {
  const live = isLiveNow(act, now);
  const stage = stageColor(act.stage);

  return (
    <div
      className={`relative grid grid-cols-[56px_1fr_auto] rounded-xl border bg-[var(--vco-surface)] shadow-[var(--vco-shadow)] transition-shadow ${
        live ? "border-[var(--vco-red)]/35" : "border-[var(--vco-border)]"
      }`}
    >
      {/* Anchored to the card's own top/bottom edge (inset-y-0 on a
          position:relative ancestor) instead of a grid row/column — that
          way the dots always sit flush with the true card edge, live
          progress bar or not, instead of drifting to wherever a grid
          track happens to end. */}
      <div className="perf pointer-events-none absolute inset-y-0 left-[56px]" />

      <div className="flex flex-col items-center justify-center gap-0.5 px-1.5 py-3 font-mono text-[12px] tabular-nums text-[var(--vco-text)]">
        <span>{act.startTime}</span>
        <span className="text-[10.5px] text-[var(--vco-text-faint)]">{act.endTime}</span>
      </div>

      <div className="min-w-0 px-3 py-3">
        <p className="truncate font-bold text-[13.5px] text-[var(--vco-text)]">{act.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {live && (
            <span className="flex items-center gap-1 rounded-full border border-[var(--vco-red)]/40 bg-[var(--vco-red-soft)] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-[var(--vco-red)]">
              <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[var(--vco-red)]" />
              Live
            </span>
          )}
          <span
            className="rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: stage.bg, borderColor: stage.border, color: stage.text }}
          >
            {act.stage}
          </span>
          <span className="text-[11px] text-[var(--vco-text-muted)]">{act.category}</span>
        </div>
        {act.description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[var(--vco-text-muted)]">{act.description}</p>
        )}
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
        <div className="col-span-3 mx-3 mb-2.5 h-[3px] overflow-hidden rounded-full bg-[var(--vco-border)]">
          <div className="h-full bg-[var(--vco-yellow)]" style={{ width: `${progressPercent(act, now)}%` }} />
        </div>
      )}
    </div>
  );
}

export function actSubtitle(act) {
  return `${act.stage} · ${formatTimeRange(act)}`;
}

// The 20s "now" tick otherwise re-renders every visible card on Lineup —
// most of a ~180-act list is neither live nor about to be, so their
// output is byte-identical from one tick to the next. Skip the re-render
// unless the act/saved state changed, the live/not-live status just
// flipped, or the card is currently live (its progress bar needs to keep
// advancing).
export default memo(ActCard, (prev, next) => {
  if (prev.act.id !== next.act.id || prev.saved !== next.saved) return false;
  const prevLive = isLiveNow(prev.act, prev.now);
  const nextLive = isLiveNow(next.act, next.now);
  if (prevLive !== nextLive || nextLive) return false;
  return true;
});

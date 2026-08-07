import { Bell, Bookmark, ChevronRight } from "lucide-react";
import ActCard from "../components/ActCard";
import { useNow } from "../hooks/useNow";
import { daysUntil, isLiveNow, isUpcoming, sortByStart } from "../utils/time";

export default function HomePage({ lineup, info, isSaved, toggleSave, notifications, vendors, vendorRatings, onGoToFood }) {
  const now = useNow();
  const live = sortByStart(lineup.filter((a) => isLiveNow(a, now)));
  const upNext = sortByStart(lineup.filter((a) => !isLiveNow(a, now) && isUpcoming(a, now, 120))).slice(0, 4);
  const days = info ? daysUntil(info.event.startDate, now) : null;
  const stageCount = new Set(lineup.map((a) => a.stage)).size;
  const savedCount = lineup.filter((a) => isSaved(a.id)).length;

  const wishlistVendors = (vendors || []).filter((v) => vendorRatings?.getRating(v.id).wishlist);

  return (
    <div className="flex flex-col gap-5 px-4 pb-28 pt-4">
      {info && (
        <div className="flex items-center justify-between rounded-2xl border border-[var(--vco-border)] bg-gradient-to-br from-[var(--vco-surface-raised)] to-[var(--vco-surface)] p-4 shadow-[var(--vco-shadow)]">
          <div>
            <p className="font-mono text-[30px] font-extrabold leading-none tabular-nums text-[var(--vco-green-strong)]">
              {days > 0 ? days : days === 0 ? "Today" : "—"}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-[var(--vco-text-muted)]">
              {days > 0 ? "days to go" : days === 0 ? "the festival starts today" : "underway / wrapped"}
            </p>
          </div>
          <div className="text-right text-[11.5px] leading-relaxed text-[var(--vco-text-muted)]">
            gates open <b className="block text-[13px] text-[var(--vco-text)]">Thu 13 Aug</b>
            {info.event.venue}
          </div>
        </div>
      )}

      {notifications && notifications.supported && notifications.permission === "default" && (
        <button
          type="button"
          onClick={notifications.requestPermission}
          className="flex items-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-3.5 py-2.5 text-left text-[12px] text-[var(--vco-text-muted)]"
        >
          <Bell size={15} className="shrink-0 text-[var(--vco-green-strong)]" />
          Turn on reminders — we'll nudge you 15 min before saved acts. Won't work in the background or locked screen (browser limitation).
        </button>
      )}

      <section>
        <p className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">
          {live.length > 0 && <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[var(--vco-red)]" />}
          Happening now
        </p>
        {live.length === 0 ? (
          <p className="text-[12.5px] text-[var(--vco-text-muted)]">Nothing live right now — check what's up next below.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {live.map((act) => (
              <ActCard key={act.id} act={act} saved={isSaved(act.id)} onToggleSave={toggleSave} now={now} />
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">Up next</p>
        {upNext.length === 0 ? (
          <p className="text-[12.5px] text-[var(--vco-text-muted)]">Nothing in the next couple of hours.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {upNext.map((act) => (
              <ActCard key={act.id} act={act} saved={isSaved(act.id)} onToggleSave={toggleSave} now={now} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">
            <Bookmark size={12} />
            Food you want to try
          </p>
          {wishlistVendors.length > 0 && (
            <button type="button" onClick={onGoToFood} className="tap flex items-center gap-0.5 text-[11px] font-semibold text-[var(--vco-green-strong)]">
              See all <ChevronRight size={13} />
            </button>
          )}
        </div>
        {wishlistVendors.length === 0 ? (
          <button
            type="button"
            onClick={onGoToFood}
            className="tap w-full rounded-xl border border-dashed border-[var(--vco-border)] px-3.5 py-3 text-left text-[12px] text-[var(--vco-text-muted)]"
          >
            Bookmark stalls in the Food tab to see your list here.
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {wishlistVendors.slice(0, 4).map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] px-3.5 py-2.5 shadow-[var(--vco-shadow)]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-bold text-[var(--vco-text)]">{v.name}</p>
                  {(v.description || (v.location && v.location !== "Stalls")) && (
                    <p className="truncate text-[10.5px] text-[var(--vco-text-muted)]">{v.description || v.location}</p>
                  )}
                </div>
                <Bookmark size={14} className="shrink-0 fill-[var(--vco-yellow)] stroke-[var(--vco-yellow)]" />
              </div>
            ))}
            {wishlistVendors.length > 4 && (
              <p className="text-center text-[10.5px] text-[var(--vco-text-faint)]">+{wishlistVendors.length - 4} more</p>
            )}
          </div>
        )}
      </section>

      <div className="flex gap-2.5">
        <Stat label="Saved" value={savedCount} />
        <Stat label="Stages / areas" value={stageCount} />
        <Stat label="Total acts" value={lineup.length} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex-1 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] py-2.5 text-center shadow-[var(--vco-shadow)]">
      <p className="font-mono text-[18px] font-extrabold tabular-nums text-[var(--vco-text)]">{value}</p>
      <p className="mt-0.5 text-[9px] uppercase tracking-wide text-[var(--vco-text-muted)]">{label}</p>
    </div>
  );
}

import { Bell, Bookmark, CalendarClock, CalendarDays, ChevronRight, Music, Star, X } from "lucide-react";
import ActCard from "../components/ActCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNow } from "../hooks/useNow";
import { actStart, daysUntil, formatDayHeading, isLiveNow, isUpcoming, sortByStart, todayIso } from "../utils/time";

export default function HomePage({ lineup, info, isSaved, toggleSave, notifications, vendors, vendorRatings, onGoToFood, onGoToLineup }) {
  const [reminderNudgeDismissed, setReminderNudgeDismissed] = useLocalStorage("vco_reminder_nudge_dismissed", false);
  const now = useNow();
  const live = sortByStart(lineup.filter((a) => isLiveNow(a, now)));
  const upNext = sortByStart(lineup.filter((a) => !isLiveNow(a, now) && isUpcoming(a, now, 120))).slice(0, 4);
  const days = info ? daysUntil(info.event.startDate, now) : null;
  // The big "days to go" countdown is only useful before the gates open —
  // once the festival is actually underway it's just dead space taking up
  // the top of Home, so it collapses to a plain date line instead.
  const festivalUnderway =
    info && now >= new Date(`${info.event.startDate}T00:00:00`) && now <= new Date(`${info.event.endDate}T23:59:59`);
  const stageCount = new Set(lineup.map((a) => a.stage)).size;

  const savedActs = lineup.filter((a) => isSaved(a.id));
  const savedCount = savedActs.length;
  const nextForMe = sortByStart(savedActs.filter((a) => actStart(a) > now))[0] || null;
  const myDay = sortByStart(savedActs.filter((a) => a.date === todayIso(now)));

  const wishlistVendors = (vendors || []).filter((v) => vendorRatings?.getRating(v.id).wishlist);

  return (
    <div className="flex flex-col gap-5 px-4 pb-28 pt-4">
      {info && festivalUnderway ? (
        <div className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-3.5 py-2">
          <span className="text-[12.5px] font-bold text-[var(--vco-text)]">{formatDayHeading(todayIso(now))}</span>
        </div>
      ) : (
        info && (
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
              gates open{" "}
              <b className="block text-[13px] text-[var(--vco-text)]">{formatDayHeading(info.event.startDate)}</b>
              {info.event.venue}
            </div>
          </div>
        )
      )}

      {notifications && notifications.supported && notifications.permission === "default" && !reminderNudgeDismissed && (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-3.5 py-2.5 text-left text-[12px] text-[var(--vco-text-muted)]">
          <button type="button" onClick={notifications.requestPermission} className="flex flex-1 items-center gap-2 text-left">
            <Bell size={15} className="shrink-0 text-[var(--vco-green-strong)]" />
            Turn on reminders — we'll nudge you 15 min before saved acts. Won't work in the background or locked screen (browser limitation).
          </button>
          <button type="button" onClick={() => setReminderNudgeDismissed(true)} aria-label="Dismiss" className="shrink-0 self-start">
            <X size={15} />
          </button>
        </div>
      )}

      <section>
        <p className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">
          <Star size={12} className="fill-[var(--vco-yellow)] stroke-[var(--vco-yellow)]" />
          Next for me
        </p>
        {nextForMe ? (
          <ActCard act={nextForMe} saved onToggleSave={toggleSave} now={now} />
        ) : (
          <button
            type="button"
            onClick={onGoToLineup}
            className="tap flex w-full items-center gap-2.5 rounded-xl border border-dashed border-[var(--vco-border)] px-3.5 py-3 text-left"
          >
            <Star size={16} className="shrink-0 text-[var(--vco-text-faint)]" />
            <p className="text-[12.5px] text-[var(--vco-text-muted)]">
              {savedCount > 0 ? "Nothing else starred coming up." : "Nothing starred yet — head to Lineup and tap the star on what you don't want to miss."}
            </p>
          </button>
        )}
      </section>

      <section>
        <p className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">
          {live.length > 0 && <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[var(--vco-red)]" />}
          Happening now
        </p>
        {live.length === 0 ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-[var(--vco-border)] px-3.5 py-3">
            <Music size={16} className="shrink-0 text-[var(--vco-text-faint)]" />
            <p className="text-[12.5px] text-[var(--vco-text-muted)]">Nothing live right now — check what's up next below.</p>
          </div>
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
          <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-[var(--vco-border)] px-3.5 py-3">
            <CalendarClock size={16} className="shrink-0 text-[var(--vco-text-faint)]" />
            <p className="text-[12.5px] text-[var(--vco-text-muted)]">Nothing in the next couple of hours.</p>
          </div>
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
                className="flex items-start justify-between gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] px-3.5 py-2.5 shadow-[var(--vco-shadow)]"
              >
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold leading-snug text-[var(--vco-text)]">{v.name}</p>
                  {(v.description || (v.location && v.location !== "Stalls")) && (
                    <p className="text-[10.5px] leading-snug text-[var(--vco-text-muted)]">{v.description || v.location}</p>
                  )}
                </div>
                <Bookmark size={14} className="mt-0.5 shrink-0 fill-[var(--vco-yellow)] stroke-[var(--vco-yellow)]" />
              </div>
            ))}
            {wishlistVendors.length > 4 && (
              <p className="text-center text-[10.5px] text-[var(--vco-text-faint)]">+{wishlistVendors.length - 4} more</p>
            )}
          </div>
        )}
      </section>

      <section>
        <p className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">
          <CalendarDays size={12} />
          My day
        </p>
        {myDay.length === 0 ? (
          <button
            type="button"
            onClick={onGoToLineup}
            className="tap w-full rounded-xl border border-dashed border-[var(--vco-border)] px-3.5 py-3 text-left text-[12px] text-[var(--vco-text-muted)]"
          >
            Nothing starred for today yet — head to Lineup to plan your day.
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            {myDay.map((act) => (
              <ActCard key={act.id} act={act} saved onToggleSave={toggleSave} now={now} />
            ))}
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

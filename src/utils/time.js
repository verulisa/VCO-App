// All acts store `date` (YYYY-MM-DD, the day they start), plus `startTime`/`endTime` as "HH:MM".
// An endTime of "00:00" means midnight at the end of that day, i.e. the start of the next day.

export function actStart(act) {
  return new Date(`${act.date}T${act.startTime}:00`);
}

export function actEnd(act) {
  const end = new Date(`${act.date}T${act.endTime}:00`);
  if (act.endTime === "00:00" || end <= actStart(act)) {
    end.setDate(end.getDate() + 1);
  }
  return end;
}

export function isLiveNow(act, now = new Date()) {
  const start = actStart(act);
  const end = actEnd(act);
  return now >= start && now < end;
}

export function isUpcoming(act, now = new Date(), withinMinutes = 180) {
  const start = actStart(act);
  const diffMin = (start.getTime() - now.getTime()) / 60000;
  return diffMin > 0 && diffMin <= withinMinutes;
}

export function minutesUntilStart(act, now = new Date()) {
  return Math.round((actStart(act).getTime() - now.getTime()) / 60000);
}

export function progressPercent(act, now = new Date()) {
  const start = actStart(act).getTime();
  const end = actEnd(act).getTime();
  const pct = ((now.getTime() - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, pct));
}

export function overlaps(a, b) {
  return actStart(a) < actEnd(b) && actStart(b) < actEnd(a);
}

// The actual overlapping window between two clashing acts — not just
// "first act's start to second act's end", which overstates the clash
// whenever one act merely tails into the start of the other rather than
// fully containing it.
export function overlapRange(a, b) {
  const start = new Date(Math.max(actStart(a), actStart(b)));
  const end = new Date(Math.min(actEnd(a), actEnd(b)));
  const pad = (n) => String(n).padStart(2, "0");
  const clock = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return `${clock(start)}–${clock(end)}`;
}

export function gapMinutes(prevAct, nextAct) {
  return Math.round((actStart(nextAct).getTime() - actEnd(prevAct).getTime()) / 60000);
}

export function formatTimeRange(act) {
  return `${act.startTime} – ${act.endTime}`;
}

export function formatDayHeading(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  // Locale hardcoded to English — toLocaleDateString(undefined, ...) would
  // otherwise follow the phone's system language (e.g. Czech), and nothing
  // in this app may be in any language but English.
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

export function formatDuration(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function daysUntil(dateStr, now = new Date()) {
  const target = new Date(`${dateStr}T00:00:00`);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86400000);
}

export function sortByStart(acts) {
  return [...acts].sort((a, b) => actStart(a) - actStart(b));
}

// Interleaves a chronologically-sorted list of acts with day-heading rows and
// "break" rows describing the gap to the next act — but only within the same
// day, so a gap that crosses into a new day gets a day heading instead of a
// nonsensical multi-hour break. Works on any subset (e.g. just the upcoming
// acts) since it only looks at consecutive elements of whatever list it's given.
export function buildScheduleRows(acts, clashIds) {
  const rows = [];
  let lastDate = null;
  for (let i = 0; i < acts.length; i++) {
    const act = acts[i];
    if (act.date !== lastDate) {
      rows.push({ type: "day", date: act.date, key: `day-${act.date}` });
      lastDate = act.date;
    }
    rows.push({ type: "act", act, isClash: clashIds.has(act.id) });
    const next = acts[i + 1];
    if (next && next.date === act.date) {
      const gap = gapMinutes(act, next);
      if (gap > 0) {
        rows.push({ type: "break", minutes: gap, key: `gap-${act.id}-${next.id}` });
      }
    }
  }
  return rows;
}

export function todayIso(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// Which day-chip ("Thu"/"Fri"/...) corresponds to today's real date, derived
// from the lineup itself rather than a hardcoded date map.
export function dayKeyForDate(lineup, dateStr) {
  const act = lineup.find((a) => a.date === dateStr);
  return act ? act.day : null;
}

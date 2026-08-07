import { actStart, actEnd } from "./time";

function pad(n) {
  return String(n).padStart(2, "0");
}

// Floating local time (no Z / TZID) — correct on purpose: the attendee's phone
// is physically at the venue, so "local time" on the device already matches
// the festival's clock. No timezone database needed, no DST edge cases.
function toIcsDate(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(
    date.getMinutes()
  )}00`;
}

function escapeIcsText(text = "") {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function actToVEvent(act) {
  const start = actStart(act);
  const end = actEnd(act);
  return [
    "BEGIN:VEVENT",
    `UID:${act.id}@vegancampout.local`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(act.name)}`,
    `LOCATION:${escapeIcsText(act.stage)}`,
    `DESCRIPTION:${escapeIcsText(`${act.category} · Vegan Camp Out${act.description ? " — " + act.description : ""}`)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Starting in 15 minutes",
    "TRIGGER:-PT15M",
    "END:VALARM",
    "END:VEVENT",
  ].join("\r\n");
}

export function buildIcsCalendar(acts) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vegan Camp Out//Companion App//EN",
    "CALSCALE:GREGORIAN",
    ...acts.map(actToVEvent),
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(acts, filename = "vegan-camp-out-schedule.ics") {
  const ics = buildIcsCalendar(acts);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

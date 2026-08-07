import { formatDayHeading } from "./time";

// A human-readable version of the saved schedule for pasting straight into
// a group chat — distinct from ScheduleShare's VCO1: code, which is for
// importing into another phone's app rather than reading.
export function buildPlanText(savedActs) {
  if (savedActs.length === 0) return "";
  const lines = ["My Vegan Camp Out plan 🌱"];
  let lastDate = null;
  for (const act of savedActs) {
    if (act.date !== lastDate) {
      lines.push("");
      lines.push(formatDayHeading(act.date));
      lastDate = act.date;
    }
    lines.push(`${act.startTime} — ${act.name} (${act.stage})`);
  }
  return lines.join("\n");
}

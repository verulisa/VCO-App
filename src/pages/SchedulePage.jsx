import { useState } from "react";
import { CalendarPlus, Clipboard, Share2, Sparkles } from "lucide-react";
import ActCard from "../components/ActCard";
import BreakRow from "../components/BreakRow";
import ClashBanner from "../components/ClashBanner";
import ScheduleShare from "../components/ScheduleShare";
import { useNow } from "../hooks/useNow";
import { downloadIcs } from "../utils/ics";
import { buildPlanText } from "../utils/planText";
import { formatDayHeading } from "../utils/time";

const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

export default function SchedulePage({ schedule, toggleSave, lineup }) {
  const { savedIds, savedActs, scheduleRows, clashPairs, importIds } = schedule;
  const now = useNow();
  const [copied, setCopied] = useState(false);

  async function sharePlanText() {
    const text = buildPlanText(savedActs);
    if (canNativeShare) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
    } else {
      navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-28 pt-4">
      <ClashBanner clashPairs={clashPairs} />

      {scheduleRows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center">
          <Sparkles size={28} className="text-[var(--vco-text-faint)]" />
          <p className="max-w-[240px] text-[12.5px] leading-relaxed text-[var(--vco-text-muted)]">
            Nothing saved yet. Head to the Lineup tab and tap the star on anything you don't want to miss.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {scheduleRows.map((row) => {
            if (row.type === "day") {
              return (
                <p
                  key={row.key}
                  className="mb-2.5 mt-1 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-green-strong)] first:mt-0"
                >
                  {formatDayHeading(row.date)}
                </p>
              );
            }
            if (row.type === "act") {
              return (
                <div key={row.act.id} className="mb-2.5">
                  <ActCard act={row.act} saved onToggleSave={toggleSave} now={now} />
                </div>
              );
            }
            return <BreakRow key={row.key} minutes={row.minutes} />;
          })}
        </div>
      )}

      {savedActs.length > 0 && (
        <button
          type="button"
          onClick={() => downloadIcs(savedActs)}
          className="tap flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--vco-yellow)] py-3 text-[13px] font-bold text-[#2a1c05] shadow-[var(--vco-glow-gold)]"
        >
          <CalendarPlus size={16} />
          Add schedule to Calendar
        </button>
      )}
      <p className="-mt-2 text-center text-[10.5px] leading-relaxed text-[var(--vco-text-faint)]">
        Adds a 15-min-before alarm to each — your phone's own Calendar app reminds you even offline and locked.
        {isAndroid && " On Android it downloads a file — open it from your notification shade or Downloads to add it."}
      </p>

      {savedActs.length > 0 && (
        <button
          type="button"
          onClick={sharePlanText}
          className="tap flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] py-3 text-[13px] font-semibold text-[var(--vco-text)]"
        >
          {canNativeShare ? <Share2 size={15} /> : <Clipboard size={15} />}
          {copied ? "Copied!" : "Share plan as text"}
        </button>
      )}
      <p className="-mt-2 text-center text-[10.5px] leading-relaxed text-[var(--vco-text-faint)]">
        A readable summary for a group chat — day, time and act names, nothing to scan or import.
      </p>

      <ScheduleShare savedIds={savedIds} onImport={importIds} lineup={lineup} />
    </div>
  );
}

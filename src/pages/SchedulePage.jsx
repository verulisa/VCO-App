import { useMemo, useState } from "react";
import { CalendarPlus, Clipboard, HelpCircle, Share2, Sparkles, X } from "lucide-react";
import ActCard from "../components/ActCard";
import BreakRow from "../components/BreakRow";
import ClashBanner from "../components/ClashBanner";
import CollapsibleSection from "../components/CollapsibleSection";
import ScheduleShare from "../components/ScheduleShare";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNow } from "../hooks/useNow";
import { downloadIcs } from "../utils/ics";
import { buildPlanText } from "../utils/planText";
import { actEnd, buildScheduleRows, formatDayHeading } from "../utils/time";

const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent);
const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

function renderRows(rows, toggleSave, now) {
  return rows.map((row) => {
    if (row.type === "day") {
      return (
        <p key={row.key} className="mb-2.5 mt-1 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-green-strong)] first:mt-0">
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
  });
}

export default function SchedulePage({ schedule, toggleSave, lineup }) {
  const { savedIds, savedActs, clashIds, clashPairs, importIds } = schedule;
  const now = useNow();
  const [copied, setCopied] = useState(false);
  const [showIcsHelp, setShowIcsHelp] = useState(false);
  const [tipDismissed, setTipDismissed] = useLocalStorage("vco_schedule_tip_dismissed", false);

  // Past acts sink to a collapsed section at the end instead of sitting at
  // the top of the list — by Sunday, most of a saved plan has already
  // happened, and nobody wants to scroll past a full weekend of done-with
  // acts just to see what's still coming up.
  const upcomingActs = useMemo(() => savedActs.filter((act) => actEnd(act) > now), [savedActs, now]);
  const pastActs = useMemo(() => savedActs.filter((act) => actEnd(act) <= now), [savedActs, now]);
  const upcomingRows = useMemo(() => buildScheduleRows(upcomingActs, clashIds), [upcomingActs, clashIds]);
  const pastRows = useMemo(() => buildScheduleRows(pastActs, clashIds), [pastActs, clashIds]);

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
      {!tipDismissed && (
        <div className="flex items-start gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-[var(--vco-text-muted)]">
          <HelpCircle size={14} className="mt-0.5 shrink-0 text-[var(--vco-text-faint)]" />
          <p className="flex-1">
            Everything you star in the Lineup tab shows up here, in time order. Once you've got a plan, add it to your
            phone's Calendar or share it with the group below.
          </p>
          <button type="button" onClick={() => setTipDismissed(true)} aria-label="Dismiss" className="shrink-0">
            <X size={14} className="text-[var(--vco-text-faint)]" />
          </button>
        </div>
      )}
      <ClashBanner clashPairs={clashPairs} />

      {savedActs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center">
          <Sparkles size={28} className="text-[var(--vco-text-faint)]" />
          <p className="max-w-[240px] text-[12.5px] leading-relaxed text-[var(--vco-text-muted)]">
            Nothing saved yet. Head to the Lineup tab and tap the star on anything you don't want to miss.
          </p>
        </div>
      ) : upcomingActs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Sparkles size={28} className="text-[var(--vco-text-faint)]" />
          <p className="max-w-[240px] text-[12.5px] leading-relaxed text-[var(--vco-text-muted)]">
            Nothing left to come — everything you saved has already happened.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">{renderRows(upcomingRows, toggleSave, now)}</div>
      )}

      {pastActs.length > 0 && (
        <CollapsibleSection title={`Already happened (${pastActs.length})`}>
          <div className="flex flex-col">{renderRows(pastRows, toggleSave, now)}</div>
        </CollapsibleSection>
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

      {savedActs.length > 0 && (isAndroid || isIOS) && (
        <div className="-mt-2 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setShowIcsHelp((v) => !v)}
            className="flex items-center gap-1 text-[10.5px] font-semibold text-[var(--vco-text-faint)] underline decoration-dotted underline-offset-2"
          >
            <HelpCircle size={12} />
            Not sure how to add it? Tap here
          </button>
          {showIcsHelp && (
            <ol className="reveal-in w-full list-decimal space-y-1.5 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] p-3 pl-7 text-[11px] leading-relaxed text-[var(--vco-text-muted)]">
              {isAndroid ? (
                <>
                  <li>Tap "Add schedule to Calendar" above — it downloads a small file.</li>
                  <li>Open it from the download notification, or from your Downloads.</li>
                  <li>If you've got more than one calendar app, you'll be asked which one to open it with — pick your calendar app.</li>
                  <li>It'll list every event — tap "Add all" to add them in one go.</li>
                </>
              ) : (
                <>
                  <li>Tap "Add schedule to Calendar" above.</li>
                  <li>It opens straight into your Calendar app — tap to expand and check the events.</li>
                  <li>Tap "Add" to add them all to your calendar.</li>
                </>
              )}
            </ol>
          )}
        </div>
      )}

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

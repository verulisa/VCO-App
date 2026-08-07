import { CalendarPlus, Sparkles } from "lucide-react";
import ActCard from "../components/ActCard";
import BreakRow from "../components/BreakRow";
import ClashBanner from "../components/ClashBanner";
import ScheduleShare from "../components/ScheduleShare";
import { downloadIcs } from "../utils/ics";

export default function SchedulePage({ schedule, toggleSave }) {
  const { savedIds, savedActs, scheduleRows, clashPairs, importIds } = schedule;

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
          {scheduleRows.map((row) =>
            row.type === "act" ? (
              <div key={row.act.id} className="mb-2.5">
                <ActCard act={row.act} saved onToggleSave={toggleSave} />
              </div>
            ) : (
              <BreakRow key={row.key} minutes={row.minutes} />
            )
          )}
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
      </p>

      <ScheduleShare savedIds={savedIds} onImport={importIds} />
    </div>
  );
}

import ActCard from "../components/ActCard";
import BreakRow from "../components/BreakRow";
import ClashBanner from "../components/ClashBanner";
import ScheduleShare from "../components/ScheduleShare";

export default function SchedulePage({ schedule, toggleSave }) {
  const { savedIds, scheduleRows, clashPairs, importIds } = schedule;

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-28 pt-4">
      <ClashBanner clashPairs={clashPairs} />

      {scheduleRows.length === 0 ? (
        <p className="py-10 text-center text-[12.5px] leading-relaxed text-[var(--vco-text-muted)]">
          Nothing saved yet. Head to the Lineup tab and tap the star on anything you don't want to miss.
        </p>
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

      <ScheduleShare savedIds={savedIds} onImport={importIds} />
    </div>
  );
}

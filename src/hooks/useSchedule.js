import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { actEnd, actStart, gapMinutes, overlaps, sortByStart } from "../utils/time";

export function useSchedule(lineup) {
  const [savedIds, setSavedIds] = useLocalStorage("vco_saved_ids", []);

  function isSaved(id) {
    return savedIds.includes(id);
  }

  function toggleSave(id) {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function importIds(ids) {
    setSavedIds((prev) => Array.from(new Set([...prev, ...ids])));
  }

  function replaceIds(ids) {
    setSavedIds(ids);
  }

  const savedActs = useMemo(() => {
    const byId = new Map(lineup.map((a) => [a.id, a]));
    return sortByStart(savedIds.map((id) => byId.get(id)).filter(Boolean));
  }, [savedIds, lineup]);

  const { clashIds, clashPairs } = useMemo(() => {
    const clashing = new Set();
    const pairs = [];
    for (let i = 0; i < savedActs.length; i++) {
      for (let j = i + 1; j < savedActs.length; j++) {
        if (overlaps(savedActs[i], savedActs[j])) {
          clashing.add(savedActs[i].id);
          clashing.add(savedActs[j].id);
          pairs.push([savedActs[i], savedActs[j]]);
        }
      }
    }
    return { clashIds: clashing, clashPairs: pairs };
  }, [savedActs]);

  // Rows interleave each saved act with a "break" entry describing the gap to
  // the next one, but only within the same day — a gap that crosses into a
  // new day gets a day-heading row instead of a nonsensical "13h break".
  const scheduleRows = useMemo(() => {
    const rows = [];
    let lastDate = null;
    for (let i = 0; i < savedActs.length; i++) {
      const act = savedActs[i];
      if (act.date !== lastDate) {
        rows.push({ type: "day", date: act.date, key: `day-${act.date}` });
        lastDate = act.date;
      }
      rows.push({ type: "act", act, isClash: clashIds.has(act.id) });
      const next = savedActs[i + 1];
      if (next && next.date === act.date) {
        const gap = gapMinutes(act, next);
        if (gap > 0) {
          rows.push({ type: "break", minutes: gap, key: `gap-${act.id}-${next.id}` });
        }
      }
    }
    return rows;
  }, [savedActs, clashIds]);

  return {
    savedIds,
    savedActs,
    scheduleRows,
    clashIds,
    clashPairs,
    isSaved,
    toggleSave,
    importIds,
    replaceIds,
  };
}

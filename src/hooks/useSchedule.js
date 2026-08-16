import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { overlaps, sortByStart } from "../utils/time";

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

  return {
    savedIds,
    savedActs,
    clashIds,
    clashPairs,
    isSaved,
    toggleSave,
    importIds,
    replaceIds,
  };
}

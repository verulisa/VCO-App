import { useMemo, useState } from "react";
import ActCard from "../components/ActCard";
import FilterChips from "../components/FilterChips";
import SearchBar from "../components/SearchBar";
import { sortByStart } from "../utils/time";

const DAYS = ["All", "Thu", "Fri", "Sat", "Sun"];

export default function LineupPage({ lineup, isSaved, toggleSave }) {
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("All");
  const [stage, setStage] = useState("All");
  const [categories, setCategories] = useState([]);

  const stages = useMemo(() => ["All", ...new Set(lineup.map((a) => a.stage))], [lineup]);
  const allCategories = useMemo(() => [...new Set(lineup.map((a) => a.category))].sort(), [lineup]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sortByStart(
      lineup.filter((act) => {
        if (day !== "All" && act.day !== day) return false;
        if (stage !== "All" && act.stage !== stage) return false;
        if (categories.length > 0 && !categories.includes(act.category)) return false;
        if (q && !act.name.toLowerCase().includes(q)) return false;
        return true;
      })
    );
  }, [lineup, search, day, stage, categories]);

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-28 pt-4">
      <SearchBar value={search} onChange={setSearch} placeholder="Search artist, speaker…" />
      <FilterChips options={DAYS} value={day} onChange={setDay} />
      <FilterChips options={stages} value={stage} onChange={setStage} />
      <FilterChips options={allCategories} value={categories} onChange={setCategories} multi />

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-[12.5px] text-[var(--vco-text-muted)]">No acts match those filters.</p>
        ) : (
          filtered.map((act) => <ActCard key={act.id} act={act} saved={isSaved(act.id)} onToggleSave={toggleSave} />)
        )}
      </div>
    </div>
  );
}

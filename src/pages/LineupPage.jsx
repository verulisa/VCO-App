import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import ActCard from "../components/ActCard";
import FilterChips from "../components/FilterChips";
import SearchBar from "../components/SearchBar";
import { useNow } from "../hooks/useNow";
import { dayKeyForDate, formatDayHeading, sortByStart, todayIso } from "../utils/time";

const DAYS = ["All", "Thu", "Fri", "Sat", "Sun"];

export default function LineupPage({ lineup, isSaved, toggleSave }) {
  const now = useNow();
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("All");
  const [stage, setStage] = useState("All");
  const [categories, setCategories] = useState([]);

  const stages = useMemo(() => ["All", ...new Set(lineup.map((a) => a.stage))], [lineup]);
  const allCategories = useMemo(() => [...new Set(lineup.map((a) => a.category))].sort(), [lineup]);
  const todayKey = useMemo(() => dayKeyForDate(lineup, todayIso()), [lineup]);

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

  // Insert a day heading whenever the date changes — acts are already
  // sorted chronologically, so with "All" days selected it's otherwise
  // impossible to tell which day a stack of same-time-of-day acts is on.
  const rows = useMemo(() => {
    const out = [];
    let lastDate = null;
    for (const act of filtered) {
      if (act.date !== lastDate) {
        out.push({ type: "day", date: act.date, key: `day-${act.date}` });
        lastDate = act.date;
      }
      out.push({ type: "act", act });
    }
    return out;
  }, [filtered]);

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-28 pt-4">
      <SearchBar value={search} onChange={setSearch} placeholder="Search artist, speaker…" />
      <FilterChips options={DAYS} value={day} onChange={setDay} highlight={todayKey} />
      <FilterChips options={stages} value={stage} onChange={setStage} />
      <FilterChips options={allCategories} value={categories} onChange={setCategories} multi />

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <SearchX size={28} className="text-[var(--vco-text-faint)]" />
            <p className="text-[12.5px] text-[var(--vco-text-muted)]">No acts match those filters.</p>
          </div>
        ) : (
          rows.map((row) =>
            row.type === "day" ? (
              <p
                key={row.key}
                className="mb-1 mt-1 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-green-strong)] first:mt-0"
              >
                {formatDayHeading(row.date)}
              </p>
            ) : (
              <ActCard key={row.act.id} act={row.act} saved={isSaved(row.act.id)} onToggleSave={toggleSave} now={now} />
            )
          )
        )}
      </div>
    </div>
  );
}

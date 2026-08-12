import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import ActCard from "../components/ActCard";
import BslIcon from "../components/icons/BslIcon";
import FilterChips from "../components/FilterChips";
import SearchBar from "../components/SearchBar";
import { tapFeedback } from "../utils/haptics";
import { useNow } from "../hooks/useNow";
import { dayKeyForDate, formatDayHeading, sortByStart, todayIso } from "../utils/time";

const DAYS = ["All", "Thu", "Fri", "Sat", "Sun"];

export default function LineupPage({ lineup, isSaved, toggleSave }) {
  const now = useNow();
  const todayKey = useMemo(() => dayKeyForDate(lineup, todayIso()), [lineup]);
  const [search, setSearch] = useState("");
  // Default to today's day during the festival itself (todayKey is only
  // set once today's date actually appears in the lineup) — otherwise
  // "All" like before.
  const [day, setDay] = useState(() => todayKey || "All");
  const [stage, setStage] = useState("All");
  const [categories, setCategories] = useState([]);
  const [bslOnly, setBslOnly] = useState(false);

  const stages = useMemo(() => ["All", ...new Set(lineup.map((a) => a.stage))], [lineup]);
  const allCategories = useMemo(() => [...new Set(lineup.map((a) => a.category))].sort(), [lineup]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sortByStart(
      lineup.filter((act) => {
        if (day !== "All" && act.day !== day) return false;
        if (stage !== "All" && act.stage !== stage) return false;
        if (categories.length > 0 && !categories.includes(act.category)) return false;
        if (bslOnly && !act.bsl) return false;
        if (q && !act.name.toLowerCase().includes(q)) return false;
        return true;
      })
    );
  }, [lineup, search, day, stage, categories, bslOnly]);

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
      <p className="-mb-1 text-[10.5px] leading-relaxed text-[var(--vco-text-faint)]">
        Every time here is typed in by hand from the official Vegan Camp Out website — if the two ever disagree, theirs
        is right.
      </p>
      <FilterChips options={DAYS} value={day} onChange={setDay} highlight={todayKey} />
      <FilterChips options={stages} value={stage} onChange={setStage} />
      <FilterChips options={allCategories} value={categories} onChange={setCategories} multi />

      <button
        type="button"
        onClick={() => {
          tapFeedback();
          setBslOnly((v) => !v);
        }}
        className={`tap flex w-fit shrink-0 items-center gap-1.5 rounded-full border py-1 pl-1 pr-3.5 text-[12px] transition-colors duration-150 ${
          bslOnly
            ? "border-[var(--vco-green)] bg-[var(--vco-green)] font-bold text-white shadow-[0_2px_10px_-4px_var(--vco-green)]"
            : "border-[var(--vco-border)] bg-[var(--vco-surface)] text-[var(--vco-text-muted)]"
        }`}
      >
        <BslIcon size={20} />
        BSL interpreted
      </button>
      {bslOnly && (
        <p className="-mt-2 text-[10.5px] leading-relaxed text-[var(--vco-text-faint)]">
          List shared by We The Free, not the festival's published lineup artwork — an act without the mark may still
          have an interpreter, it just hasn't been confirmed to us.
        </p>
      )}

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

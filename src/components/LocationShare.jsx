import { useEffect, useMemo, useState } from "react";
import FilterChips from "./FilterChips";
import ShareQR from "./ShareQR";

const CATEGORIES = ["Stage", "Food & Traders", "Gate", "Camping zone"];

// No precise GPS map to drop a pin on, but every stage, stall, gate and
// camping zone already has a real name in the data — picking one and
// sharing "I'm at X" gets a friend to you just as well, with zero setup.
export default function LocationShare({ lineup, vendors, gates, campingZones }) {
  const [category, setCategory] = useState("Stage");
  const [selected, setSelected] = useState("");

  const options = useMemo(() => {
    if (category === "Stage") return [...new Set((lineup || []).map((a) => a.stage))].sort();
    if (category === "Food & Traders") return (vendors || []).map((v) => v.name).sort();
    if (category === "Gate") return (gates || []).map((g) => g.name);
    if (category === "Camping zone") return campingZones || [];
    return [];
  }, [category, lineup, vendors, gates, campingZones]);

  useEffect(() => {
    setSelected("");
  }, [category]);

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11.5px] leading-relaxed text-[var(--vco-text-muted)]">
        Pick where you are right now and send it — no precise map needed.
      </p>
      <FilterChips options={CATEGORIES} value={category} onChange={setCategory} />
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full rounded-lg border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-3 py-2.5 text-[13px] text-[var(--vco-text)] outline-none"
      >
        <option value="">Choose {category.toLowerCase()}…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {selected && (
        <ShareQR
          text={`I'm at ${selected} right now! (Vegan Camp Out)`}
          triggerLabel={`Share: I'm at ${selected}`}
          triggerClassName="tap flex w-full items-center justify-center rounded-xl bg-[var(--vco-green)] py-2.5 text-[12.5px] font-semibold text-white"
        />
      )}
    </div>
  );
}

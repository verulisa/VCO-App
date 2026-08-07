import { useMemo, useState } from "react";
import FilterChips from "../components/FilterChips";
import SearchBar from "../components/SearchBar";
import VendorCard from "../components/VendorCard";
import { useVendorRatings } from "../hooks/useVendorRatings";

const CATEGORIES = ["All", "Food", "Trader"];
const DIET_TAGS = ["Gluten-Free", "Nut-Free", "Soy-Free", "Desserts"];

export default function FoodPage({ vendors }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tags, setTags] = useState([]);
  const { getRating, rate, toggleTried, setNote } = useVendorRatings();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vendors
      .filter((v) => {
        if (category !== "All" && v.category !== category) return false;
        if (tags.length > 0 && !tags.every((t) => v.tags.includes(t))) return false;
        if (q && !v.name.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [vendors, search, category, tags]);

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-28 pt-4">
      <SearchBar value={search} onChange={setSearch} placeholder="Search a stall…" />
      <FilterChips options={CATEGORIES} value={category} onChange={setCategory} />
      <FilterChips options={DIET_TAGS} value={tags} onChange={setTags} multi />

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-[12.5px] text-[var(--vco-text-muted)]">No stalls match those filters.</p>
        ) : (
          filtered.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              ratingState={getRating(vendor.id)}
              onRate={rate}
              onToggleTried={toggleTried}
              onSetNote={setNote}
            />
          ))
        )}
      </div>
    </div>
  );
}

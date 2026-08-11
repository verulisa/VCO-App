import { useMemo, useState } from "react";
import { Bookmark, SearchX } from "lucide-react";
import FilterChips from "../components/FilterChips";
import SearchBar from "../components/SearchBar";
import VendorCard from "../components/VendorCard";

const CATEGORIES = ["All", "Food", "Trader"];
const DIET_TAGS = ["Gluten-Free", "Nut-Free", "Soy-Free", "Desserts"];
const STATUS_FILTERS = ["All", "Want to try", "Been here"];

export default function FoodPage({ vendors, vendorRatings, nickname }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [traderSubcategory, setTraderSubcategory] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("All");
  const { ratings, getRating, rate, toggleVisited, toggleWishlist, setNote } = vendorRatings;

  const wishlistCount = useMemo(() => Object.values(ratings).filter((r) => r.wishlist).length, [ratings]);

  // Traders span everything from charities to skincare brands, so a single
  // flat "Trader" bucket wasn't useful for finding anything — this second
  // row lets it narrow down further, built from whatever subcategories are
  // actually present in the data rather than a hardcoded list.
  const traderSubcategories = useMemo(
    () => ["All", ...new Set(vendors.filter((v) => v.category === "Trader" && v.subcategory).map((v) => v.subcategory))],
    [vendors]
  );

  // Star ratings for festival food stalls all cluster near the top (bad ones
  // don't survive the circuit), so they don't actually help decide what to
  // eat — cuisine type does. Same "second row, built from the data" pattern
  // as the trader subcategories above.
  const cuisines = useMemo(
    () => ["All", ...new Set(vendors.filter((v) => v.category === "Food").flatMap((v) => v.cuisine || []))],
    [vendors]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vendors
      .filter((v) => {
        if (category !== "All" && v.category !== category) return false;
        if (category === "Trader" && traderSubcategory !== "All" && v.subcategory !== traderSubcategory) return false;
        if (category === "Food" && cuisine !== "All" && !(v.cuisine || []).includes(cuisine)) return false;
        if (tags.length > 0 && !tags.every((t) => v.tags.includes(t))) return false;
        if (q && !v.name.toLowerCase().includes(q)) return false;
        const r = getRating(v.id);
        if (status === "Want to try" && !r.wishlist) return false;
        if (status === "Been here" && !r.visited) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [vendors, search, category, traderSubcategory, cuisine, tags, status, ratings, getRating]);

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-28 pt-4">
      <SearchBar value={search} onChange={setSearch} placeholder="Search a stall…" />
      <FilterChips
        options={CATEGORIES}
        value={category}
        onChange={(next) => {
          setCategory(next);
          if (next !== "Trader") setTraderSubcategory("All");
          if (next !== "Food") setCuisine("All");
        }}
      />
      {category === "Trader" && traderSubcategories.length > 1 && (
        <FilterChips options={traderSubcategories} value={traderSubcategory} onChange={setTraderSubcategory} />
      )}
      {category === "Food" && cuisines.length > 1 && <FilterChips options={cuisines} value={cuisine} onChange={setCuisine} />}
      {category !== "Trader" && <FilterChips options={DIET_TAGS} value={tags} onChange={setTags} multi />}

      <div className="flex items-center justify-between">
        <FilterChips options={STATUS_FILTERS} value={status} onChange={setStatus} />
      </div>

      {wishlistCount > 0 && status === "All" && (
        <button
          type="button"
          onClick={() => setStatus("Want to try")}
          className="flex items-center gap-2 rounded-xl border border-[var(--vco-yellow)]/40 bg-[var(--vco-yellow-soft)] px-3.5 py-2.5 text-[12px] text-[var(--vco-yellow)]"
        >
          <Bookmark size={14} className="fill-[var(--vco-yellow)]" />
          {wishlistCount} on your wishlist — tap to view
        </button>
      )}

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <SearchX size={28} className="text-[var(--vco-text-faint)]" />
            <p className="text-[12.5px] text-[var(--vco-text-muted)]">No stalls match those filters.</p>
          </div>
        ) : (
          filtered.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              ratingState={getRating(vendor.id)}
              onRate={rate}
              onToggleVisited={toggleVisited}
              onToggleWishlist={toggleWishlist}
              onSetNote={setNote}
              nickname={nickname}
            />
          ))
        )}
      </div>
    </div>
  );
}

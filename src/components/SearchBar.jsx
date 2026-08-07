import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] px-3 py-2.5 text-[var(--vco-text-faint)]">
      <Search size={15} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[13px] text-[var(--vco-text)] outline-none placeholder:text-[var(--vco-text-faint)]"
      />
    </label>
  );
}

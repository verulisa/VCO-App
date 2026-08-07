import { tapFeedback } from "../utils/haptics";

export default function FilterChips({ options, value, onChange, multi = false, highlight }) {
  function isOn(option) {
    return multi ? value.includes(option) : value === option;
  }

  function handleClick(option) {
    tapFeedback();
    if (!multi) {
      onChange(option);
      return;
    }
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleClick(option)}
          className={`tap relative shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] transition-colors duration-150 ${
            isOn(option)
              ? "border-[var(--vco-green)] bg-[var(--vco-green)] font-bold text-white shadow-[0_2px_10px_-4px_var(--vco-green)]"
              : "border-[var(--vco-border)] bg-[var(--vco-surface)] text-[var(--vco-text-muted)]"
          }`}
        >
          {option}
          {highlight === option && !isOn(option) && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--vco-yellow)]" />
          )}
        </button>
      ))}
    </div>
  );
}

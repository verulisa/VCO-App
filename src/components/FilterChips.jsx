export default function FilterChips({ options, value, onChange, multi = false }) {
  function isOn(option) {
    return multi ? value.includes(option) : value === option;
  }

  function handleClick(option) {
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
          className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] ${
            isOn(option)
              ? "border-[var(--vco-green)] bg-[var(--vco-green)] font-bold text-white"
              : "border-[var(--vco-border)] bg-[var(--vco-surface)] text-[var(--vco-text-muted)]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

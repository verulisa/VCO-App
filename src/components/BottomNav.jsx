import { Home, ListMusic, CalendarCheck, UtensilsCrossed, Map } from "lucide-react";

const TABS = [
  { key: "home", label: "Home", icon: Home },
  { key: "lineup", label: "Lineup", icon: ListMusic },
  { key: "schedule", label: "Schedule", icon: CalendarCheck },
  { key: "food", label: "Food", icon: UtensilsCrossed },
  { key: "map", label: "Map", icon: Map },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-[var(--vco-border)] bg-[var(--vco-surface-raised)]/95 px-1 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-2 backdrop-blur">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3.5 py-1.5 text-[10px] ${
              isActive ? "bg-[var(--vco-green-soft)] text-[var(--vco-text)]" : "text-[var(--vco-text-faint)]"
            }`}
          >
            <Icon size={19} className={isActive ? "stroke-[var(--vco-green-strong)]" : "stroke-[var(--vco-text-faint)]"} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

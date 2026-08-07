import { Home, ListMusic, CalendarCheck, UtensilsCrossed, Map } from "lucide-react";
import { tapFeedback } from "../utils/haptics";

const TABS = [
  { key: "home", label: "Home", icon: Home },
  { key: "lineup", label: "Lineup", icon: ListMusic },
  { key: "schedule", label: "Schedule", icon: CalendarCheck },
  { key: "food", label: "Food", icon: UtensilsCrossed },
  { key: "map", label: "Map", icon: Map },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed-col bottom-0 z-40 flex justify-around border-t border-[var(--vco-border)] bg-[var(--vco-surface-raised)]/95 px-1 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-2 backdrop-blur">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (!isActive) tapFeedback(6);
              onChange(key);
            }}
            className={`tap flex flex-col items-center gap-0.5 rounded-xl px-3.5 py-1.5 text-[10px] transition-colors duration-150 ${
              isActive ? "bg-[var(--vco-green-soft)] text-[var(--vco-text)]" : "text-[var(--vco-text-faint)]"
            }`}
          >
            <Icon
              size={19}
              className={`transition-transform duration-200 ${isActive ? "-translate-y-0.5 scale-110 stroke-[var(--vco-green-strong)]" : "stroke-[var(--vco-text-faint)]"}`}
            />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

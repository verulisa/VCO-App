import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3.5">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-2 text-left">
        <span className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">{title}</span>
        <ChevronDown size={15} className={`shrink-0 text-[var(--vco-text-faint)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

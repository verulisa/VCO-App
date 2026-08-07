import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question} className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3.5">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="font-bold text-[12.5px] text-[var(--vco-text)]">{item.question}</span>
              <ChevronDown
                size={15}
                className={`shrink-0 text-[var(--vco-text-faint)] transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <p className="reveal-in mt-2 text-[11.5px] leading-relaxed text-[var(--vco-text-muted)]">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

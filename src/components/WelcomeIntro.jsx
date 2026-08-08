import { CalendarPlus, Coffee, ListMusic, Lock, Share2, Smartphone, Star, X } from "lucide-react";
import { useDismiss } from "../hooks/useDismiss";

const POINTS = [
  {
    icon: Lock,
    text: "It's just a web page — nothing is collected or sent anywhere. Everything stays only on this phone, and you can delete it after the festival.",
  },
  { icon: ListMusic, text: "Browse the full lineup, schedule & festival info." },
  { icon: Star, text: "Tap the star on any act to save it to My Schedule." },
  { icon: CalendarPlus, text: "Export your saved schedule to your phone's Calendar app for reminders." },
  { icon: Share2, text: "Recommend food stalls and share your schedule with friends." },
  {
    icon: Smartphone,
    text: "Add this web page to your phone's Home Screen so it works like a real app, fully offline — instructions are in the menu.",
  },
];

export default function WelcomeIntro({ onClose }) {
  const { closing, dismiss } = useDismiss(onClose);
  return (
    <div
      className={`modal-backdrop fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center ${closing ? "is-closing" : ""}`}
      onClick={dismiss}
    >
      <div
        className={`sheet-in max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-5 ${closing ? "is-closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-extrabold text-[16px] text-[var(--vco-text)]">Welcome 👋</h2>
          <button type="button" onClick={dismiss} aria-label="Close" className="tap">
            <X size={20} className="text-[var(--vco-text-faint)]" />
          </button>
        </div>
        <p className="mb-4 text-[11.5px] leading-relaxed text-[var(--vco-text-faint)]">
          Unofficial fan-made companion app — not affiliated with or endorsed by the festival organisers.
        </p>

        <div className="mb-4 flex flex-col gap-3">
          {POINTS.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--vco-green-soft)]">
                <Icon size={14} className="text-[var(--vco-green-strong)]" />
              </span>
              <p className="text-[12.5px] leading-snug text-[var(--vco-text)]">{text}</p>
            </div>
          ))}
        </div>

        <p className="mb-4 text-center text-[11px] leading-relaxed text-[var(--vco-text-muted)]">
          100% free, no ads. If it helps you out, there's an optional way to buy the dev a coffee{" "}
          <Coffee size={11} className="inline -mt-0.5" /> in the menu.
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="tap flex w-full items-center justify-center rounded-xl bg-[var(--vco-green)] py-3 text-[13px] font-bold text-white"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
}

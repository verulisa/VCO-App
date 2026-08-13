import { Smartphone, X } from "lucide-react";

export default function FirstSaveHint({ onClose }) {
  return (
    <div
      className="fixed-col z-50 px-4"
      style={{ bottom: "calc(68px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex items-start gap-2.5 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] p-3 text-[12px] text-[var(--vco-text-muted)] shadow-[var(--vco-shadow)]">
        <Smartphone size={16} className="mt-0.5 shrink-0 text-[var(--vco-green-strong)]" />
        <p className="flex-1">
          <span className="font-bold text-[var(--vco-text)]">Saved!</span> While you're still online, add this to your
          Home Screen (or just keep this tab open) so everything finishes loading — after that your schedule works
          with no signal at all.
        </p>
        <button type="button" onClick={onClose} aria-label="Dismiss" className="shrink-0">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

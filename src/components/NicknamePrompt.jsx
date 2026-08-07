import { useState } from "react";
import { Shuffle } from "lucide-react";
import { generateNickname, nicknameEmoji } from "../utils/nicknameWords";

export default function NicknamePrompt({ onConfirm }) {
  const [candidate, setCandidate] = useState(() => generateNickname());
  const [custom, setCustom] = useState("");

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="sheet-in w-full max-w-sm rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-5">
        <p className="text-[11px] uppercase tracking-wide text-[var(--vco-text-muted)]">Welcome to</p>
        <h1 className="mb-1 font-extrabold text-[20px] text-[var(--vco-text)]">Vegan Camp Out</h1>
        <p className="mb-4 text-[12.5px] leading-relaxed text-[var(--vco-text-muted)]">
          Pick a festival nickname — it's just for this device, no account or personal info needed.
        </p>

        <div className="mb-3 flex items-center gap-3 rounded-xl bg-[var(--vco-surface-raised)] p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--vco-green)] text-xl">
            {nicknameEmoji(candidate)}
          </span>
          <p className="flex-1 font-bold text-[15px] text-[var(--vco-text)]">{candidate}</p>
          <button
            type="button"
            onClick={() => setCandidate(generateNickname())}
            aria-label="Shuffle nickname"
            className="rounded-full border border-[var(--vco-border)] p-2"
          >
            <Shuffle size={14} className="text-[var(--vco-text)]" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onConfirm(candidate)}
          className="mb-3 w-full rounded-xl bg-[var(--vco-green)] py-3 text-[14px] font-bold text-white"
        >
          Use this nickname
        </button>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="…or type your own"
            maxLength={24}
            className="min-w-0 flex-1 rounded-lg border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-3 py-2 text-[13px] text-[var(--vco-text)] outline-none placeholder:text-[var(--vco-text-faint)]"
          />
          <button
            type="button"
            disabled={!custom.trim()}
            onClick={() => onConfirm(custom.trim())}
            className="shrink-0 rounded-lg border border-[var(--vco-border)] px-3 py-2 text-[12.5px] font-semibold text-[var(--vco-text)] disabled:opacity-40"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
}

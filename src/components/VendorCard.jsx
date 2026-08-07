import { useState } from "react";
import { Star, Check } from "lucide-react";

export default function VendorCard({ vendor, ratingState, onRate, onToggleTried, onSetNote }) {
  const [editingNote, setEditingNote] = useState(false);
  const { rating, tried, note } = ratingState;

  return (
    <div className="rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-bold text-[14px] text-[var(--vco-text)]">{vendor.name}</p>
          <p className="text-[11.5px] text-[var(--vco-text-muted)]">📍 {vendor.location}</p>
        </div>
      </div>

      {(vendor.tags.length > 0 || vendor.description) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {vendor.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-2 py-0.5 text-[9.5px] uppercase tracking-wide text-[var(--vco-text-muted)]"
            >
              {tag}
            </span>
          ))}
          {vendor.description && <span className="text-[11px] text-[var(--vco-text-muted)]">{vendor.description}</span>}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-[var(--vco-border)] pt-3">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => onRate(vendor.id, n)} aria-label={`Rate ${n} stars`}>
              <Star
                size={17}
                className={n <= rating ? "fill-[var(--vco-yellow)] stroke-[var(--vco-yellow)]" : "stroke-[var(--vco-border)]"}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onToggleTried(vendor.id)}
          className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] ${
            tried
              ? "border-[var(--vco-green)] bg-[var(--vco-green-soft)] text-[var(--vco-green-strong)]"
              : "border-[var(--vco-border)] bg-[var(--vco-surface-raised)] text-[var(--vco-text-faint)]"
          }`}
        >
          {tried && <Check size={12} />}
          {tried ? "Tried it" : "Not tried yet"}
        </button>
      </div>

      {editingNote ? (
        <input
          autoFocus
          type="text"
          defaultValue={note}
          maxLength={140}
          placeholder="What did you think?"
          onBlur={(e) => {
            onSetNote(vendor.id, e.target.value);
            setEditingNote(false);
          }}
          className="mt-2 w-full rounded-lg bg-[var(--vco-surface-raised)] px-2.5 py-2 text-[12px] text-[var(--vco-text)] outline-none placeholder:text-[var(--vco-text-faint)]"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingNote(true)}
          className="mt-2 w-full rounded-lg bg-[var(--vco-surface-raised)] px-2.5 py-2 text-left text-[12px] italic leading-relaxed text-[var(--vco-text-muted)]"
        >
          {note || "Tap to add a note…"}
        </button>
      )}
    </div>
  );
}

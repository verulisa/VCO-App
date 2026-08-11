import { useState } from "react";
import { Star, Check, Bookmark } from "lucide-react";
import ShareQR from "./ShareQR";
import { tapFeedback } from "../utils/haptics";

export default function VendorCard({ vendor, ratingState, onRate, onToggleVisited, onToggleWishlist, onSetNote, nickname }) {
  const [editingNote, setEditingNote] = useState(false);
  const { rating, visited, wishlist, note } = ratingState;
  const isTopRated = visited && rating === 5;

  const shareText = visited
    ? `${vendor.name} (Vegan Camp Out) — ${vendor.description ? `${vendor.description} — ` : ""}${"★".repeat(
        rating || 0
      )}${rating ? "" : "not rated yet"}${note ? ` — "${note}"` : ""}${nickname ? ` (via ${nickname})` : ""}`
    : `${vendor.name} (Vegan Camp Out)${vendor.description ? ` — ${vendor.description}` : ""} — on my list to try!`;

  return (
    <div
      className="rounded-2xl border bg-[var(--vco-surface)] p-3.5 transition-shadow"
      style={{
        borderColor: isTopRated ? "transparent" : "var(--vco-border)",
        boxShadow: isTopRated ? "var(--vco-glow-gold)" : "var(--vco-shadow)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-bold text-[14px] text-[var(--vco-text)]">{vendor.name}</p>
          {vendor.location && vendor.location !== "Stalls" && (
            <p className="text-[11.5px] text-[var(--vco-text-muted)]">{vendor.location}</p>
          )}
        </div>
      </div>

      {(vendor.subcategory || vendor.tags.length > 0 || vendor.description) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {vendor.subcategory && (
            <span className="rounded-full border border-[var(--vco-green)]/35 bg-[var(--vco-green-soft)] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-[var(--vco-green-strong)]">
              {vendor.subcategory}
            </span>
          )}
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

      <div className="mt-3 flex items-center gap-2 border-t border-dashed border-[var(--vco-border)] pt-3">
        <button
          type="button"
          onClick={() => {
            tapFeedback();
            onToggleWishlist(vendor.id);
          }}
          className={`tap flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] ${
            wishlist
              ? "border-[var(--vco-yellow)] bg-[var(--vco-yellow-soft)] text-[var(--vco-yellow)]"
              : "border-[var(--vco-border)] bg-[var(--vco-surface-raised)] text-[var(--vco-text-faint)]"
          }`}
        >
          <Bookmark size={12} className={wishlist ? "fill-[var(--vco-yellow)]" : ""} />
          Want to try
        </button>

        <button
          type="button"
          onClick={() => {
            tapFeedback();
            onToggleVisited(vendor.id);
          }}
          className={`tap flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] ${
            visited
              ? "border-[var(--vco-green)] bg-[var(--vco-green-soft)] text-[var(--vco-green-strong)]"
              : "border-[var(--vco-border)] bg-[var(--vco-surface-raised)] text-[var(--vco-text-faint)]"
          }`}
        >
          {visited && <Check size={12} />}
          Been here
        </button>
      </div>

      {visited && (
        <div className="mt-2.5 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                tapFeedback();
                onRate(vendor.id, n);
              }}
              aria-label={`Rate ${n} stars`}
              className="tap"
            >
              <Star
                size={17}
                className={n <= rating ? "fill-[var(--vco-yellow)] stroke-[var(--vco-yellow)]" : "stroke-[var(--vco-border)]"}
              />
            </button>
          ))}
          {isTopRated && <span className="ml-1 text-[10.5px] font-semibold text-[var(--vco-yellow)]">Local legend</span>}
        </div>
      )}

      {visited &&
        (editingNote ? (
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
        ))}

      <div className="mt-2.5">
        <ShareQR
          text={shareText}
          triggerLabel="Recommend to a friend"
          triggerClassName="text-[11.5px] font-semibold text-[var(--vco-green-strong)]"
        />
      </div>
    </div>
  );
}

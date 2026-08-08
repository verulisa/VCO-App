import { Bookmark, Star, Sun, Umbrella, X } from "lucide-react";
import { useDismiss } from "../hooks/useDismiss";
import { useNow } from "../hooks/useNow";
import { sortByStart, todayIso } from "../utils/time";
import { weatherIconFor } from "../utils/weatherIcons";

function greeting(now) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  const weekday = now.toLocaleDateString("en-GB", { weekday: "long" });
  return `Happy ${weekday}`;
}

function clothingTip(daily) {
  if (!daily) return null;
  if (daily.precipProbMax >= 40) return { Icon: Umbrella, text: "Don't forget a rain jacket." };
  if (daily.uvMax >= 5 || daily.tempMax >= 20) return { Icon: Sun, text: "Don't forget sunscreen and sunglasses." };
  return null;
}

export default function MorningCard({ lineup, isSaved, vendors, vendorRatings, weather, onClose }) {
  const now = useNow();
  const { closing, dismiss } = useDismiss(onClose);
  const today = todayIso(now);
  const myDay = sortByStart(lineup.filter((a) => isSaved(a.id) && a.date === today));
  const wishlistVendors = (vendors || []).filter((v) => vendorRatings?.getRating(v.id).wishlist).slice(0, 2);
  const tip = weather ? clothingTip(weather.daily) : null;
  const weatherIcon = weather ? weatherIconFor(weather.current.code) : null;

  return (
    <div
      className={`modal-backdrop fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center ${closing ? "is-closing" : ""}`}
      onClick={dismiss}
    >
      <div
        className={`sheet-in max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-5 ${closing ? "is-closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h2 className="font-extrabold text-[17px] text-[var(--vco-text)]">{greeting(now)} 👋</h2>
            <p className="text-[11.5px] text-[var(--vco-text-faint)]">
              {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <button type="button" onClick={dismiss} aria-label="Close" className="tap">
            <X size={20} className="text-[var(--vco-text-faint)]" />
          </button>
        </div>

        {weather && weatherIcon && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] p-3">
            <weatherIcon.Icon size={28} className="shrink-0 text-[var(--vco-green-strong)]" />
            <div className="min-w-0">
              <p className="font-bold text-[15px] text-[var(--vco-text)]">
                {Math.round(weather.current.temp)}°C <span className="font-normal text-[var(--vco-text-muted)]">· {weatherIcon.label}</span>
              </p>
              <p className="text-[11px] text-[var(--vco-text-faint)]">
                Walesby Forest · high {Math.round(weather.daily.tempMax)}° / low {Math.round(weather.daily.tempMin)}°
              </p>
            </div>
          </div>
        )}

        {tip && (
          <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-[var(--vco-yellow-soft)] px-3 py-2 text-[11.5px] font-semibold text-[var(--vco-yellow)]">
            <tip.Icon size={14} className="shrink-0" />
            {tip.text}
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">
            <Star size={12} className="fill-[var(--vco-yellow)] stroke-[var(--vco-yellow)]" />
            Your day
          </p>
          {myDay.length === 0 ? (
            <p className="text-[12px] text-[var(--vco-text-muted)]">Nothing starred for today yet — plenty of time to pick something in Lineup.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {myDay.map((act) => (
                <div key={act.id} className="flex items-center gap-2 rounded-lg border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-2.5 py-1.5">
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--vco-text-muted)]">{act.startTime}</span>
                  <span className="truncate text-[12px] font-semibold text-[var(--vco-text)]">{act.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlistVendors.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">
              <Bookmark size={12} />
              Food to try
            </p>
            <div className="flex flex-col gap-1.5">
              {wishlistVendors.map((v) => (
                <p key={v.id} className="truncate text-[12px] font-semibold text-[var(--vco-text)]">
                  {v.name}
                </p>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={dismiss}
          className="tap mt-5 flex w-full items-center justify-center rounded-xl bg-[var(--vco-green)] py-3 text-[13px] font-bold text-white"
        >
          Let's go
        </button>
      </div>
    </div>
  );
}

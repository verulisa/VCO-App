import { useRef, useState } from "react";
import { MapPin, Navigation, Share2, X, ZoomIn, ZoomOut } from "lucide-react";
import Accordion from "../components/Accordion";
import CollapsibleSection from "../components/CollapsibleSection";
import LocationShare from "../components/LocationShare";
import { useLocalStorage } from "../hooks/useLocalStorage";

const NAV_URL = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("Walesby Forest, Nottinghamshire, NG22 9NG");
const MAP_SRC = "map/festival-map.jpg";

// Draws the map plus a red pin at the dropped spot into an offscreen canvas,
// entirely client-side (everything's already service-worker cached) so it
// works with zero signal, then shares or downloads it as an image.
async function shareMapPin(pin, setSharing) {
  setSharing(true);
  try {
    const img = new Image();
    img.src = MAP_SRC;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const x = (pin.xPct / 100) * canvas.width;
    const y = (pin.yPct / 100) * canvas.height;
    const s = canvas.width * 0.035;

    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-s, -s * 1.3, -s * 1.1, -s * 2.4, 0, -s * 2.6);
    ctx.bezierCurveTo(s * 1.1, -s * 2.4, s, -s * 1.3, 0, 0);
    ctx.closePath();
    ctx.fillStyle = "#c1432c";
    ctx.strokeStyle = "#1c2416";
    ctx.lineWidth = s * 0.15;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -s * 1.65, s * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = "#1c2416";
    ctx.fill();
    ctx.restore();

    // JPEG, not PNG — keeps the shared file small (a few hundred KB) which
    // matters when sending it over patchy signal near the venue.
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    const file = new File([blob], "vco-my-spot.jpg", { type: "image/jpeg" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text: "This is where I am at Vegan Camp Out 📍" }).catch(() => {});
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vco-my-spot.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  } finally {
    setSharing(false);
  }
}

export default function MapPage({ info, lineup, vendors }) {
  const [pin, setPin] = useLocalStorage("vco_tent_pin", null);
  const [zoom, setZoom] = useState(1);
  const [sharing, setSharing] = useState(false);
  const imgWrapRef = useRef(null);

  function handleMapClick(e) {
    const rect = imgWrapRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPin({ xPct, yPct });
  }

  const gateItems = info?.gates.map((gate) => ({
    question: gate.name,
    answer: `${gate.use.join(" · ")}${gate.whatThreeWords ? ` — ///${gate.whatThreeWords}` : ""}`,
  }));

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-4">
      <a
        href={NAV_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="tap flex items-center justify-center gap-2 rounded-xl bg-[var(--vco-green)] py-3 text-[13px] font-bold text-white"
      >
        <Navigation size={16} />
        Navigate to Walesby Forest
      </a>
      <p className="-mt-2.5 text-center text-[10.5px] text-[var(--vco-text-faint)]">
        Needs signal — use this on the way there, before you lose coverage on site.
      </p>

      <div className="rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wide text-[var(--vco-text-muted)]">
            Tap the map to drop a pin — e.g. "our tent"
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.3))}
              className="rounded-full border border-[var(--vco-border)] p-1.5"
              aria-label="Zoom in"
            >
              <ZoomIn size={13} className="text-[var(--vco-text)]" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 0.3))}
              className="rounded-full border border-[var(--vco-border)] p-1.5"
              aria-label="Zoom out"
            >
              <ZoomOut size={13} className="text-[var(--vco-text)]" />
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-xl" style={{ maxHeight: "60vh" }}>
          {/* Width lives on this wrapper (not the img) at zoom time, so the
              percentage-positioned pin below tracks the image's actual
              rendered size at every zoom level instead of staying anchored
              to the unzoomed 100% box. */}
          <div
            ref={imgWrapRef}
            onClick={handleMapClick}
            className="relative cursor-crosshair"
            style={{ width: `${zoom * 100}%`, maxWidth: "none" }}
          >
            <img src={MAP_SRC} alt="Vegan Camp Out official festival map" className="w-full select-none" draggable={false} />

            {pin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPin(null);
                }}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${pin.xPct}%`, top: `${pin.yPct}%` }}
                aria-label="Remove pin"
              >
                <MapPin size={28} className="fill-[var(--vco-red)] stroke-[var(--vco-text)] drop-shadow" />
              </button>
            )}
          </div>
        </div>
        {pin && (
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shareMapPin(pin, setSharing)}
              disabled={sharing}
              className="tap flex items-center gap-1.5 rounded-lg bg-[var(--vco-green)] px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-60"
            >
              <Share2 size={12} />
              {sharing ? "Preparing…" : "Share my spot"}
            </button>
            <button type="button" onClick={() => setPin(null)} className="flex items-center gap-1 text-[11px] text-[var(--vco-text-faint)]">
              <X size={11} /> Clear pin
            </button>
          </div>
        )}
      </div>

      {info?.shuttleBus && (
        <CollapsibleSection title="Shuttle Bus" defaultOpen>
          <p className="mb-3 text-[11.5px] leading-relaxed text-[var(--vco-text-muted)]">{info.shuttleBus.price}</p>

          <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide text-[var(--vco-text-faint)]">
            {info.shuttleBus.pickup} → the festival
          </p>
          {info.shuttleBus.toFestival.map((row) => (
            <div key={row.day} className="mb-2.5">
              <p className="mb-1 text-[12px] font-bold text-[var(--vco-text)]">{row.day}</p>
              <div className="flex flex-wrap gap-1.5">
                {row.times.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-2 py-1 font-mono text-[11px] tabular-nums text-[var(--vco-text)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <p className="mb-1.5 mt-1 text-[10.5px] font-bold uppercase tracking-wide text-[var(--vco-text-faint)]">
            The festival → {info.shuttleBus.pickup}
          </p>
          {info.shuttleBus.fromFestival.map((row) => (
            <div key={row.day} className="mb-2.5">
              <p className="mb-1 text-[12px] font-bold text-[var(--vco-text)]">{row.day}</p>
              <div className="flex flex-wrap gap-1.5">
                {row.times.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-2 py-1 font-mono text-[11px] tabular-nums text-[var(--vco-text)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <p className="mt-1 text-[10.5px] leading-relaxed text-[var(--vco-text-faint)]">{info.shuttleBus.note}</p>
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Share where you are">
        <LocationShare lineup={lineup} vendors={vendors} gates={info?.gates} campingZones={info?.campingZones} />
      </CollapsibleSection>

      {info && (
        <CollapsibleSection title="Gates">
          <Accordion items={gateItems} />
        </CollapsibleSection>
      )}
    </div>
  );
}

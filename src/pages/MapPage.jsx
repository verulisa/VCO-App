import { useRef, useState } from "react";
import { MapPin, Navigation, X, ZoomIn, ZoomOut } from "lucide-react";
import Accordion from "../components/Accordion";
import CollapsibleSection from "../components/CollapsibleSection";
import { useLocalStorage } from "../hooks/useLocalStorage";

const NAV_URL = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("Walesby Forest, Nottinghamshire, NG22 9NG");

export default function MapPage({ info }) {
  const [pin, setPin] = useLocalStorage("vco_tent_pin", null);
  const [zoom, setZoom] = useState(1);
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
        className="flex items-center justify-center gap-2 rounded-xl bg-[var(--vco-green)] py-3 text-[13px] font-bold text-white"
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
          <div ref={imgWrapRef} onClick={handleMapClick} className="relative w-full cursor-crosshair">
            <img
              src="map/site-map.jpg"
              alt="Vegan Camp Out official festival map"
              className="w-full select-none"
              style={{ width: `${zoom * 100}%`, maxWidth: "none" }}
              draggable={false}
            />
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
          <button type="button" onClick={() => setPin(null)} className="mt-2 flex items-center gap-1 text-[11px] text-[var(--vco-text-faint)]">
            <X size={11} /> Clear pin
          </button>
        )}
      </div>

      {info && (
        <>
          <CollapsibleSection title="Gates">
            <Accordion items={gateItems} />
          </CollapsibleSection>

          <CollapsibleSection title="Map legend (also printed on the map itself)">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11.5px] text-[var(--vco-text-muted)]">
              {info.legend.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--vco-yellow)]" />
                  {item.label}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </>
      )}
    </div>
  );
}

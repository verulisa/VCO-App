import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { QrCode, Camera, Clipboard, X, Check, Share } from "lucide-react";
import { formatTimeRange } from "../utils/time";

const CODE_PREFIX = "VCO1:";

export function encodeSchedule(savedIds) {
  return `${CODE_PREFIX}${savedIds.join(",")}`;
}

export function decodeSchedule(code) {
  const trimmed = code.trim();
  // Case-insensitive: phone keyboards/autocorrect and some share sheets can
  // silently lowercase text (seen in the wild as "vco1:" instead of "VCO1:").
  if (trimmed.slice(0, CODE_PREFIX.length).toLowerCase() !== CODE_PREFIX.toLowerCase()) return null;
  const ids = trimmed
    .slice(CODE_PREFIX.length)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.length ? ids : null;
}

export default function ScheduleShare({ savedIds, onImport, lineup }) {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [importText, setImportText] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState(null); // { newActs, selected: Set, alreadyCount, unknownCount }
  const [justAdded, setJustAdded] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const resultRef = useRef(null);

  // A scan/paste result can land below the fold of this panel — scroll it
  // into view so it doesn't look like nothing happened.
  useEffect(() => {
    if (preview || scanError) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [preview, scanError]);

  function buildPreview(ids) {
    const byId = new Map((lineup || []).map((a) => [a.id, a]));
    const savedSet = new Set(savedIds);
    let alreadyCount = 0;
    let unknownCount = 0;
    const newActs = [];
    for (const id of ids) {
      const act = byId.get(id);
      if (!act) {
        unknownCount++;
      } else if (savedSet.has(id)) {
        alreadyCount++;
      } else {
        newActs.push(act);
      }
    }
    if (newActs.length === 0) {
      setScanError(
        alreadyCount > 0
          ? "All of those acts are already in your schedule."
          : "That code didn't match any acts in this lineup."
      );
      return;
    }
    setScanError("");
    setPreview({ newActs, selected: new Set(newActs.map((a) => a.id)), alreadyCount, unknownCount });
  }

  function toggleSelected(id) {
    setPreview((prev) => {
      const next = new Set(prev.selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, selected: next };
    });
  }

  async function shareCode() {
    try {
      await navigator.share({ text: code });
    } catch {
      // User cancelled the share sheet — nothing to do.
    }
  }

  function confirmImport() {
    if (!preview) return;
    const ids = Array.from(preview.selected);
    onImport(ids);
    setJustAdded(ids.length);
    setPreview(null);
    setImportText("");
    setTimeout(() => setJustAdded(0), 3000);
  }

  const code = encodeSchedule(savedIds);

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(code, { margin: 1, width: 220, color: { dark: "#12160f", light: "#f2ede0" } }).then(setQrDataUrl);
  }, [open, code]);

  useEffect(() => {
    if (!scanning) return;
    let raf;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const tick = () => {
          if (cancelled) return;
          const video = videoRef.current;
          if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const result = jsQR(imageData.data, imageData.width, imageData.height);
            if (result) {
              const ids = decodeSchedule(result.data);
              if (ids) {
                setScanning(false);
                buildPreview(ids);
                return;
              }
            }
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      })
      .catch(() => setScanError("Couldn't access the camera. You can paste the code below instead."));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [scanning, onImport]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] py-3 text-[13px] font-semibold text-[var(--vco-text)]"
      >
        <QrCode size={16} />
        Share schedule (QR / code)
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-bold text-[13px] text-[var(--vco-text)]">Share your schedule</p>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close">
          <X size={16} className="text-[var(--vco-text-faint)]" />
        </button>
      </div>

      {savedIds.length > 0 ? (
        <>
          <p className="mb-2 text-[11.5px] text-[var(--vco-text-muted)]">
            Let a friend scan this, all offline — no signal needed.
          </p>
          <div className="mx-auto aspect-square w-full max-w-[220px]">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR code of your saved schedule" className="h-full w-full rounded-lg" />
            ) : (
              <div className="skeleton h-full w-full rounded-lg" />
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--vco-surface-raised)] px-2.5 py-2">
            <code className="flex-1 truncate text-[11px] text-[var(--vco-text-muted)]">{code}</code>
            <button type="button" onClick={() => navigator.clipboard?.writeText(code)} aria-label="Copy code">
              <Clipboard size={14} className="text-[var(--vco-text-faint)]" />
            </button>
          </div>
          {typeof navigator !== "undefined" && navigator.share && (
            <button
              type="button"
              onClick={shareCode}
              className="tap mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--vco-green)] py-2 text-[12px] font-semibold text-white"
            >
              <Share size={13} />
              Send via…
            </button>
          )}
        </>
      ) : (
        <p className="mb-3 text-[11.5px] text-[var(--vco-text-muted)]">
          Save a few acts to your schedule first, then come back here to share them.
        </p>
      )}

      <div className="mt-4 border-t border-[var(--vco-border)] pt-3">
        <p className="mb-2 font-bold text-[13px] text-[var(--vco-text)]">Import a friend's schedule</p>

        {scanning ? (
          <div className="relative overflow-hidden rounded-lg">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video ref={videoRef} playsInline muted className="w-full rounded-lg" />
            <button
              type="button"
              onClick={() => setScanning(false)}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
              aria-label="Stop scanning"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setScanError("");
              setScanning(true);
            }}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--vco-border)] py-2.5 text-[12.5px] text-[var(--vco-text)]"
          >
            <Camera size={15} />
            Scan a QR code
          </button>
        )}
        {scanError && (
          <p ref={resultRef} className="mb-2 text-[11px] font-semibold text-[var(--vco-danger-text)]">
            {scanError}
          </p>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={`Paste a ${CODE_PREFIX}… code`}
            className="min-w-0 flex-1 rounded-lg border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-2.5 py-2 text-[12px] text-[var(--vco-text)] outline-none placeholder:text-[var(--vco-text-faint)]"
          />
          <button
            type="button"
            onClick={() => {
              const ids = decodeSchedule(importText);
              if (ids) {
                buildPreview(ids);
              } else {
                setScanError("That doesn't look like a valid schedule code.");
              }
            }}
            className="shrink-0 rounded-lg bg-[var(--vco-green)] px-3 text-[12.5px] font-semibold text-white"
          >
            Add
          </button>
        </div>

        {justAdded > 0 && (
          <p className="mt-2 text-[11.5px] font-semibold text-[var(--vco-green-strong)]">
            Added {justAdded} act{justAdded === 1 ? "" : "s"} to your schedule.
          </p>
        )}

        {preview && (
          <div ref={resultRef} className="mt-3 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] p-3">
            <p className="mb-0.5 text-[12.5px] font-semibold text-[var(--vco-text)]">
              These aren't in your favourites yet — want to add them?
            </p>
            {preview.alreadyCount > 0 && (
              <p className="mb-2 text-[10.5px] text-[var(--vco-text-faint)]">
                {preview.alreadyCount} of the shared acts are already in your schedule, so they're skipped here.
              </p>
            )}
            <div className="mt-2 flex flex-col gap-1.5">
              {preview.newActs.map((act) => {
                const checked = preview.selected.has(act.id);
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => toggleSelected(act.id)}
                    className="tap flex items-start gap-2.5 rounded-lg bg-[var(--vco-surface)] px-2.5 py-2 text-left"
                  >
                    <span
                      className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border ${
                        checked
                          ? "border-[var(--vco-green)] bg-[var(--vco-green)]"
                          : "border-[var(--vco-border)] bg-transparent"
                      }`}
                    >
                      {checked && <Check size={11} className="text-white" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-semibold leading-snug text-[var(--vco-text)]">{act.name}</span>
                      <span className="block text-[10.5px] text-[var(--vco-text-muted)]">
                        {act.stage} · {formatTimeRange(act)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="flex-1 rounded-lg border border-[var(--vco-border)] py-2 text-[12.5px] font-semibold text-[var(--vco-text)]"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={confirmImport}
                disabled={preview.selected.size === 0}
                className="flex-1 rounded-lg bg-[var(--vco-green)] py-2 text-[12.5px] font-semibold text-white disabled:opacity-40"
              >
                Add {preview.selected.size || ""}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

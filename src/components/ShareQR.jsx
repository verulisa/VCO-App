import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Share2, Clipboard, X } from "lucide-react";

export default function ShareQR({ text, triggerLabel = "Share", triggerClassName = "" }) {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(text, { margin: 1, width: 200, color: { dark: "#12160f", light: "#f2ede0" } }).then(setQrDataUrl);
  }, [open, text]);

  async function handleNativeShare() {
    try {
      await navigator.share({ text });
    } catch {
      // User cancelled the share sheet — nothing to do.
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        <Share2 size={13} className="inline -mt-0.5 mr-1" />
        {triggerLabel}
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--vco-text-muted)]">Share</p>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close">
          <X size={14} className="text-[var(--vco-text-faint)]" />
        </button>
      </div>

      <div className="mx-auto aspect-square w-full max-w-[200px]">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR code" className="h-full w-full rounded-lg" />
        ) : (
          <div className="skeleton h-full w-full rounded-lg" />
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-lg bg-[var(--vco-surface)] px-2.5 py-2">
        <p className="flex-1 truncate text-[11px] text-[var(--vco-text-muted)]">{text}</p>
        <button type="button" onClick={() => navigator.clipboard?.writeText(text)} aria-label="Copy text">
          <Clipboard size={13} className="text-[var(--vco-text-faint)]" />
        </button>
      </div>

      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--vco-green)] py-2 text-[12px] font-semibold text-white"
        >
          <Share2 size={13} />
          Send via…
        </button>
      )}
    </div>
  );
}

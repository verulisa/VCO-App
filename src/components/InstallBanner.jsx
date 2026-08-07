import { Share, X } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

export default function InstallBanner() {
  const [dismissed, setDismissed] = useLocalStorage("vco_install_banner_dismissed", false);

  if (dismissed || isStandalone() || typeof window === "undefined") return null;

  return (
    <div className="mx-4 mt-3 flex items-start gap-2.5 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] p-3 text-[12px] text-[var(--vco-text-muted)]">
      <Share size={16} className="mt-0.5 shrink-0 text-[var(--vco-green-strong)]" />
      <div className="flex-1">
        <p className="font-bold text-[var(--vco-text)]">Add this to your Home Screen</p>
        {isIos() ? (
          <p className="mt-0.5">
            Tap the Share icon <Share size={11} className="inline" /> in Safari, then "Add to Home Screen" — this makes
            the app work fully offline and enables reminders.
          </p>
        ) : (
          <p className="mt-0.5">
            Use your browser menu → "Install app" / "Add to Home Screen" so the whole festival works offline, no signal
            needed.
          </p>
        )}
      </div>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss">
        <X size={15} />
      </button>
    </div>
  );
}

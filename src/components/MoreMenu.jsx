import { useEffect, useMemo, useState } from "react";
import { X, Share2, Smartphone, HelpCircle, Info, RefreshCw, ShieldCheck, Coffee, Share, Type, QrCode, ChevronDown, Mail, Bell, BellOff, SearchX } from "lucide-react";
import QRCode from "qrcode";
import Accordion from "./Accordion";
import SearchBar from "./SearchBar";
import { useDismiss } from "../hooks/useDismiss";
import { APP_URL } from "../utils/appUrl";
import { buildFeedbackMailto } from "../utils/feedback";

const SUPPORT_URL = "https://revolut.me/veroni1wc6?currency=GBP&amount=300&note=";

function isStandalone() {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true)
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="border-t border-[var(--vco-border)] py-4 first:border-t-0 first:pt-0">
      <p className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[var(--vco-text-faint)]">
        <Icon size={13} />
        {title}
      </p>
      {children}
    </div>
  );
}

export default function MoreMenu({
  info,
  onClose,
  onReloadData,
  appUpdate,
  lastBackupAt,
  onOpenProfile,
  largeText,
  onToggleLargeText,
  notifications,
}) {
  const { closing, dismiss } = useDismiss(onClose);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [supportQrDataUrl, setSupportQrDataUrl] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [showNotifHelp, setShowNotifHelp] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  // Collapsed by default once already installed — the instructions are
  // dead weight at that point. Still open by default for anyone who hasn't
  // installed yet, so they see how right away.
  const [showInstall, setShowInstall] = useState(() => !isStandalone());
  const [refreshState, setRefreshState] = useState("idle"); // idle | checking

  async function handleRefresh() {
    setRefreshState("checking");
    // Used to just re-check for a new service worker and hope it activated
    // in time for the reload — in practice that race was unreliable and
    // could still land back on the old version. Unregistering and clearing
    // Cache Storage outright is what actually works every time, and it's
    // just as safe for saved data since neither touches localStorage.
    await onReloadData?.();
    await appUpdate?.hardReset();
  }

  useEffect(() => {
    QRCode.toDataURL(APP_URL, { margin: 1, width: 220, color: { dark: "#12160f", light: "#f2ede0" } }).then(setQrDataUrl);
    QRCode.toDataURL(SUPPORT_URL, { margin: 1, width: 180, color: { dark: "#12160f", light: "#f2ede0" } }).then(setSupportQrDataUrl);
  }, []);

  const filteredFaq = useMemo(() => {
    const q = faqSearch.trim().toLowerCase();
    if (!q) return info?.faq ?? [];
    return (info?.faq ?? []).filter(
      (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    );
  }, [info, faqSearch]);

  async function shareApp() {
    try {
      await navigator.share({ title: "Vegan Camp Out — Unofficial Fan App", url: APP_URL });
    } catch {
      // User cancelled the share sheet — nothing to do.
    }
  }

  return (
    <div className={`modal-backdrop fixed inset-0 z-50 bg-black/60 ${closing ? "is-closing" : ""}`} onClick={dismiss}>
      <div
        className={`drawer-col-right drawer-in safe-top ml-auto flex w-[86%] max-w-sm flex-col overflow-y-auto bg-[var(--vco-bg)] p-5 shadow-[var(--vco-shadow)] ${closing ? "is-closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-extrabold text-[16px] text-[var(--vco-text)]">Menu</h2>
          <button type="button" onClick={dismiss} aria-label="Close menu" className="tap">
            <X size={20} className="text-[var(--vco-text-faint)]" />
          </button>
        </div>

        <Section icon={RefreshCw} title="Data">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshState === "checking"}
            className="tap flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] py-3 text-[13px] font-semibold text-[var(--vco-text)] disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshState === "checking" ? "animate-spin" : ""} />
            {refreshState === "checking" ? "Refreshing…" : "Refresh data & app"}
          </button>
          <p className="mt-1.5 text-center text-[10.5px] text-[var(--vco-text-faint)]">
            Re-fetches everything fresh and reloads the app — the same as closing and reopening it. Your saved acts,
            nickname and settings are stored separately and are never touched by this.
          </p>
        </Section>

        <Section icon={Type} title="Display">
          <button
            type="button"
            onClick={onToggleLargeText}
            className="tap flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] py-3 text-[13px] font-semibold text-[var(--vco-text)]"
          >
            <Type size={15} />
            {largeText ? "Switch to normal text size" : "Switch to larger text"}
          </button>
          <p className="mt-1.5 text-center text-[10.5px] text-[var(--vco-text-faint)]">
            Makes everything bigger and easier to read outdoors.
          </p>
        </Section>

        {notifications?.supported && (
          <Section icon={Bell} title="Reminders">
            {notifications.permission === "granted" && (
              <button
                type="button"
                onClick={notifications.toggleEnabled}
                className="tap flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] py-3 text-[13px] font-semibold text-[var(--vco-text)]"
              >
                {notifications.enabled ? <Bell size={15} /> : <BellOff size={15} />}
                {notifications.enabled ? "Turn off reminders" : "Turn reminders back on"}
              </button>
            )}
            {notifications.permission === "default" && (
              <button
                type="button"
                onClick={notifications.requestPermission}
                className="tap flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] py-3 text-[13px] font-semibold text-[var(--vco-text)]"
              >
                <Bell size={15} />
                Enable reminders
              </button>
            )}
            {notifications.permission === "denied" && (
              <p className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3 text-center text-[11.5px] leading-relaxed text-[var(--vco-text-muted)]">
                Reminders were blocked for this app. The app itself can't turn them back on — you'll need to allow
                notifications for this site in your phone's own Settings.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowNotifHelp((v) => !v)}
              className="tap mt-2 flex w-full items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-[var(--vco-text-muted)]"
            >
              <HelpCircle size={13} />
              How reliable is this?
              <ChevronDown size={13} className={`transition-transform ${showNotifHelp ? "rotate-180" : ""}`} />
            </button>
            {showNotifHelp && (
              <div className="reveal-in mt-1 flex flex-col gap-2.5 text-[12px] leading-relaxed text-[var(--vco-text-muted)]">
                <p>
                  These only fire while the app is open on screen — not in the background or with the phone locked.
                  How well that works varies by phone:
                </p>
                <div className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3">
                  <p className="mb-1 font-bold text-[var(--vco-text)]">iPhone (Safari)</p>
                  Only works once the app is added to your Home Screen — and even then, iOS can pause it if the phone's
                  been idle a while.
                </div>
                <div className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3">
                  <p className="mb-1 font-bold text-[var(--vco-text)]">Android (Chrome)</p>
                  Generally more reliable, but battery-saver modes can still delay or skip a reminder.
                </div>
                <p>
                  For anything you really can't miss, "Add schedule to Calendar" in the Schedule tab is the safer bet —
                  your phone's own Calendar app can remind you even offline and fully locked.
                </p>
              </div>
            )}
          </Section>
        )}

        <Section icon={ShieldCheck} title="Back up your data">
          <button
            type="button"
            onClick={onOpenProfile}
            className="tap flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] py-3 text-[13px] font-semibold text-[var(--vco-text)]"
          >
            <ShieldCheck size={15} />
            {lastBackupAt ? "Back up again" : "Back up now"}
          </button>
          <p className="mt-1.5 text-center text-[10.5px] text-[var(--vco-text-faint)]">
            {lastBackupAt
              ? `Last backed up ${new Date(lastBackupAt).toLocaleDateString("en-GB")}. Everything lives only on this phone.`
              : "Everything lives only on this phone — save a copy so you can't lose it."}
          </p>
        </Section>

        <Section icon={Share2} title="Share this app">
          <div className="rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3.5">
            {typeof navigator !== "undefined" && navigator.share && (
              <button
                type="button"
                onClick={shareApp}
                className="tap flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--vco-green)] py-2 text-[11.5px] font-semibold text-white"
              >
                <Share size={13} />
                Share via…
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowQr((v) => !v)}
              className="tap mt-2 flex w-full items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-[var(--vco-text-muted)]"
            >
              <QrCode size={13} />
              {showQr ? "Hide QR code" : "Show QR code"}
              <ChevronDown size={13} className={`transition-transform ${showQr ? "rotate-180" : ""}`} />
            </button>

            {showQr && (
              <div className="reveal-in mt-1 text-center">
                {/* Reserve the image's footprint before it's ready — an async height
                    jump here (adding a 220px image after first paint) can leave
                    content below it unpainted on some Android Chrome versions,
                    inside this fixed + overflow-y:auto drawer. */}
                <div className="mx-auto aspect-square w-full max-w-[220px]">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR code linking to this app" className="h-full w-full rounded-lg" />
                  ) : (
                    <div className="skeleton h-full w-full rounded-lg" />
                  )}
                </div>
                <p className="mt-2 text-[11px] text-[var(--vco-text-muted)]">Scan to open this app on another phone</p>
              </div>
            )}
          </div>
        </Section>

        <Section icon={Smartphone} title="Install as an app">
          <button
            type="button"
            onClick={() => setShowInstall((v) => !v)}
            className="tap flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] py-2.5 text-[11.5px] font-semibold text-[var(--vco-text-muted)]"
          >
            <Smartphone size={13} />
            {showInstall ? "Hide instructions" : isStandalone() ? "Show instructions (already installed)" : "Show instructions"}
            <ChevronDown size={13} className={`transition-transform ${showInstall ? "rotate-180" : ""}`} />
          </button>

          {showInstall && (
            <div className="reveal-in mt-2.5 flex flex-col gap-2.5 text-[12px] leading-relaxed text-[var(--vco-text-muted)]">
              <div className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3">
                <p className="mb-1 font-bold text-[var(--vco-text)]">iPhone (Safari)</p>
                Tap the Share icon, then "Add to Home Screen". Opens like a real app and works fully offline.
              </div>
              <div className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3">
                <p className="mb-1 font-bold text-[var(--vco-text)]">Android (Chrome)</p>
                Tap the ⋮ menu, then "Install app" (or "Add to Home Screen").
              </div>
            </div>
          )}
        </Section>

        {info && (
          <>
            <Section icon={Info} title="Event">
              <div className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3 text-[12.5px] text-[var(--vco-text-muted)]">
                <p className="font-bold text-[var(--vco-text)]">
                  {info.event.name} · {info.event.edition}
                </p>
                <p className="mt-1">{info.event.venue}</p>
              </div>
            </Section>

            <Section icon={HelpCircle} title="FAQ & essentials">
              <SearchBar value={faqSearch} onChange={setFaqSearch} placeholder="Search the FAQ…" />
              {filteredFaq.length === 0 ? (
                <div className="mt-3 flex flex-col items-center gap-2 py-6 text-center">
                  <SearchX size={22} className="text-[var(--vco-text-faint)]" />
                  <p className="text-[11.5px] text-[var(--vco-text-muted)]">No questions match "{faqSearch}".</p>
                </div>
              ) : (
                <div className="mt-3">
                  <Accordion items={filteredFaq} />
                </div>
              )}
            </Section>
          </>
        )}

        <div className="mt-2 border-t border-[var(--vco-border)] pt-4 text-center">
          <p className="mb-3 text-[10px] leading-relaxed text-[var(--vco-text-faint)]">
            Unofficial fan-made app. Not affiliated with, endorsed by, or connected to Vegan Camp Out.
          </p>
          <p className="mb-2 flex items-center justify-center gap-1 text-[11px] text-[var(--vco-text-muted)]">
            Made with <span aria-hidden="true">🤍</span> — 100% free, no ads.
          </p>
          <p className="mb-3 text-[10.5px] text-[var(--vco-text-faint)]">
            If it helped you get around, you're welcome to buy the dev a coffee <Coffee size={11} className="inline -mt-0.5" />
          </p>
          <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="tap inline-block">
            <div className="mx-auto aspect-square w-24">
              {supportQrDataUrl ? (
                <img
                  src={supportQrDataUrl}
                  alt="QR code to send a voluntary tip via Revolut"
                  className="h-full w-full rounded-lg opacity-90"
                />
              ) : (
                <div className="skeleton h-full w-full rounded-lg" />
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-[var(--vco-text-faint)]">Scan to tip via Revolut</p>
          </a>

          <a
            href={buildFeedbackMailto()}
            className="tap mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[var(--vco-text-muted)] underline decoration-dotted underline-offset-2"
          >
            <Mail size={12} />
            Report a problem
          </a>
        </div>
      </div>
    </div>
  );
}

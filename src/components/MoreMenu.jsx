import { useEffect, useState } from "react";
import { X, Share2, Smartphone, HelpCircle, Info, Clipboard, RefreshCw, ShieldCheck, Coffee } from "lucide-react";
import QRCode from "qrcode";
import Accordion from "./Accordion";

const APP_URL = "https://verulisa.github.io/VCO-App/";
const SUPPORT_URL = "https://revolut.me/veroni1wc6?currency=GBP&amount=3&note=";

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

export default function MoreMenu({ info, onClose, onReloadData, appUpdate, lastBackupAt, onOpenProfile }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [supportQrDataUrl, setSupportQrDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshState, setRefreshState] = useState("idle"); // idle | checking

  async function handleRefresh() {
    setRefreshState("checking");
    // Re-fetch data bypassing cache, force a real (no-store) check for a
    // newer service worker, then hard-reload — the same effect as closing
    // and reopening the app, which is the only thing that reliably shows
    // the latest version regardless of how GitHub Pages' caching behaves.
    await Promise.all([onReloadData?.(), appUpdate?.checkNow()]);
    setTimeout(() => window.location.reload(), 400);
  }

  useEffect(() => {
    QRCode.toDataURL(APP_URL, { margin: 1, width: 220, color: { dark: "#12160f", light: "#f2ede0" } }).then(setQrDataUrl);
    QRCode.toDataURL(SUPPORT_URL, { margin: 1, width: 180, color: { dark: "#12160f", light: "#f2ede0" } }).then(setSupportQrDataUrl);
  }, []);

  function copyLink() {
    navigator.clipboard?.writeText(APP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}>
      <div
        className="drawer-col-right page-in safe-top ml-auto flex w-[86%] max-w-sm flex-col overflow-y-auto bg-[var(--vco-bg)] p-5 shadow-[var(--vco-shadow)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-extrabold text-[16px] text-[var(--vco-text)]">Menu</h2>
          <button type="button" onClick={onClose} aria-label="Close menu" className="tap">
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
            Re-fetches everything fresh and reloads the app — the same as closing and reopening it.
          </p>
        </Section>

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
              ? `Last backed up ${new Date(lastBackupAt).toLocaleDateString()}. Everything lives only on this phone.`
              : "Everything lives only on this phone — save a copy so you can't lose it."}
          </p>
        </Section>

        <Section icon={Share2} title="Share this app">
          <div className="rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3.5 text-center">
            {qrDataUrl && <img src={qrDataUrl} alt="QR code linking to this app" className="mx-auto rounded-lg" />}
            <p className="mt-2 text-[11px] text-[var(--vco-text-muted)]">Scan to open this app on another phone</p>
            <button
              type="button"
              onClick={copyLink}
              className="tap mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--vco-surface-raised)] py-2 text-[11.5px] font-semibold text-[var(--vco-text)]"
            >
              <Clipboard size={13} />
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </Section>

        <Section icon={Smartphone} title="Install as an app">
          <div className="flex flex-col gap-2.5 text-[12px] leading-relaxed text-[var(--vco-text-muted)]">
            <div className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3">
              <p className="mb-1 font-bold text-[var(--vco-text)]">iPhone (Safari)</p>
              Tap the Share icon, then "Add to Home Screen". Opens like a real app and works fully offline.
            </div>
            <div className="rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-3">
              <p className="mb-1 font-bold text-[var(--vco-text)]">Android (Chrome)</p>
              Tap the ⋮ menu, then "Install app" (or "Add to Home Screen").
            </div>
          </div>
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
              <Accordion items={info.faq} />
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
          {supportQrDataUrl && (
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="tap inline-block">
              <img src={supportQrDataUrl} alt="QR code to send a voluntary tip via Revolut" className="mx-auto w-24 rounded-lg opacity-90" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

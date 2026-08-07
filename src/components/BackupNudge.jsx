import { ShieldAlert } from "lucide-react";

const REMIND_AFTER_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

export default function BackupNudge({ hasData, lastBackupAt, onOpen }) {
  if (!hasData) return null;
  const stale = !lastBackupAt || Date.now() - new Date(lastBackupAt).getTime() > REMIND_AFTER_MS;
  if (!stale) return null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="mx-4 mt-3 flex items-center gap-2.5 rounded-xl border border-[var(--vco-yellow)]/40 bg-[var(--vco-yellow-soft)] p-3 text-left text-[12px] text-[var(--vco-yellow)]"
    >
      <ShieldAlert size={16} className="shrink-0" />
      <span>
        <b>{lastBackupAt ? "Back up again?" : "You haven't backed up yet"}</b> — everything's only on this phone. Tap
        to save a copy.
      </span>
    </button>
  );
}

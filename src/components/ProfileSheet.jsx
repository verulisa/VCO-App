import { useRef, useState } from "react";
import { Shuffle, X, Download, Upload, ShieldCheck } from "lucide-react";
import { useDismiss } from "../hooks/useDismiss";
import { generateNickname, nicknameEmoji } from "../utils/nicknameWords";
import { buildBackupPayload, downloadBackupFile, readBackupFile, readTentPin } from "../utils/backup";

export default function ProfileSheet({ nickname, onRename, savedIds, vendorRatings, lastBackupAt, onBackedUp, onRestore, onClose }) {
  const { closing, dismiss } = useDismiss(onClose);
  const [draftNickname, setDraftNickname] = useState(nickname);
  const [customInput, setCustomInput] = useState("");
  const [restoreMessage, setRestoreMessage] = useState("");
  const fileInputRef = useRef(null);

  function applyNickname(name) {
    setDraftNickname(name);
    onRename(name);
  }

  function handleDownload() {
    const payload = buildBackupPayload({
      nickname: draftNickname,
      savedIds,
      vendorRatings,
      tentPin: readTentPin(),
    });
    downloadBackupFile(payload);
    onBackedUp();
  }

  async function handleFilePicked(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const payload = await readBackupFile(file);
    if (!payload) {
      setRestoreMessage("That doesn't look like a Vegan Camp Out backup file.");
      return;
    }
    onRestore(payload);
    setDraftNickname(payload.nickname || draftNickname);
    setRestoreMessage("Restored! Your schedule, ratings and pin are back.");
  }

  return (
    <div className={`modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center ${closing ? "is-closing" : ""}`}>
      <div className={`sheet-in max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-[var(--vco-border)] bg-[var(--vco-surface)] p-5 ${closing ? "is-closing" : ""}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-extrabold text-[16px] text-[var(--vco-text)]">Profile</h2>
          <button type="button" onClick={dismiss} aria-label="Close">
            <X size={18} className="text-[var(--vco-text-faint)]" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-[var(--vco-surface-raised)] p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--vco-green)] text-xl">
            {nicknameEmoji(draftNickname)}
          </span>
          <p className="flex-1 font-bold text-[15px] text-[var(--vco-text)]">{draftNickname}</p>
          <button
            type="button"
            onClick={() => applyNickname(generateNickname())}
            aria-label="Shuffle nickname"
            className="rounded-full border border-[var(--vco-border)] p-2"
          >
            <Shuffle size={14} className="text-[var(--vco-text)]" />
          </button>
        </div>

        <div className="mb-5 flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="…or type your own"
            maxLength={24}
            className="min-w-0 flex-1 rounded-lg border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] px-3 py-2 text-[13px] text-[var(--vco-text)] outline-none placeholder:text-[var(--vco-text-faint)]"
          />
          <button
            type="button"
            disabled={!customInput.trim()}
            onClick={() => {
              applyNickname(customInput.trim());
              setCustomInput("");
            }}
            className="shrink-0 rounded-lg border border-[var(--vco-border)] px-3 py-2 text-[12.5px] font-semibold text-[var(--vco-text)] disabled:opacity-40"
          >
            Set
          </button>
        </div>

        <div className="border-t border-[var(--vco-border)] pt-4">
          <p className="mb-1 flex items-center gap-1.5 font-bold text-[13.5px] text-[var(--vco-text)]">
            <ShieldCheck size={15} className="text-[var(--vco-green-strong)]" />
            Back up your data
          </p>
          <p className="mb-3 text-[11.5px] leading-relaxed text-[var(--vco-text-muted)]">
            Everything lives only on this phone — there's no server. Download a backup file and save it in Files /
            iCloud Drive so it survives even if this browser's storage ever gets cleared.
          </p>

          <button
            type="button"
            onClick={handleDownload}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--vco-green)] py-3 text-[13px] font-bold text-white"
          >
            <Download size={16} />
            Download backup
          </button>
          {lastBackupAt && (
            <p className="mb-3 text-center text-[10.5px] text-[var(--vco-text-faint)]">
              Last backed up {new Date(lastBackupAt).toLocaleString("en-GB")}
            </p>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] py-3 text-[13px] font-semibold text-[var(--vco-text)]"
          >
            <Upload size={15} />
            Restore from backup file
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFilePicked} className="hidden" />
          {restoreMessage && <p className="mt-2 text-center text-[11px] text-[var(--vco-green-strong)]">{restoreMessage}</p>}
        </div>
      </div>
    </div>
  );
}

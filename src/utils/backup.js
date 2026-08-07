const BACKUP_VERSION = 1;

// The tent pin lives inside MapPage's own useLocalStorage instance, which
// isn't mounted while other tabs are active — read/write the raw key
// directly here instead of threading that state through the whole app.
export function readTentPin() {
  try {
    const raw = window.localStorage.getItem("vco_tent_pin");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeTentPin(pin) {
  window.localStorage.setItem("vco_tent_pin", JSON.stringify(pin));
}

export function buildBackupPayload({ nickname, savedIds, vendorRatings, tentPin }) {
  return {
    app: "vegan-camp-out",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    nickname,
    savedIds,
    vendorRatings,
    tentPin,
  };
}

export function downloadBackupFile(payload) {
  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vco-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function readBackupFile(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.app !== "vegan-camp-out" || !data.version) return null;
    return data;
  } catch {
    return null;
  }
}

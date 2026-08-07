// A small fixed hue palette, deterministically assigned per stage name so
// the same stage always gets the same colour without hardcoding actual
// stage names (which can vary between test data and the real lineup).
// Used as a low-alpha tint, which reads fine over both light and dark
// surfaces without needing separate per-theme palettes.
const PALETTE = ["#3f7a34", "#2f6ba8", "#a5701c", "#8a3fa0", "#c1432c", "#1c8a83", "#a03f6e", "#4a6b1f"];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function stageColor(stage) {
  const base = PALETTE[hashString(stage || "") % PALETTE.length];
  return { text: base, bg: `${base}1f`, border: `${base}4d` };
}

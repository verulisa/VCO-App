import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

// Mirrors useTheme's pattern: toggles a class on <html>. Uses CSS zoom
// (not transform: scale) because transform creates a new containing block
// for descendant position:fixed elements — that's exactly the bug that
// broke the header/bottom nav earlier — while zoom does not.
export function useTextScale() {
  const [largeText, setLargeText] = useLocalStorage("vco_large_text", false);

  useEffect(() => {
    document.documentElement.classList.toggle("large-text", largeText);
  }, [largeText]);

  function toggleLargeText() {
    setLargeText((v) => !v);
  }

  return { largeText, toggleLargeText };
}

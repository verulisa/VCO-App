import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

const THEME_COLOR = { dark: "#12160f", light: "#f6f4ee" };

export function useTheme() {
  const [theme, setTheme] = useLocalStorage("vco_theme", "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme };
}

import { Menu, Moon, Sun } from "lucide-react";

export default function Header({ nickname, emoji, onNicknameClick, onMenuClick, theme, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-[var(--vco-border)] px-3 py-3 safe-top">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="tap flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--vco-text)]"
        >
          <Menu size={19} />
        </button>
        <img src="brand/logo.jpg" alt="Vegan Camp Out" className="h-[30px] w-[30px] shrink-0 rounded-lg" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[13px] font-extrabold tracking-tight">
            <span className="text-[var(--vco-green-strong)]">Vegan</span>{" "}
            <span className="text-[var(--vco-red)]">CAMP OUT</span>
          </p>
          <span className="mt-0.5 inline-block rounded-full bg-[var(--vco-yellow-soft)] px-1.5 py-[1px] text-[7.5px] font-bold uppercase tracking-wide text-[var(--vco-yellow)]">
            10th Anniversary
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle light / dark mode"
          className="tap flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] text-[var(--vco-text)]"
        >
          {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
        </button>

        <button
          type="button"
          onClick={onNicknameClick}
          className="tap flex max-w-[110px] items-center gap-1 whitespace-nowrap rounded-full border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] py-1 pl-1 pr-2 text-[10.5px] text-[var(--vco-text)]"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--vco-green)] text-[10px]">
            {emoji}
          </span>
          <span className="truncate">{nickname}</span>
        </button>
      </div>
    </header>
  );
}

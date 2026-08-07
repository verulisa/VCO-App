import { Moon, Sun } from "lucide-react";

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none" className="shrink-0">
      <path d="M15 3 L26 25 L4 25 Z" fill="var(--vco-surface)" stroke="#5c9c48" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 25c0-8 2-13 6-16-3 4-3 10 0 16" fill="#5c9c48" />
      <circle cx="15" cy="6.5" r="2.1" fill="#d6553f" />
    </svg>
  );
}

export default function Header({ nickname, emoji, onNicknameClick, theme, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-[var(--vco-border)] px-4 py-3 safe-top">
      <div className="flex min-w-0 items-center gap-2">
        <Logo />
        <div className="min-w-0 leading-tight">
          <p className="truncate font-extrabold text-[12px] tracking-tight text-[var(--vco-text)]">VEGAN CAMP OUT</p>
          <p className="truncate text-[8.5px] uppercase tracking-wide text-[var(--vco-text-muted)]">
            10th Anniversary
          </p>
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
          className="tap flex max-w-[130px] items-center gap-1 whitespace-nowrap rounded-full border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] py-1 pl-1 pr-2 text-[10.5px] text-[var(--vco-text)]"
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

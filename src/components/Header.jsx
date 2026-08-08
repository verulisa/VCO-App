import { Bell, BellOff, Cloud, Menu, Moon, Sun } from "lucide-react";

export default function Header({
  nickname,
  emoji,
  onNicknameClick,
  onMenuClick,
  theme,
  onToggleTheme,
  notifPermission,
  notifEnabled,
  onToggleNotif,
  weatherIcon,
  onOpenMorningCard,
}) {
  const WeatherIcon = weatherIcon?.Icon || Cloud;
  return (
    <header className="header-fixed flex items-center justify-between gap-2 border-b border-[var(--vco-border)] bg-[var(--vco-bg)]/90 px-3 backdrop-blur-md">
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

      <div className="vco-header-right flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onOpenMorningCard}
          aria-label="Today's weather & plan"
          className="tap flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--vco-text-faint)]"
        >
          <WeatherIcon size={15} />
        </button>

        {notifPermission === "granted" && (
          <button
            type="button"
            onClick={onToggleNotif}
            aria-label={notifEnabled ? "Turn off reminders" : "Turn on reminders"}
            className="tap flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] text-[var(--vco-text)]"
          >
            {notifEnabled ? <Bell size={13} /> : <BellOff size={13} className="text-[var(--vco-text-faint)]" />}
          </button>
        )}

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
          className="tap vco-nickname-pill flex max-w-[110px] items-center gap-1 whitespace-nowrap rounded-full border border-[var(--vco-border)] bg-[var(--vco-surface-raised)] py-1 pl-1 pr-2 text-[10.5px] text-[var(--vco-text)]"
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

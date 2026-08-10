import { lazy, Suspense, useState } from "react";
import { RotateCcw } from "lucide-react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import InstallBanner from "./components/InstallBanner";
import NicknamePrompt from "./components/NicknamePrompt";
import MorningCard from "./components/MorningCard";
import WelcomeIntro from "./components/WelcomeIntro";
import SkeletonScreen from "./components/Skeleton";
import HomePage from "./pages/HomePage";
import { useFestivalData } from "./hooks/useFestivalData";
import { useNickname } from "./hooks/useNickname";
import { useTheme } from "./hooks/useTheme";
import { useTextScale } from "./hooks/useTextScale";
import { useSchedule } from "./hooks/useSchedule";
import { useNotifications } from "./hooks/useNotifications";
import { useVendorRatings } from "./hooks/useVendorRatings";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useAppUpdate } from "./hooks/useAppUpdate";
import { useWeather } from "./hooks/useWeather";
import { writeTentPin } from "./utils/backup";
import { todayIso } from "./utils/time";
import { weatherIconFor } from "./utils/weatherIcons";

// Split out of the initial bundle — each pulls in its own weight (ScheduleShare's
// QR camera scanner alone is a big chunk of JS) that a phone loading Home for
// the first time has no reason to download and parse up front.
const LineupPage = lazy(() => import("./pages/LineupPage"));
const SchedulePage = lazy(() => import("./pages/SchedulePage"));
const FoodPage = lazy(() => import("./pages/FoodPage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const ProfileSheet = lazy(() => import("./components/ProfileSheet"));
const MoreMenu = lazy(() => import("./components/MoreMenu"));

export default function App() {
  const { lineup, vendors, info, status, reload } = useFestivalData();
  const appUpdate = useAppUpdate();
  const weather = useWeather();
  const { nickname, emoji, hasNickname, rename } = useNickname();
  const { theme, toggleTheme } = useTheme();
  const { largeText, toggleLargeText } = useTextScale();
  const [tab, setTab] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [lastBackupAt, setLastBackupAt] = useLocalStorage("vco_last_backup_at", null);
  const [welcomeSeen, setWelcomeSeen] = useLocalStorage("vco_welcome_seen", false);
  const [morningCardSeenDate, setMorningCardSeenDate] = useLocalStorage("vco_morning_card_seen_date", null);
  // Lazy-initialised once from the stored date — a fresh calendar day (or a
  // first-ever open) starts with the card due; closing it stamps today's
  // date so it won't pop up again on its own until tomorrow.
  const [showMorningCard, setShowMorningCard] = useState(() => morningCardSeenDate !== todayIso());

  function closeMorningCard() {
    setShowMorningCard(false);
    setMorningCardSeenDate(todayIso());
  }

  const schedule = useSchedule(lineup);
  const vendorRatings = useVendorRatings();
  const notifications = useNotifications(schedule.savedActs);

  function handleRestore(payload) {
    if (payload.nickname) rename(payload.nickname);
    if (Array.isArray(payload.savedIds)) schedule.replaceIds(payload.savedIds);
    if (payload.vendorRatings) vendorRatings.replaceAll(payload.vendorRatings);
    if (payload.tentPin !== undefined) writeTentPin(payload.tentPin);
  }

  const landscapeLock = (
    <div className="landscape-lock">
      <RotateCcw size={30} className="text-[var(--vco-text-faint)]" />
      <p className="font-extrabold text-[15px]">Please rotate back to portrait</p>
      <p className="max-w-[240px] text-[12.5px] text-[var(--vco-text-muted)]">This app is designed for portrait mode only.</p>
    </div>
  );

  if (!hasNickname) {
    return (
      <div className="flex min-h-screen justify-center bg-[var(--vco-bg-alt)]">
        <div className="min-h-screen w-full max-w-[480px] bg-[var(--vco-bg)] text-[var(--vco-text)]">
          <NicknamePrompt onConfirm={rename} />
        </div>
        {landscapeLock}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-[var(--vco-bg-alt)]">
    <div className="relative min-h-screen w-full max-w-[480px] bg-[var(--vco-bg)] text-[var(--vco-text)]">
      <Header
        nickname={nickname}
        emoji={emoji}
        onNicknameClick={() => setShowProfile(true)}
        onMenuClick={() => setShowMenu(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        notifPermission={notifications.permission}
        notifEnabled={notifications.enabled}
        onToggleNotif={notifications.toggleEnabled}
        weatherIcon={weather ? weatherIconFor(weather.current.code) : null}
        onOpenMorningCard={() => setShowMorningCard(true)}
      />
      <div className="header-spacer">
        <InstallBanner />

        {status === "loading" && <SkeletonScreen />}
        {status === "error" && (
          <p className="px-4 py-10 text-center text-[13px] text-[var(--vco-danger-text)]">
            Couldn't load festival data. Open this app once with a signal so it can be cached for offline use.
          </p>
        )}

        {status === "ready" && (
          <Suspense fallback={<SkeletonScreen />}>
            <div key={tab}>
              {tab === "home" && (
                <HomePage
                  lineup={lineup}
                  info={info}
                  isSaved={schedule.isSaved}
                  toggleSave={schedule.toggleSave}
                  notifications={notifications}
                  vendors={vendors}
                  vendorRatings={vendorRatings}
                  onGoToFood={() => setTab("food")}
                  onGoToLineup={() => setTab("lineup")}
                />
              )}
              {tab === "lineup" && <LineupPage lineup={lineup} isSaved={schedule.isSaved} toggleSave={schedule.toggleSave} />}
              {tab === "schedule" && <SchedulePage schedule={schedule} toggleSave={schedule.toggleSave} lineup={lineup} />}
              {tab === "food" && <FoodPage vendors={vendors} vendorRatings={vendorRatings} nickname={nickname} />}
              {tab === "map" && <MapPage info={info} />}
            </div>
          </Suspense>
        )}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {showMenu && (
        <Suspense fallback={null}>
          <MoreMenu
            info={info}
            onClose={() => setShowMenu(false)}
            onReloadData={reload}
            appUpdate={appUpdate}
            lastBackupAt={lastBackupAt}
            onOpenProfile={() => {
              setShowMenu(false);
              setShowProfile(true);
            }}
            largeText={largeText}
            onToggleLargeText={toggleLargeText}
          />
        </Suspense>
      )}

      {showProfile && (
        <Suspense fallback={null}>
          <ProfileSheet
            nickname={nickname}
            onRename={rename}
            savedIds={schedule.savedIds}
            vendorRatings={vendorRatings.ratings}
            lastBackupAt={lastBackupAt}
            onBackedUp={() => setLastBackupAt(new Date().toISOString())}
            onRestore={handleRestore}
            onClose={() => setShowProfile(false)}
          />
        </Suspense>
      )}

      {welcomeSeen && showMorningCard && status === "ready" && (
        <MorningCard
          lineup={lineup}
          isSaved={schedule.isSaved}
          vendors={vendors}
          vendorRatings={vendorRatings}
          weather={weather}
          onClose={closeMorningCard}
        />
      )}

      {!welcomeSeen && <WelcomeIntro onClose={() => setWelcomeSeen(true)} />}
    </div>
    {landscapeLock}
    </div>
  );
}

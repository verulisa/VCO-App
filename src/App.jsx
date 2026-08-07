import { useState } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import InstallBanner from "./components/InstallBanner";
import NicknamePrompt from "./components/NicknamePrompt";
import ProfileSheet from "./components/ProfileSheet";
import MoreMenu from "./components/MoreMenu";
import SkeletonScreen from "./components/Skeleton";
import HomePage from "./pages/HomePage";
import LineupPage from "./pages/LineupPage";
import SchedulePage from "./pages/SchedulePage";
import FoodPage from "./pages/FoodPage";
import MapPage from "./pages/MapPage";
import { useFestivalData } from "./hooks/useFestivalData";
import { useNickname } from "./hooks/useNickname";
import { useTheme } from "./hooks/useTheme";
import { useSchedule } from "./hooks/useSchedule";
import { useNotifications } from "./hooks/useNotifications";
import { useVendorRatings } from "./hooks/useVendorRatings";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useAppUpdate } from "./hooks/useAppUpdate";
import { writeTentPin } from "./utils/backup";

export default function App() {
  const { lineup, vendors, info, status, reload } = useFestivalData();
  const appUpdate = useAppUpdate();
  const { nickname, emoji, hasNickname, rename } = useNickname();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [lastBackupAt, setLastBackupAt] = useLocalStorage("vco_last_backup_at", null);

  const schedule = useSchedule(lineup);
  const vendorRatings = useVendorRatings();
  const notifications = useNotifications(schedule.savedActs);

  function handleRestore(payload) {
    if (payload.nickname) rename(payload.nickname);
    if (Array.isArray(payload.savedIds)) schedule.replaceIds(payload.savedIds);
    if (payload.vendorRatings) vendorRatings.replaceAll(payload.vendorRatings);
    if (payload.tentPin !== undefined) writeTentPin(payload.tentPin);
  }

  if (!hasNickname) {
    return (
      <div className="flex min-h-screen justify-center bg-[var(--vco-bg-alt)]">
        <div className="min-h-screen w-full max-w-[480px] bg-[var(--vco-bg)] text-[var(--vco-text)]">
          <NicknamePrompt onConfirm={rename} />
        </div>
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
          <div key={tab} className="page-in">
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
              />
            )}
            {tab === "lineup" && <LineupPage lineup={lineup} isSaved={schedule.isSaved} toggleSave={schedule.toggleSave} />}
            {tab === "schedule" && <SchedulePage schedule={schedule} toggleSave={schedule.toggleSave} />}
            {tab === "food" && <FoodPage vendors={vendors} vendorRatings={vendorRatings} />}
            {tab === "map" && <MapPage info={info} />}
          </div>
        )}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {showMenu && (
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
        />
      )}

      {showProfile && (
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
      )}
    </div>
    </div>
  );
}

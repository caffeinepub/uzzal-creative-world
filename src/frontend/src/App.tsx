import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  Bookmark,
  Download,
  Home,
  Menu,
  Moon,
  Palette,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Profile } from "./backend.d";
import HomePage from "./components/HomePage";
import AdvancedSection from "./components/settings/AdvancedSection";
import AppearanceSection from "./components/settings/AppearanceSection";
import BookmarksSection from "./components/settings/BookmarksSection";
import NotificationsSection from "./components/settings/NotificationsSection";
import PrivacySection from "./components/settings/PrivacySection";
import SearchSection from "./components/settings/SearchSection";
import UserProfileSection from "./components/settings/UserProfileSection";
import { useActor } from "./hooks/useActor";
import { usePWAInstall } from "./hooks/usePWAInstall";

type View = "home" | "settings";
type Section =
  | "appearance"
  | "bookmarks"
  | "search"
  | "privacy"
  | "notifications"
  | "profile"
  | "advanced";

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
  {
    id: "bookmarks",
    label: "Bookmarks Settings",
    icon: <Bookmark size={18} />,
  },
  { id: "search", label: "Search Settings", icon: <Search size={18} /> },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: <ShieldCheck size={18} />,
  },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  { id: "profile", label: "User Profile", icon: <User size={18} /> },
  { id: "advanced", label: "Advanced Settings", icon: <Settings size={18} /> },
];

const DEFAULT_PROFILE: Profile = {
  displayName: "Uzzal",
  appearance: { theme: "dark", fontSize: BigInt(14), colorScheme: "blue" },
  bookmarks: { defaultBookmarkFolder: "General", bookmarksBarVisible: true },
  search: { safeSearchEnabled: true, defaultSearchEngine: "Google" },
  privacy: { doNotTrack: false, cookiePreferences: "allow" },
  notifications: { notificationsEnabled: true, notificationSound: "default" },
  advanced: { hardwareAcceleration: true, proxySettings: "" },
};

export default function App() {
  const [view, setView] = useState<View>("home");
  const [activeSection, setActiveSection] = useState<Section>("appearance");
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { actor, isFetching } = useActor();
  const { canInstall, install } = usePWAInstall();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getSettings()
      .then((p) => {
        setProfile(p);
        setIsDark(p.appearance.theme !== "light");
      })
      .catch(() => {});
  }, [actor, isFetching]);

  const updateProfile = useCallback(
    (updater: (prev: Profile) => Profile) => {
      setProfile((prev) => {
        const next = updater(prev);
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
          actor
            ?.saveSettings(next)
            .then(() => toast.success("Settings saved"))
            .catch(() => toast.error("Failed to save settings"));
        }, 1000);
        return next;
      });
    },
    [actor],
  );

  const handleThemeChange = (theme: string) => {
    updateProfile((p) => ({ ...p, appearance: { ...p.appearance, theme } }));
    setIsDark(theme !== "light");
  };

  const handleNavSelect = (id: Section) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const activeSectionLabel =
    NAV_ITEMS.find((n) => n.id === activeSection)?.label ?? "";

  if (view === "home") {
    return (
      <div className="relative min-h-screen bg-background">
        <Toaster position="bottom-right" />
        <HomePage canInstall={canInstall} onInstall={install} />
        {/* Bottom Nav */}
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-card border border-border shadow-xl z-50">
          <button
            type="button"
            data-ocid="nav.home.link"
            onClick={() => setView("home")}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl bg-primary/15 text-primary transition-all text-[10px] font-semibold"
          >
            <Home size={16} />
            Home
          </button>
          {canInstall && (
            <button
              type="button"
              data-ocid="nav.install.button"
              onClick={install}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all text-[10px] font-medium border border-primary/30 text-primary"
            >
              <Download size={16} />
              Install
            </button>
          )}
          <button
            type="button"
            data-ocid="nav.settings.link"
            onClick={() => setView("settings")}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all text-[10px] font-medium"
          >
            <Settings size={16} />
            Settings
          </button>
        </nav>
      </div>
    );
  }

  // Settings view
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Toaster position="bottom-right" />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            data-ocid="settings.sidebar.backdrop"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-[260px] shrink-0 border-r border-border transition-transform duration-300 md:relative md:translate-x-0 md:flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ background: "oklch(var(--sidebar))" }}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shrink-0"
            style={{
              background: "oklch(var(--primary))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            U
          </div>
          <div className="flex flex-col leading-tight flex-1">
            <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              Uzzal Creative
            </span>
            <span className="text-[13px] font-bold text-foreground">World</span>
          </div>
          <button
            type="button"
            data-ocid="settings.sidebar.close_button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <nav
          className="flex-1 px-3 py-4 space-y-0.5"
          data-ocid="settings.nav.panel"
        >
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`settings.${item.id}.link`}
              onClick={() => handleNavSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] font-medium transition-all duration-150 ${
                activeSection === item.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span
                className={`transition-colors ${activeSection === item.id ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-border flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">Theme</span>
          <button
            type="button"
            data-ocid="settings.theme.toggle"
            onClick={() => handleThemeChange(isDark ? "light" : "dark")}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border md:hidden">
          <button
            type="button"
            data-ocid="settings.sidebar.open_modal_button"
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </button>
          <span className="text-[14px] font-semibold text-foreground flex-1">
            {activeSectionLabel}
          </span>
          {canInstall && (
            <button
              type="button"
              data-ocid="settings.install.button"
              onClick={install}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 transition-all"
            >
              <Download size={12} />
              Install
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <h1 className="hidden md:block text-3xl font-bold text-foreground mb-6">
                  {activeSectionLabel}
                </h1>

                {activeSection === "appearance" && (
                  <AppearanceSection
                    profile={profile}
                    onChange={updateProfile}
                    onSave={() => setView("home")}
                  />
                )}
                {activeSection === "bookmarks" && (
                  <BookmarksSection
                    profile={profile}
                    onChange={updateProfile}
                  />
                )}
                {activeSection === "search" && (
                  <SearchSection profile={profile} onChange={updateProfile} />
                )}
                {activeSection === "privacy" && (
                  <PrivacySection profile={profile} onChange={updateProfile} />
                )}
                {activeSection === "notifications" && (
                  <NotificationsSection
                    profile={profile}
                    onChange={updateProfile}
                  />
                )}
                {activeSection === "profile" && (
                  <UserProfileSection
                    profile={profile}
                    onChange={updateProfile}
                  />
                )}
                {activeSection === "advanced" && (
                  <AdvancedSection profile={profile} onChange={updateProfile} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Nav */}
        <nav className="flex items-center justify-center gap-2 px-4 py-2 border-t border-border">
          <button
            type="button"
            data-ocid="nav.home.link"
            onClick={() => setView("home")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all text-xs font-medium"
          >
            <Home size={14} /> Home
          </button>
          {canInstall && (
            <button
              type="button"
              data-ocid="nav.install.button"
              onClick={install}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all text-xs font-medium border border-primary/30 text-primary"
            >
              <Download size={14} /> Install
            </button>
          )}
          <button
            type="button"
            data-ocid="nav.settings.link"
            onClick={() => setView("settings")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/15 text-primary transition-all text-xs font-semibold"
          >
            <Settings size={14} /> Settings
          </button>
        </nav>
      </main>
    </div>
  );
}

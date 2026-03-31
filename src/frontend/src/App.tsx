import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  Bookmark,
  Moon,
  Palette,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Profile } from "./backend.d";
import AdvancedSection from "./components/settings/AdvancedSection";
import AppearanceSection from "./components/settings/AppearanceSection";
import BookmarksSection from "./components/settings/BookmarksSection";
import NotificationsSection from "./components/settings/NotificationsSection";
import PrivacySection from "./components/settings/PrivacySection";
import SearchSection from "./components/settings/SearchSection";
import UserProfileSection from "./components/settings/UserProfileSection";
import { useActor } from "./hooks/useActor";

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
  const [activeSection, setActiveSection] = useState<Section>("appearance");
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isDark, setIsDark] = useState(true);
  const { actor, isFetching } = useActor();
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

  const activeSectionLabel =
    NAV_ITEMS.find((n) => n.id === activeSection)?.label ?? "";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Toaster position="bottom-right" />

      <aside
        className="flex flex-col w-[260px] shrink-0 border-r border-border"
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
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              Uzzal Creative
            </span>
            <span className="text-[13px] font-bold text-foreground">World</span>
          </div>
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
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] font-medium transition-all duration-150 ${
                activeSection === item.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span
                className={`transition-colors ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
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
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <h1 className="text-3xl font-bold text-foreground mb-6">
                  {activeSectionLabel}
                </h1>

                {activeSection === "appearance" && (
                  <AppearanceSection
                    profile={profile}
                    onChange={updateProfile}
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

          <footer className="text-center text-[11px] text-muted-foreground py-6 border-t border-border mt-4">
            © {new Date().getFullYear()} UZZAL CREATIVE WORLD. Built with ❤️
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </footer>
        </ScrollArea>
      </main>
    </div>
  );
}

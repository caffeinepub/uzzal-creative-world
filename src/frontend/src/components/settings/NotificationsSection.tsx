import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Profile } from "../../backend.d";
import SettingRow from "./SettingRow";
import SettingsCard from "./SettingsCard";

interface Props {
  profile: Profile;
  onChange: (updater: (prev: Profile) => Profile) => void;
}

export default function NotificationsSection({ profile, onChange }: Props) {
  const siteNotifPerm = localStorage.getItem("ucw_site_notif") || "allow";
  const appUpdateNotif =
    localStorage.getItem("ucw_app_update_notif") !== "false";

  return (
    <div>
      <SettingsCard
        title="Notification Preferences"
        description="Control what alerts you receive"
      >
        <SettingRow
          label="Bookmark Update Notifications"
          description="Get notified when bookmarks change"
          className="border-b border-border"
        >
          <Switch
            data-ocid="notifications.bookmarks.switch"
            checked={profile.notifications.notificationsEnabled}
            onCheckedChange={(v) =>
              onChange((p) => ({
                ...p,
                notifications: { ...p.notifications, notificationsEnabled: v },
              }))
            }
            className="ios-toggle"
          />
        </SettingRow>

        <SettingRow
          label="Site Notifications"
          description="Control site permission requests"
          className="border-b border-border"
        >
          <Select
            value={siteNotifPerm}
            onValueChange={(v) => {
              localStorage.setItem("ucw_site_notif", v);
              onChange((p) => p);
            }}
          >
            <SelectTrigger
              data-ocid="notifications.site.select"
              className="w-32 bg-secondary border-border"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allow">Allow</SelectItem>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="ask">Ask</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow
          label="App Update Notifications"
          description="Be notified of new app versions"
        >
          <Switch
            data-ocid="notifications.appupdate.switch"
            checked={appUpdateNotif}
            onCheckedChange={(v) => {
              localStorage.setItem("ucw_app_update_notif", String(v));
              onChange((p) => p);
            }}
            className="ios-toggle"
          />
        </SettingRow>
      </SettingsCard>
    </div>
  );
}

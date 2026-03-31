import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "../../backend.d";
import SettingRow from "./SettingRow";
import SettingsCard from "./SettingsCard";

interface Props {
  profile: Profile;
  onChange: (updater: (prev: Profile) => Profile) => void;
}

export default function PrivacySection({ profile, onChange }: Props) {
  const vpnEnabled = localStorage.getItem("ucw_vpn") === "true";
  const autofill = localStorage.getItem("ucw_autofill") !== "false";

  const handleClear = (type: string) => {
    toast.success(`${type} cleared successfully`);
  };

  return (
    <div>
      <SettingsCard title="VPN" description="Proton VPN integration">
        <SettingRow
          label="Proton VPN"
          description="Encrypt your internet connection"
        >
          <Badge
            variant={vpnEnabled ? "default" : "secondary"}
            className={vpnEnabled ? "bg-green-600 text-white" : ""}
          >
            {vpnEnabled ? "Active" : "Inactive"}
          </Badge>
          <Switch
            data-ocid="privacy.vpn.switch"
            checked={vpnEnabled}
            onCheckedChange={(v) => {
              localStorage.setItem("ucw_vpn", String(v));
              onChange((p) => p);
            }}
            className="ios-toggle"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Clear Browsing Data"
        description="Remove stored browser data"
      >
        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            data-ocid="privacy.clearcache.button"
            variant="secondary"
            onClick={() => handleClear("Cache")}
            className="gap-2"
          >
            <Trash2 size={14} /> Clear Cache
          </Button>
          <Button
            data-ocid="privacy.clearcookies.button"
            variant="secondary"
            onClick={() => handleClear("Cookies")}
            className="gap-2"
          >
            <Trash2 size={14} /> Clear Cookies
          </Button>
          <Button
            data-ocid="privacy.clearhistory.button"
            variant="destructive"
            onClick={() => handleClear("History")}
            className="gap-2"
          >
            <Trash2 size={14} /> Clear History
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Privacy Controls"
        description="Manage tracking and autofill"
      >
        <SettingRow
          label="Do Not Track"
          description="Request sites not to track your activity"
          className="border-b border-border"
        >
          <Switch
            data-ocid="privacy.donottrack.switch"
            checked={profile.privacy.doNotTrack}
            onCheckedChange={(v) =>
              onChange((p) => ({
                ...p,
                privacy: { ...p.privacy, doNotTrack: v },
              }))
            }
            className="ios-toggle"
          />
        </SettingRow>
        <SettingRow
          label="Password Manager & Auto-fill"
          description="Auto-fill saved passwords and forms"
        >
          <Switch
            data-ocid="privacy.autofill.switch"
            checked={autofill}
            onCheckedChange={(v) => {
              localStorage.setItem("ucw_autofill", String(v));
              onChange((p) => p);
            }}
            className="ios-toggle"
          />
        </SettingRow>
      </SettingsCard>
    </div>
  );
}

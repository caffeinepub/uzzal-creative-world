import { Switch } from "@/components/ui/switch";
import type { Profile } from "../../backend.d";
import SegmentedControl from "./SegmentedControl";
import SettingRow from "./SettingRow";
import SettingsCard from "./SettingsCard";

interface Props {
  profile: Profile;
  onChange: (updater: (prev: Profile) => Profile) => void;
}

export default function SearchSection({ profile, onChange }: Props) {
  const voiceSearch = localStorage.getItem("ucw_voice_search") === "true";

  return (
    <div>
      <SettingsCard
        title="Default Search Engine"
        description="Choose your preferred search provider"
      >
        <SegmentedControl
          data-ocid="search.engine.toggle"
          options={[
            { value: "Google", label: "Google" },
            { value: "Bing", label: "Bing" },
            { value: "DuckDuckGo", label: "DuckDuckGo" },
          ]}
          value={profile.search.defaultSearchEngine}
          onChange={(v) =>
            onChange((p) => ({
              ...p,
              search: { ...p.search, defaultSearchEngine: v },
            }))
          }
        />
      </SettingsCard>

      <SettingsCard
        title="Search Behavior"
        description="Configure how search works"
      >
        <SettingRow
          label="Auto Suggestions"
          description="Show search suggestions as you type"
          className="border-b border-border"
        >
          <Switch
            data-ocid="search.autosuggestions.switch"
            checked={profile.search.safeSearchEnabled}
            onCheckedChange={(v) =>
              onChange((p) => ({
                ...p,
                search: { ...p.search, safeSearchEnabled: v },
              }))
            }
            className="ios-toggle"
          />
        </SettingRow>
        <SettingRow
          label="Voice Search"
          description="Enable microphone-based search"
        >
          <Switch
            data-ocid="search.voicesearch.switch"
            checked={voiceSearch}
            onCheckedChange={(v) => {
              localStorage.setItem("ucw_voice_search", String(v));
              onChange((p) => p);
            }}
            className="ios-toggle"
          />
        </SettingRow>
      </SettingsCard>
    </div>
  );
}

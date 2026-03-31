import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../../backend.d";
import SettingRow from "./SettingRow";
import SettingsCard from "./SettingsCard";

const BG_SWATCHES = [
  "#0B0F14",
  "#1A1035",
  "#0D2137",
  "#0E2D1F",
  "#2D1010",
  "#1A1A1A",
  "#2C1654",
  "#0A2E2E",
];

interface Props {
  profile: Profile;
  onChange: (updater: (prev: Profile) => Profile) => void;
}

export default function UserProfileSection({ profile, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState(
    localStorage.getItem("ucw_avatar") || "",
  );
  const sortStyle = localStorage.getItem("ucw_bookmark_sort") || "az";

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setAvatarSrc(src);
      localStorage.setItem("ucw_avatar", src);
      toast.success("Profile picture updated");
    };
    reader.readAsDataURL(file);
  };

  const initials = profile.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <SettingsCard title="Profile" description="Your personal information">
        <div className="flex items-center gap-5 mb-5">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              data-ocid="profile.avatar.upload_button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
              style={{ background: "oklch(var(--primary))" }}
            >
              <Camera size={12} color="white" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">
              {profile.displayName || "Unknown User"}
            </p>
            <p className="text-[12px] text-muted-foreground">
              Click camera to update photo
            </p>
          </div>
        </div>

        <SettingRow label="Display Name" className="border-t border-border">
          <Input
            data-ocid="profile.displayname.input"
            value={profile.displayName}
            onChange={(e) =>
              onChange((p) => ({ ...p, displayName: e.target.value }))
            }
            className="w-48 bg-secondary border-border"
            placeholder="Your name"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Custom Background"
        description="Set the app background color"
      >
        <div
          className="flex flex-wrap gap-3 pt-1"
          data-ocid="profile.background.panel"
        >
          {BG_SWATCHES.map((hex) => (
            <button
              type="button"
              key={hex}
              onClick={() => {
                localStorage.setItem("ucw_bg", hex);
                onChange((p) => p);
                toast.success("Background updated");
              }}
              className="w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform"
              style={{
                background: hex,
                borderColor:
                  localStorage.getItem("ucw_bg") === hex
                    ? "oklch(var(--primary))"
                    : "transparent",
              }}
              title={hex}
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Bookmark Sort Style"
        description="Default sorting for your bookmarks"
      >
        <Select
          value={sortStyle}
          onValueChange={(v) => {
            localStorage.setItem("ucw_bookmark_sort", v);
            onChange((p) => p);
          }}
        >
          <SelectTrigger
            data-ocid="profile.bookmarksort.select"
            className="w-48 bg-secondary border-border"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="az">A–Z</SelectItem>
            <SelectItem value="date">Date Added</SelectItem>
            <SelectItem value="visited">Most Visited</SelectItem>
          </SelectContent>
        </Select>
      </SettingsCard>
    </div>
  );
}

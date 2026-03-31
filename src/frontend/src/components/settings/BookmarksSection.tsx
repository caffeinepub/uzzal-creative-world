import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import type { Profile } from "../../backend.d";
import SegmentedControl from "./SegmentedControl";
import SettingRow from "./SettingRow";
import SettingsCard from "./SettingsCard";

const SAMPLE_BOOKMARKS = [
  { id: 1, title: "Google", url: "https://google.com", category: "Search" },
  {
    id: 2,
    title: "GitHub",
    url: "https://github.com",
    category: "Development",
  },
  {
    id: 3,
    title: "YouTube",
    url: "https://youtube.com",
    category: "Entertainment",
  },
];

interface Props {
  profile: Profile;
  onChange: (updater: (prev: Profile) => Profile) => void;
}

export default function BookmarksSection({ profile, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const bookmarkView = localStorage.getItem("ucw_bookmark_view") || "card";
  const sortByCategory = profile.bookmarks.bookmarksBarVisible;

  const handleExport = () => {
    const data = JSON.stringify(SAMPLE_BOOKMARKS, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Bookmarks exported!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`Imported: ${file.name}`);
  };

  return (
    <div>
      <SettingsCard
        title="Organization"
        description="How bookmarks are sorted and displayed"
      >
        <SettingRow
          label="Sort by Category"
          description="Group bookmarks by category"
          className="border-b border-border"
        >
          <Switch
            data-ocid="bookmarks.sort.switch"
            checked={sortByCategory}
            onCheckedChange={(v) =>
              onChange((p) => ({
                ...p,
                bookmarks: { ...p.bookmarks, bookmarksBarVisible: v },
              }))
            }
            className="ios-toggle"
          />
        </SettingRow>
        <SettingRow label="Bookmark View" description="Choose display style">
          <SegmentedControl
            data-ocid="bookmarks.view.toggle"
            options={[
              { value: "card", label: "Card View" },
              { value: "list", label: "List View" },
            ]}
            value={bookmarkView}
            onChange={(v) => {
              localStorage.setItem("ucw_bookmark_view", v);
              onChange((p) => p);
            }}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Import & Export"
        description="Manage your bookmark data"
      >
        <div className="flex gap-3">
          <Button
            data-ocid="bookmarks.import.button"
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            className="gap-2"
          >
            <Upload size={15} /> Import Bookmarks
          </Button>
          <Button
            data-ocid="bookmarks.export.button"
            variant="secondary"
            onClick={handleExport}
            className="gap-2"
          >
            <Download size={15} /> Export Bookmarks
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </SettingsCard>
    </div>
  );
}

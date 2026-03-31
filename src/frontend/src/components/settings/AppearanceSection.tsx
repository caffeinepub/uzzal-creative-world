import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Profile } from "../../backend.d";
import SegmentedControl from "./SegmentedControl";
import SettingRow from "./SettingRow";
import SettingsCard from "./SettingsCard";

const COLOR_SWATCHES = [
  { id: "blue", hex: "#2F80FF" },
  { id: "indigo", hex: "#6366F1" },
  { id: "violet", hex: "#8B5CF6" },
  { id: "pink", hex: "#EC4899" },
  { id: "rose", hex: "#F43F5E" },
  { id: "orange", hex: "#F97316" },
  { id: "amber", hex: "#F59E0B" },
  { id: "green", hex: "#22C55E" },
  { id: "teal", hex: "#14B8A6" },
  { id: "cyan", hex: "#06B6D4" },
];

const FONT_STYLES = ["Inter", "Roboto", "Open Sans", "Poppins", "Nunito"];

interface Props {
  profile: Profile;
  onChange: (updater: (prev: Profile) => Profile) => void;
}

export default function AppearanceSection({ profile, onChange }: Props) {
  const fontSize = Number(profile.appearance.fontSize) || 14;
  const colorScheme = profile.appearance.colorScheme || "blue";
  const fontStyle = localStorage.getItem("ucw_font_style") || "Inter";

  const setFontStyle = (v: string) => {
    localStorage.setItem("ucw_font_style", v);
    document.body.style.fontFamily = `'${v}', system-ui, sans-serif`;
  };

  return (
    <div>
      <SettingsCard title="Theme" description="Choose the app's color mode">
        <SettingRow label="Color Mode">
          <SegmentedControl
            data-ocid="appearance.theme.toggle"
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "auto", label: "Auto" },
            ]}
            value={profile.appearance.theme}
            onChange={(theme) =>
              onChange((p) => ({
                ...p,
                appearance: { ...p.appearance, theme },
              }))
            }
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Custom Color Theme"
        description="Pick an accent color"
      >
        <div
          className="flex flex-wrap gap-3 pt-1"
          data-ocid="appearance.color.panel"
        >
          {COLOR_SWATCHES.map((swatch) => (
            <button
              type="button"
              key={swatch.id}
              onClick={() =>
                onChange((p) => ({
                  ...p,
                  appearance: { ...p.appearance, colorScheme: swatch.id },
                }))
              }
              className={`w-8 h-8 rounded-lg transition-all duration-150 ${
                colorScheme === swatch.id
                  ? "ring-2 ring-offset-2 ring-offset-card scale-110"
                  : "hover:scale-105"
              }`}
              style={{ background: swatch.hex }}
              title={swatch.id}
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Typography" description="Customize text appearance">
        <SettingRow
          label="Font Size"
          description={`${fontSize}px`}
          className="border-b border-border"
        >
          <div className="w-40">
            <Slider
              data-ocid="appearance.fontsize.input"
              min={12}
              max={24}
              step={1}
              value={[fontSize]}
              onValueChange={([v]) =>
                onChange((p) => ({
                  ...p,
                  appearance: { ...p.appearance, fontSize: BigInt(v) },
                }))
              }
            />
          </div>
        </SettingRow>
        <SettingRow label="Font Style">
          <Select
            value={fontStyle}
            onValueChange={(v) => {
              setFontStyle(v);
              onChange((p) => p);
            }}
          >
            <SelectTrigger
              data-ocid="appearance.fontstyle.select"
              className="w-40 bg-secondary border-border"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_STYLES.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingRow>
      </SettingsCard>
    </div>
  );
}

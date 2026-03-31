import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Profile } from "../../backend.d";
import SettingRow from "./SettingRow";
import SettingsCard from "./SettingsCard";

interface Props {
  profile: Profile;
  onChange: (updater: (prev: Profile) => Profile) => void;
}

function NetworkMonitor() {
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const lastTimeRef = useRef(performance.now());
  const countRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const pingServer = async () => {
      const start = performance.now();
      try {
        await fetch(window.location.origin, {
          method: "HEAD",
          cache: "no-store",
        });
      } catch {}
      setLatency(Math.round(performance.now() - start));
    };

    const tick = (now: number) => {
      countRef.current++;
      if (now - lastTimeRef.current >= 1000) {
        setFps(countRef.current);
        countRef.current = 0;
        lastTimeRef.current = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    const pingInterval = setInterval(pingServer, 3000);
    pingServer();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(pingInterval);
    };
  }, []);

  return (
    <div
      className="mt-3 flex gap-4 p-4 rounded-xl"
      style={{ background: "oklch(var(--secondary))" }}
    >
      <div className="flex items-center gap-2">
        <Activity size={15} className="text-primary" />
        <span className="text-[13px] text-muted-foreground">FPS:</span>
        <span className="text-[13px] font-semibold text-foreground">{fps}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-muted-foreground">Latency:</span>
        <span className="text-[13px] font-semibold text-foreground">
          {latency}ms
        </span>
      </div>
    </div>
  );
}

export default function AdvancedSection({ profile, onChange }: Props) {
  const devMode = localStorage.getItem("ucw_dev_mode") === "true";
  const netMonitor = localStorage.getItem("ucw_net_monitor") === "true";

  return (
    <div>
      <SettingsCard
        title="Developer Tools"
        description="Advanced developer options"
      >
        <SettingRow
          label="Developer Mode"
          description="Enable browser DevTools and console access"
        >
          <Badge
            variant={devMode ? "default" : "secondary"}
            className={`mr-2 ${devMode ? "bg-primary text-primary-foreground" : ""}`}
          >
            {devMode ? "DevTools ON" : "Off"}
          </Badge>
          <Switch
            data-ocid="advanced.devmode.switch"
            checked={devMode}
            onCheckedChange={(v) => {
              localStorage.setItem("ucw_dev_mode", String(v));
              onChange((p) => p);
            }}
            className="ios-toggle"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Proxy Settings"
        description="Configure network proxy"
      >
        <Input
          data-ocid="advanced.proxy.input"
          value={profile.advanced.proxySettings}
          onChange={(e) =>
            onChange((p) => ({
              ...p,
              advanced: { ...p.advanced, proxySettings: e.target.value },
            }))
          }
          placeholder="e.g. http://proxy.example.com:8080"
          className="bg-secondary border-border"
        />
      </SettingsCard>

      <SettingsCard
        title="Network Performance Monitor"
        description="Live FPS and latency display"
      >
        <SettingRow
          label="Enable Monitor"
          description="Show real-time network stats"
        >
          <Switch
            data-ocid="advanced.netmonitor.switch"
            checked={netMonitor}
            onCheckedChange={(v) => {
              localStorage.setItem("ucw_net_monitor", String(v));
              onChange((p) => p);
            }}
            className="ios-toggle"
          />
        </SettingRow>
        {netMonitor && <NetworkMonitor />}
      </SettingsCard>
    </div>
  );
}

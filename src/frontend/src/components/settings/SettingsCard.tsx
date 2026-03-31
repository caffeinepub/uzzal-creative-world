import type { ReactNode } from "react";

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingsCard({
  title,
  description,
  children,
}: SettingsCardProps) {
  return (
    <div
      className="rounded-2xl border border-border p-6 mb-4"
      style={{ background: "oklch(var(--card))" }}
    >
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

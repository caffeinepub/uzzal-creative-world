import type { ReactNode } from "react";

interface SettingRowProps {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function SettingRow({
  label,
  description,
  children,
  className,
}: SettingRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${className ?? ""}`.trim()}
    >
      <div className="flex flex-col">
        <span className="text-[14px] font-medium text-foreground">{label}</span>
        {description && (
          <span className="text-[12px] text-muted-foreground mt-0.5">
            {description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">{children}</div>
    </div>
  );
}

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  "data-ocid"?: string;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  "data-ocid": dataOcid,
}: SegmentedControlProps) {
  return (
    <div
      data-ocid={dataOcid}
      className="inline-flex rounded-xl p-1 gap-1"
      style={{ background: "oklch(var(--secondary))" }}
    >
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
            value === opt.value
              ? "text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{
            background:
              value === opt.value ? "oklch(var(--primary))" : "transparent",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

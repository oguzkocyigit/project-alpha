export type SegmentedOption<T extends string> = { value: T; label: string };

export default function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="mb-4 grid gap-1 rounded-sm border border-mil-border bg-mil-surface p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              "rounded-sm py-2 text-xs font-semibold uppercase tracking-wide transition-colors " +
              (isActive ? "bg-mil-brass text-mil-bg" : "text-mil-muted hover:text-mil-ink")
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

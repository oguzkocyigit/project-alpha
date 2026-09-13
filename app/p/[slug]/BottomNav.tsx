"use client";

import { Dumbbell, ShieldCheck } from "lucide-react";
import type { AppSection } from "./ProtocolApp";

const TABS: { section: AppSection; label: string; icon: typeof ShieldCheck }[] = [
  { section: "protocol", label: "Protokol", icon: ShieldCheck },
  { section: "workout", label: "Antrenman", icon: Dumbbell },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: AppSection;
  onChange: (section: AppSection) => void;
}) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-mil-border bg-mil-surface/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {TABS.map(({ section, label, icon: Icon }) => {
          const isActive = section === active;
          return (
            <button
              key={section}
              type="button"
              onClick={() => onChange(section)}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold uppercase tracking-wide"
            >
              {isActive && (
                <span className="absolute inset-x-10 top-0 h-0.5 bg-mil-brass" />
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2.4 : 1.8}
                className={isActive ? "text-mil-brass" : "text-mil-muted"}
              />
              <span className={isActive ? "text-mil-ink" : "text-mil-muted"}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import BottomNav from "./BottomNav";
import MilCorners from "./MilCorners";
import ProtocolSection from "./ProtocolSection";
import WorkoutSection from "./WorkoutSection";
import type { ProtocolCardItem } from "./ProtocolCard";
import type { WorkoutDayData } from "./WorkoutDayView";

export type AppSection = "protocol" | "workout";

export default function ProtocolApp({
  slug,
  clientName,
  items,
  workoutDays,
}: {
  slug: string;
  clientName: string;
  items: (ProtocolCardItem & { daysOfWeek: string[] })[];
  workoutDays: WorkoutDayData[];
}) {
  const [section, setSection] = useState<AppSection>("protocol");
  const serviceId = slug.slice(0, 8).toUpperCase();

  return (
    <div className="mil-atmosphere min-h-dvh font-sans">
      <div className="mil-scanlines" />
      <main className="mx-auto w-full max-w-md px-4 pb-28">
        <header className="pt-8 pb-6">
          <div className="relative mx-2 rounded-sm border border-mil-border bg-mil-surface-raised px-5 py-4">
            <MilCorners />
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-mil-brass">
              <ShieldCheck size={12} strokeWidth={2.5} />
              Operasyon Protokolü
            </div>
            <h1 className="font-heading mt-1.5 text-3xl font-semibold uppercase tracking-wide text-mil-ink">
              {clientName}
            </h1>
            <div className="mt-2 flex items-center justify-between border-t border-mil-border pt-2 font-mono text-[11px] text-mil-muted">
              <span>ID: {serviceId}</span>
              <span>STATÜ: AKTİF</span>
            </div>
          </div>
        </header>

        {section === "protocol" && <ProtocolSection slug={slug} items={items} />}
        {section === "workout" && <WorkoutSection workoutDays={workoutDays} />}
      </main>

      <BottomNav active={section} onChange={setSection} />
    </div>
  );
}

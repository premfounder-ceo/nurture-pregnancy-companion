import { type ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

/**
 * PhoneShell — renders a mobile-first canvas centered on desktop with a
 * simulated Android status bar and gesture-nav pill. On mobile devices it
 * fills the viewport so it feels like a real installed app.
 */
export function PhoneShell({
  children,
  headerBg = "bg-background",
}: {
  children: ReactNode;
  headerBg?: string;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[oklch(0.97_0.03_5)] to-[oklch(0.95_0.05_355)] dark:from-background dark:to-background flex items-stretch md:items-center justify-center md:p-6">
      <div className="relative w-full md:w-[420px] md:h-[860px] md:rounded-[44px] md:shadow-2xl md:border md:border-black/10 bg-background overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className={`${headerBg} flex items-center justify-between px-6 pt-2 pb-1 text-[13px] font-semibold text-foreground/80 select-none`}>
          <span className="tabular-nums">9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryFull className="w-4 h-4" />
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
        {/* Gesture nav pill */}
        <div className="flex justify-center py-2 bg-background">
          <div className="h-1.5 w-28 rounded-full bg-foreground/25" />
        </div>
      </div>
    </div>
  );
}

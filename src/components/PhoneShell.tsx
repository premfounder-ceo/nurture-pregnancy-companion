import { type ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

/**
 * PhoneShell — renders the app inside a realistic Android device frame at
 * all viewport sizes. The device sits on a soft pink stage so the preview
 * always looks like a real handset, never a desktop layout.
 */
export function PhoneShell({
  children,
  headerBg = "bg-background",
}: {
  children: ReactNode;
  headerBg?: string;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[oklch(0.97_0.03_5)] to-[oklch(0.94_0.06_355)] flex items-center justify-center p-3 sm:p-6">
      {/* Device body */}
      <div
        className="relative bg-[#0b0b0d] rounded-[42px] p-[10px] shadow-[0_30px_80px_-20px_rgba(210,60,120,0.35),0_10px_30px_-10px_rgba(0,0,0,0.4)]"
        style={{
          width: "min(100%, 390px)",
          height: "min(100dvh - 24px, 820px)",
        }}
      >
        {/* Side buttons */}
        <div className="absolute left-[-2px] top-[110px] w-[3px] h-16 bg-[#0b0b0d] rounded-l-sm" />
        <div className="absolute right-[-2px] top-[140px] w-[3px] h-24 bg-[#0b0b0d] rounded-r-sm" />

        {/* Screen */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-background flex flex-col">
          {/* Punch-hole camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-black z-30 ring-1 ring-white/5" />

          {/* Status bar */}
          <div className={`${headerBg} flex items-center justify-between px-6 pt-2 pb-1 text-[12px] font-semibold text-foreground/80 select-none z-20`}>
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
            <div className="h-[5px] w-28 rounded-full bg-foreground/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

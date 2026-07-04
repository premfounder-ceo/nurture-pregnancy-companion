import { type ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

/**
 * PhoneShell — enforces a mobile-only preview. The app is always rendered
 * inside a realistic Android device frame centered on a soft pink stage.
 */
export function PhoneShell({
  children,
  headerBg = "bg-background",
}: {
  children: ReactNode;
  headerBg?: string;
}) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[oklch(0.97_0.025_5)] via-[oklch(0.96_0.035_355)] to-[oklch(0.94_0.05_350)] flex items-center justify-center p-2 sm:p-6">
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-16 w-72 h-72 rounded-full bg-[oklch(0.85_0.11_5)] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-[oklch(0.88_0.09_355)] opacity-40 blur-3xl" />

      {/* Device body */}
      <div
        className="relative bg-[#0a0a0c] rounded-[46px] p-[9px] shadow-[0_40px_100px_-30px_rgba(210,60,120,0.45),0_20px_45px_-15px_rgba(0,0,0,0.35)]"
        style={{
          width: "min(100vw - 16px, 390px)",
          height: "min(100dvh - 16px, 820px)",
          aspectRatio: "9 / 19.5",
        }}
      >
        {/* Side buttons */}
        <div className="absolute left-[-2px] top-[110px] w-[3px] h-16 bg-[#0a0a0c] rounded-l" />
        <div className="absolute right-[-2px] top-[150px] w-[3px] h-24 bg-[#0a0a0c] rounded-r" />

        {/* Screen */}
        <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-background flex flex-col">
          {/* Punch-hole camera */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-black z-30 ring-1 ring-white/5" />

          {/* Status bar */}
          <div className={`${headerBg} flex items-center justify-between px-6 pt-2 pb-1 text-[12px] font-semibold text-foreground/80 select-none z-20 shrink-0`}>
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
          <div className="flex justify-center py-1.5 bg-background shrink-0">
            <div className="h-[5px] w-28 rounded-full bg-foreground/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

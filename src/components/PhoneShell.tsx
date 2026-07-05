import { type ReactNode, useEffect, useState } from "react";

/**
 * PhoneShell — renders the app as a 9:16 mobile viewport.
 * The virtual device frame has been removed per user request.
 * On desktop-sized viewports the screen is centered in a tall 9:16 area
 * so the preview always looks like a real mobile app.
 * A client-only guard keeps server and client markup identical to avoid
 * hydration mismatches on `ssr: false` routes.
 */
export function PhoneShell({
  children,
}: {
  children: ReactNode;
  headerBg?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-background flex items-center justify-center" suppressHydrationWarning>
      <div className="relative w-full h-full sm:aspect-[9/16] sm:max-h-screen sm:max-w-[calc(100vh*9/16)] overflow-hidden bg-background flex flex-col shadow-2xl sm:rounded-[2rem]">
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {mounted ? children : null}
        </div>
      </div>
    </div>
  );
}

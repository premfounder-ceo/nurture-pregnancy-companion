import { type ReactNode, useEffect, useState } from "react";

/**
 * PhoneShell — renders the app full-screen in a 9:16 mobile viewport.
 * The virtual device frame has been removed per user request.
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
    <div className="fixed inset-0 overflow-hidden bg-background flex flex-col" suppressHydrationWarning>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {mounted ? children : null}
      </div>
    </div>
  );
}

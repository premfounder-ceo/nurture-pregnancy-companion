import { type ReactNode } from "react";

/**
 * PhoneShell — renders the app full-screen in a 9:16 mobile viewport.
 * The virtual device frame has been removed per user request.
 */
export function PhoneShell({
  children,
}: {
  children: ReactNode;
  headerBg?: string;
}) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  );
}

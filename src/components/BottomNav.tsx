import { Link, useLocation } from "@tanstack/react-router";
import { Home, Baby, Heart, Sparkles, User } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/baby", label: "Baby", icon: Baby },
  { to: "/daily", label: "Health", icon: Heart },
  { to: "/ai", label: "AI", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border">
      <ul className="grid grid-cols-5 px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`p-1.5 rounded-full transition-all ${active ? "bg-primary-soft" : ""}`}>
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
                </div>
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

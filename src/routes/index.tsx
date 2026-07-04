import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PhoneShell } from "@/components/PhoneShell";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  ssr: false,
  component: SplashPage,
});

function SplashPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/home" });
      else navigate({ to: "/onboarding" });
    }, 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <PhoneShell>
      <div className="h-full flex flex-col items-center justify-center gradient-soft px-8 relative min-h-[600px]">
        <div className="relative">
          <div className="absolute inset-0 rounded-full gradient-primary blur-3xl opacity-40 animate-pulse-ring" />
          <div className="relative w-32 h-32 rounded-full gradient-primary flex items-center justify-center shadow-2xl">
            <Heart className="w-14 h-14 text-white" fill="white" strokeWidth={0} />
          </div>
        </div>
        <h1 className="mt-8 font-serif text-5xl text-foreground tracking-tight">Nurture</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pregnancy Tracker</p>
        <p className="mt-16 text-xs text-muted-foreground italic">Every journey begins with love</p>
        <Link to="/onboarding" className="sr-only">Continue</Link>
      </div>
    </PhoneShell>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { computeFromDueDate, getBabyInfo } from "@/lib/pregnancy";
import { Baby, Activity, Utensils, Moon, Droplets, Smile, Sparkles, Pill, Calendar, FileText, Stethoscope } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

function HomePage() {
  const nav = useNavigate();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    },
  });

  const today = new Date().toISOString().slice(0, 10);
  const { data: log } = useQuery({
    queryKey: ["daily_log", today],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("daily_logs").select("*").eq("user_id", user.id).eq("log_date", today).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (!isLoading && profile && !profile.onboarded) nav({ to: "/setup" });
  }, [isLoading, profile, nav]);

  const preg = computeFromDueDate(profile?.due_date);
  const baby = preg ? getBabyInfo(preg.week) : null;

  return (
    <PhoneShell>
      <div className="flex flex-col min-h-full">
        <div className="px-5 pt-4 pb-6 gradient-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Hi {profile?.full_name?.split(" ")[0] || "there"} 👋</div>
              {preg ? (
                <div className="mt-0.5 text-[15px] font-semibold">Week {preg.week} · {preg.daysToGo} days to go</div>
              ) : (
                <div className="mt-0.5 text-[15px] font-semibold">Welcome to Nurture</div>
              )}
            </div>
            <Link to="/profile" className="w-10 h-10 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-bold">
              {(profile?.full_name?.[0] ?? "N").toUpperCase()}
            </Link>
          </div>

          {baby && (
            <Link to="/baby" className="mt-4 flex items-center gap-4 bg-card rounded-3xl p-4 shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center text-2xl">🍎</div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Baby is the size of a</div>
                <div className="font-serif text-2xl leading-tight">{baby.fruit}</div>
              </div>
              <Baby className="w-5 h-5 text-primary" />
            </Link>
          )}
        </div>

        <div className="px-5 -mt-3 pb-24 space-y-4">
          {preg && (
            <div className="bg-card rounded-3xl p-5 shadow-card">
              <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-3">Daily Progress</div>
              <ProgressRing progress={preg.progress} label={`Day ${preg.daysPregnant}`} sub={`Trimester ${preg.trimester}`} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <MetricCard to="/daily" icon={<Droplets className="w-4 h-4" />} label="Water" value={`${log?.water_glasses ?? 0}/8`} sub="glasses" tint="info" />
            <MetricCard to="/daily" icon={<Moon className="w-4 h-4" />} label="Sleep" value={`${log?.sleep_hours ?? 0}`} sub="hours" tint="primary" />
            <MetricCard to="/daily" icon={<Utensils className="w-4 h-4" />} label="Meals" value={`${log?.meals_completed ?? 0}/3`} sub="completed" tint="warning" />
            <MetricCard to="/daily" icon={<Smile className="w-4 h-4" />} label="Mood" value={log?.mood || "—"} sub="today" tint="success" />
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-3 px-1">Quick actions</div>
            <div className="grid grid-cols-4 gap-3">
              <Quick to="/kicks" icon={<Activity />} label="Kicks" />
              <Quick to="/contractions" icon={<Stethoscope />} label="Timer" />
              <Quick to="/symptoms" icon={<Sparkles />} label="Symptoms" />
              <Quick to="/nutrition" icon={<Utensils />} label="Nutrition" />
              <Quick to="/medicine" icon={<Pill />} label="Medicine" />
              <Quick to="/appointments" icon={<Calendar />} label="Visits" />
              <Quick to="/reports" icon={<FileText />} label="Reports" />
              <Quick to="/ai" icon={<Sparkles />} label="Ask AI" />
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}

function ProgressRing({ progress, label, sub }: { progress: number; label: string; sub: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const off = c * (1 - progress);
  return (
    <div className="flex items-center gap-5">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} stroke="currentColor" className="text-muted" strokeWidth="10" fill="none" />
          <circle cx="60" cy="60" r={r} stroke="url(#g)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stopColor="oklch(0.68 0.2 5)" />
              <stop offset="100%" stopColor="oklch(0.6 0.22 15)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-3xl leading-none">{label}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{sub}</span>
        </div>
      </div>
      <div className="flex-1 text-sm text-muted-foreground leading-relaxed">
        You're {Math.round(progress * 100)}% of the way there. Take a moment for yourself today.
      </div>
    </div>
  );
}

function MetricCard({ to, icon, label, value, sub, tint }: {
  to: "/daily"; icon: React.ReactNode; label: string; value: string; sub: string; tint: "info" | "primary" | "warning" | "success";
}) {
  const tintClass = { info: "text-info", primary: "text-primary", warning: "text-warning", success: "text-success" }[tint];
  return (
    <Link to={to} className="bg-card rounded-3xl p-4 shadow-soft">
      <div className={`flex items-center gap-1.5 ${tintClass}`}>{icon}<span className="text-xs font-semibold uppercase tracking-wide">{label}</span></div>
      <div className="mt-2 font-serif text-2xl">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </Link>
  );
}

function Quick({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5">
      <div className="w-14 h-14 rounded-2xl bg-card border border-border shadow-soft flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className="text-[11px] text-foreground font-medium">{label}</span>
    </Link>
  );
}

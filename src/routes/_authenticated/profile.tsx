import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, HelpCircle, Shield, Trash2, Settings, LogOut, ChevronRight, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { computeFromDueDate } from "@/lib/pregnancy";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return { ...data, email: user?.email };
    },
  });

  const preg = computeFromDueDate(profile?.due_date);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  };

  return (
    <PhoneShell>
      <AppHeader title="Profile" back />
      <div className="px-5 pb-24">
        <div className="bg-card rounded-3xl p-5 shadow-soft flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-serif text-3xl">
            {(profile?.full_name?.[0] ?? "N").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-2xl leading-tight truncate">{profile?.full_name || "Your name"}</div>
            <div className="text-xs text-muted-foreground truncate">{profile?.email}</div>
            {preg && <div className="text-xs text-primary mt-1 font-semibold">Week {preg.week} · {preg.daysToGo} days to go</div>}
          </div>
        </div>

        <div className="mt-5 bg-card rounded-3xl shadow-soft overflow-hidden">
          <Item to="/setup" icon={<UserIcon className="w-4 h-4" />} label="Edit profile" />
          <Item to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
          <Item to="/settings/reminders" icon={<Bell className="w-4 h-4" />} label="Reminders" />
          <Item to="/help" icon={<HelpCircle className="w-4 h-4" />} label="Help & Support" />
          <Item to="/privacy" icon={<Shield className="w-4 h-4" />} label="Privacy Policy" />
          <Item to="/delete-account" icon={<Trash2 className="w-4 h-4" />} label="Delete account" danger last />
        </div>

        <button onClick={signOut} className="mt-6 w-full py-3.5 rounded-2xl border border-border bg-card font-semibold flex items-center justify-center gap-2 text-destructive">
          <LogOut className="w-4 h-4" /> Sign out
        </button>

        <div className="mt-6 text-center text-[11px] text-muted-foreground" onClick={() => toast.info("Nurture v1.0.0")}>
          Nurture — made with care
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}

function Item({ to, icon, label, danger, last }: { to: string; icon: React.ReactNode; label: string; danger?: boolean; last?: boolean }) {
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-4 ${!last ? "border-b border-border" : ""} ${danger ? "text-destructive" : ""}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? "bg-destructive/10" : "bg-primary-soft text-primary"}`}>{icon}</div>
      <span className="flex-1 font-medium text-sm">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </Link>
  );
}

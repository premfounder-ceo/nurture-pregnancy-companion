import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { computeFromDueDate, getBabyInfo } from "@/lib/pregnancy";
import { Baby, Ruler, Weight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/baby")({
  component: BabyPage,
});

function BabyPage() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const preg = computeFromDueDate(profile?.due_date);
  const baby = preg ? getBabyInfo(preg.week) : null;

  return (
    <PhoneShell>
      <AppHeader title="Baby Growth" back />
      {!preg ? (
        <div className="px-6 py-10 text-center text-muted-foreground">Add your due date to see baby's growth.</div>
      ) : (
        <div className="px-6 pb-24">
          <div className="text-xs text-muted-foreground">Week {preg.week}</div>

          <div className="mt-4 rounded-3xl gradient-soft p-6 shadow-card relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-primary-soft opacity-60 blur-2xl" />
            <div className="relative flex justify-center">
              <div className="w-52 h-52 rounded-full bg-white/60 backdrop-blur flex items-center justify-center text-8xl shadow-inner">
                <Baby className="w-24 h-24 text-primary" />
              </div>
            </div>
            <div className="relative mt-6 grid grid-cols-2 gap-3">
              <Stat icon={<Ruler className="w-4 h-4" />} label="Length" value={`${baby!.length_cm} cm`} />
              <Stat icon={<Weight className="w-4 h-4" />} label="Weight" value={`${baby!.weight_g} g`} />
            </div>
          </div>

          <div className="mt-6 bg-card rounded-3xl p-5 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">This Week</div>
            <div className="mt-1 font-serif text-2xl leading-tight">Your baby is the size of a {baby!.fruit.toLowerCase()}</div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{baby!.note}</p>
          </div>

          <div className="mt-4 bg-card rounded-3xl p-5 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trimester</div>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3].map((t) => (
                <div key={t} className={`flex-1 py-3 rounded-2xl text-center text-sm font-semibold ${preg.trimester === t ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  T{t}
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Day {preg.daysPregnant} of your pregnancy · {preg.daysToGo} days to go</div>
          </div>
        </div>
      )}
      <BottomNav />
    </PhoneShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-white/50">
      <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wide">{icon}{label}</div>
      <div className="mt-1 font-serif text-2xl">{value}</div>
    </div>
  );
}

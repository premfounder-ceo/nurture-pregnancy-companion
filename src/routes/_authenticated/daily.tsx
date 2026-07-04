import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Droplets, Moon, Utensils, Activity, Smile, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/daily")({
  component: DailyPage,
});

const today = () => new Date().toISOString().slice(0, 10);
const MOODS = ["😊 Happy", "😌 Calm", "😔 Tired", "😣 Uneasy", "🥰 Grateful"];

function DailyPage() {
  const qc = useQueryClient();
  const key = ["daily_log", today()];
  const { data: log } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("daily_logs").select("*").eq("user_id", user!.id).eq("log_date", today()).maybeSingle();
      return data ?? { water_glasses: 0, sleep_hours: 0, meals_completed: 0, exercise_minutes: 0, mood: "" };
    },
  });

  const save = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("daily_logs").upsert({
        user_id: user!.id, log_date: today(), ...log, ...patch,
      }, { onConflict: "user_id,log_date" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e) => toast.error((e as Error).message),
  });

  const l = log ?? { water_glasses: 0, sleep_hours: 0, meals_completed: 0, exercise_minutes: 0, mood: "" };

  return (
    <PhoneShell>
      <AppHeader title="Daily Tracker" back />
      <div className="px-5 pb-24 space-y-4">
        <div className="text-xs text-muted-foreground px-1">{new Date().toDateString()}</div>

        <Counter icon={<Droplets className="w-5 h-5" />} tint="info" label="Water" unit="glasses" value={l.water_glasses} onDec={() => save.mutate({ water_glasses: Math.max(0, l.water_glasses - 1) })} onInc={() => save.mutate({ water_glasses: l.water_glasses + 1 })} target={8} />
        <Counter icon={<Moon className="w-5 h-5" />} tint="primary" label="Sleep" unit="hours" value={l.sleep_hours} onDec={() => save.mutate({ sleep_hours: Math.max(0, Number(l.sleep_hours) - 0.5) })} onInc={() => save.mutate({ sleep_hours: Number(l.sleep_hours) + 0.5 })} target={8} step={0.5} />
        <Counter icon={<Utensils className="w-5 h-5" />} tint="warning" label="Meals" unit="completed" value={l.meals_completed} onDec={() => save.mutate({ meals_completed: Math.max(0, l.meals_completed - 1) })} onInc={() => save.mutate({ meals_completed: l.meals_completed + 1 })} target={3} />
        <Counter icon={<Activity className="w-5 h-5" />} tint="success" label="Exercise" unit="min" value={l.exercise_minutes} onDec={() => save.mutate({ exercise_minutes: Math.max(0, l.exercise_minutes - 5) })} onInc={() => save.mutate({ exercise_minutes: l.exercise_minutes + 5 })} target={30} step={5} />

        <div className="bg-card rounded-3xl p-5 shadow-soft">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wide"><Smile className="w-4 h-4" />Mood</div>
          <div className="flex flex-wrap gap-2 mt-3">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => save.mutate({ mood: m })}
                className={`px-3.5 py-2 rounded-full text-sm font-semibold ${l.mood === m ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}

function Counter({ icon, tint, label, unit, value, onDec, onInc, target, step: _step = 1 }: {
  icon: React.ReactNode; tint: "info" | "primary" | "warning" | "success";
  label: string; unit: string; value: number; onDec: () => void; onInc: () => void; target: number; step?: number;
}) {
  const tintText = { info: "text-info", primary: "text-primary", warning: "text-warning", success: "text-success" }[tint];
  const progress = Math.min(1, value / target);
  return (
    <div className="bg-card rounded-3xl p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${tintText}`}>{icon}<span className="text-xs font-semibold uppercase tracking-wide">{label}</span></div>
        <div className="text-xs text-muted-foreground">Goal {target}</div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button onClick={onDec} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"><Minus className="w-4 h-4" /></button>
        <div className="text-center">
          <div className="font-serif text-4xl leading-none">{value}</div>
          <div className="text-[11px] text-muted-foreground mt-1">{unit}</div>
        </div>
        <button onClick={onInc} className="w-10 h-10 rounded-full gradient-primary text-primary-foreground flex items-center justify-center"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full gradient-primary" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings/reminders")({
  component: ReminderSettings,
});

const KEYS = [
  { key: "water_enabled" as const, label: "Water Reminder", note: "Every 2 hours" },
  { key: "medicine_enabled" as const, label: "Medicine Reminder", note: "On time" },
  { key: "workout_enabled" as const, label: "Workout Reminder", note: "Every morning 7:00 AM" },
  { key: "prenatal_vitamin_enabled" as const, label: "Prenatal Vitamin", note: "Every morning 8:00 AM" },
];

function ReminderSettings() {
  const qc = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ["reminder_settings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("reminder_settings").select("*").eq("user_id", user!.id).maybeSingle();
      return data ?? { water_enabled: true, medicine_enabled: true, workout_enabled: false, prenatal_vitamin_enabled: true };
    },
  });

  const toggle = useMutation({
    mutationFn: async (patch: Record<string, boolean>) => {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("reminder_settings").upsert({ user_id: user!.id, ...settings, ...patch });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminder_settings"] }),
  });

  return (
    <PhoneShell>
      <AppHeader title="Reminders" back="/settings" />
      <div className="px-5 pb-8">
        <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
          {KEYS.map((k, i) => (
            <div key={k.key} className={`flex items-center px-4 py-4 gap-3 ${i < KEYS.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex-1">
                <div className="font-semibold text-sm">{k.label}</div>
                <div className="text-xs text-muted-foreground">{k.note}</div>
              </div>
              <Toggle checked={!!settings?.[k.key]} onChange={(v) => toggle.mutate({ [k.key]: v })} />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground px-1">Reminders show inside Nurture. Enable browser notifications to receive them when the app is open.</p>
      </div>
    </PhoneShell>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className={`w-12 h-7 rounded-full transition-colors ${checked ? "gradient-primary" : "bg-muted"} relative`}>
      <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Plus, Pill, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/medicine")({
  component: MedicinePage,
});

function MedicinePage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("08:00");

  const { data: meds } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("medicines").select("*").eq("user_id", user!.id).order("created_at");
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Name required");
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("medicines").insert({ user_id: user!.id, name: name.trim(), dosage: dosage || null, time_of_day: time });
      if (error) throw error;
    },
    onSuccess: () => { setName(""); setDosage(""); qc.invalidateQueries({ queryKey: ["medicines"] }); toast.success("Reminder added"); },
    onError: (e) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("medicines").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medicines"] }),
  });

  return (
    <PhoneShell>
      <AppHeader title="Medicine Reminder" back />
      <div className="px-5 pb-8">
        <div className="bg-card rounded-3xl p-5 shadow-soft space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add reminder</div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Prenatal vitamin" className="w-full bg-muted rounded-2xl px-4 py-3 outline-none text-[15px]" />
          <div className="grid grid-cols-2 gap-3">
            <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage (optional)" className="w-full bg-muted rounded-2xl px-4 py-3 outline-none text-[15px]" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-muted rounded-2xl px-4 py-3 outline-none text-[15px]" />
          </div>
          <button onClick={() => add.mutate()} disabled={add.isPending} className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 px-1">Today</div>
          {meds?.length ? (
            <div className="space-y-2">
              {meds.map((m) => (
                <div key={m.id} className="bg-card rounded-2xl p-4 flex items-center gap-3 shadow-soft">
                  <div className="w-11 h-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center"><Pill className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.dosage ? `${m.dosage} · ` : ""}{m.time_of_day}</div>
                  </div>
                  <button onClick={() => del.mutate(m.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">No reminders yet.</div>
          )}
        </div>
      </div>
    </PhoneShell>
  );
}

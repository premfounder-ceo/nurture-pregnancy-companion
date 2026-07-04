import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/appointments")({
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");

  const { data: items } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("appointments").select("*").eq("user_id", user!.id).order("scheduled_at");
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!title.trim() || !date) throw new Error("Title and date required");
      const { data: { user } } = await supabase.auth.getUser();
      const scheduled_at = new Date(`${date}T${time}`).toISOString();
      const { error } = await supabase.from("appointments").insert({ user_id: user!.id, title: title.trim(), doctor: doctor || null, scheduled_at });
      if (error) throw error;
    },
    onSuccess: () => { setTitle(""); setDoctor(""); setDate(""); qc.invalidateQueries({ queryKey: ["appointments"] }); toast.success("Added"); },
    onError: (e) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("appointments").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });

  return (
    <PhoneShell>
      <AppHeader title="Appointments" back />
      <div className="px-5 pb-8">
        <div className="bg-card rounded-3xl p-5 shadow-soft space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">New appointment</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ultrasound" className="w-full bg-muted rounded-2xl px-4 py-3 outline-none" />
          <input value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Doctor / Clinic (optional)" className="w-full bg-muted rounded-2xl px-4 py-3 outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-muted rounded-2xl px-4 py-3 outline-none" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-muted rounded-2xl px-4 py-3 outline-none" />
          </div>
          <button onClick={() => add.mutate()} disabled={add.isPending} className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Appointment
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {items?.length ? items.map((a) => (
            <div key={a.id} className="bg-card rounded-2xl p-4 flex items-center gap-3 shadow-soft">
              <div className="w-11 h-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center"><Calendar className="w-5 h-5" /></div>
              <div className="flex-1">
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.doctor ? a.doctor + " · " : ""}{format(new Date(a.scheduled_at), "MMM d, h:mm a")}</div>
              </div>
              <button onClick={() => del.mutate(a.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          )) : <div className="py-10 text-center text-sm text-muted-foreground">No appointments yet.</div>}
        </div>
      </div>
    </PhoneShell>
  );
}

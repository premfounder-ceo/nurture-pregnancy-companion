import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileDown, Activity, Heart, Weight } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { computeFromDueDate } from "@/lib/pregnancy";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { data } = useQuery({
    queryKey: ["report_data"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const [profile, logs, symptoms, kicks] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
        supabase.from("daily_logs").select("*").eq("user_id", user!.id).order("log_date", { ascending: false }).limit(30),
        supabase.from("symptoms").select("*").eq("user_id", user!.id).order("logged_at", { ascending: false }).limit(30),
        supabase.from("kick_sessions").select("*").eq("user_id", user!.id).order("started_at", { ascending: false }).limit(30),
      ]);
      return { profile: profile.data, logs: logs.data ?? [], symptoms: symptoms.data ?? [], kicks: kicks.data ?? [] };
    },
  });

  const exportPdf = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFontSize(22); doc.text("Nurture — Pregnancy Report", 20, 22);
    doc.setFontSize(10); doc.setTextColor(120);
    doc.text(`Generated ${format(new Date(), "PPP")}`, 20, 30);
    doc.setTextColor(0);
    const preg = computeFromDueDate(data.profile?.due_date);
    let y = 44;
    doc.setFontSize(13); doc.text("Profile", 20, y); y += 6;
    doc.setFontSize(10);
    doc.text(`Name: ${data.profile?.full_name ?? "—"}`, 20, y); y += 5;
    if (data.profile?.due_date) doc.text(`Due date: ${data.profile.due_date}`, 20, y), y += 5;
    if (preg) doc.text(`Current: Week ${preg.week} · Trimester ${preg.trimester}`, 20, y), y += 5;

    y += 4;
    doc.setFontSize(13); doc.text("Daily logs (last 30)", 20, y); y += 6;
    doc.setFontSize(9);
    data.logs.slice(0, 15).forEach((l) => {
      doc.text(`${l.log_date}: water ${l.water_glasses}g, sleep ${l.sleep_hours}h, meals ${l.meals_completed}, exercise ${l.exercise_minutes}m, mood ${l.mood ?? "—"}`, 20, y);
      y += 5;
      if (y > 275) { doc.addPage(); y = 20; }
    });

    y += 4;
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(13); doc.text("Symptoms", 20, y); y += 6;
    doc.setFontSize(9);
    data.symptoms.slice(0, 15).forEach((s) => {
      doc.text(`${format(new Date(s.logged_at), "PP")}: ${s.name} (${s.severity})`, 20, y); y += 5;
      if (y > 275) { doc.addPage(); y = 20; }
    });

    y += 4;
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(13); doc.text("Kick sessions", 20, y); y += 6;
    doc.setFontSize(9);
    data.kicks.slice(0, 15).forEach((k) => {
      doc.text(`${format(new Date(k.started_at), "PP")}: ${k.kicks} kicks in ${Math.round(k.duration_seconds / 60)}m`, 20, y); y += 5;
      if (y > 275) { doc.addPage(); y = 20; }
    });

    doc.save(`nurture-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    toast.success("PDF exported");
  };

  return (
    <PhoneShell>
      <AppHeader title="Reports" back />
      <div className="px-5 pb-8">
        <div className="grid grid-cols-3 gap-3">
          <Tile icon={<Activity className="w-4 h-4" />} label="Logs" value={data?.logs.length ?? 0} />
          <Tile icon={<Heart className="w-4 h-4" />} label="Symptoms" value={data?.symptoms.length ?? 0} />
          <Tile icon={<Weight className="w-4 h-4" />} label="Kicks" value={data?.kicks.length ?? 0} />
        </div>

        <button onClick={exportPdf} className="mt-6 w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-card flex items-center justify-center gap-2">
          <FileDown className="w-4 h-4" /> Export PDF Report
        </button>

        <div className="mt-6 bg-card rounded-3xl p-5 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent daily logs</div>
          <div className="mt-3 divide-y divide-border">
            {(data?.logs ?? []).slice(0, 7).map((l) => (
              <div key={l.log_date} className="py-2.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{l.log_date}</span>
                <span className="tabular-nums">{l.water_glasses}g · {l.sleep_hours}h · {l.mood ?? "—"}</span>
              </div>
            ))}
            {(!data?.logs || data.logs.length === 0) && <div className="py-6 text-center text-sm text-muted-foreground">No logs yet.</div>}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft">
      <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wide">{icon}{label}</div>
      <div className="font-serif text-3xl mt-1">{value}</div>
    </div>
  );
}

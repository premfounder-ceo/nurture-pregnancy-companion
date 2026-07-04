import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/symptoms")({
  component: SymptomsPage,
});

const SUGGESTED = ["Nausea", "Back Pain", "Cravings", "Fatigue", "Headache", "Heartburn", "Swelling", "Cramps"];

function SymptomsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("mild");

  const { data: items } = useQuery({
    queryKey: ["symptoms"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("symptoms").select("*").eq("user_id", user!.id).order("logged_at", { ascending: false }).limit(30);
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Name required");
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("symptoms").insert({ user_id: user!.id, name: name.trim(), severity });
      if (error) throw error;
    },
    onSuccess: () => { setName(""); qc.invalidateQueries({ queryKey: ["symptoms"] }); toast.success("Logged"); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <PhoneShell>
      <AppHeader title="Symptoms" back />
      <div className="px-5 pb-24">
        <div className="bg-card rounded-3xl p-5 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Log a symptom</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mild nausea"
            className="w-full bg-muted rounded-2xl px-4 py-3 outline-none text-[15px]"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTED.map((s) => (
              <button key={s} onClick={() => setName(s)} className="text-xs px-3 py-1.5 rounded-full bg-primary-soft text-primary font-semibold">
                {s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {(["mild", "moderate", "severe"] as const).map((sv) => (
              <button
                key={sv}
                onClick={() => setSeverity(sv)}
                className={`py-2.5 rounded-2xl text-sm font-semibold capitalize ${severity === sv ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {sv}
              </button>
            ))}
          </div>
          <button onClick={() => add.mutate()} disabled={add.isPending} className="mt-4 w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add symptom
          </button>
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 px-1">Recent</div>
          {items?.length ? (
            <div className="space-y-2">
              {items.map((s) => (
                <div key={s.id} className="bg-card rounded-2xl p-4 flex items-center gap-3 shadow-soft">
                  <div className={`w-2 h-10 rounded-full ${s.severity === "severe" ? "bg-destructive" : s.severity === "moderate" ? "bg-warning" : "bg-success"}`} />
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{s.severity} · {formatDistanceToNow(new Date(s.logged_at), { addSuffix: true })}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No symptoms logged yet." />
          )}
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="py-10 text-center text-sm text-muted-foreground">{text}</div>;
}

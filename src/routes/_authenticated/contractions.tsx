import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/contractions")({
  component: ContractionsPage,
});

function ContractionsPage() {
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const start = useRef<number | null>(null);
  const lastEnd = useRef<number | null>(null);
  const [items, setItems] = useState<{ duration_seconds: number; interval_seconds: number | null; started_at: string }[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (start.current) setDuration(Math.floor((Date.now() - start.current) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("contractions").select("duration_seconds,interval_seconds,started_at").eq("user_id", user.id).order("started_at", { ascending: false }).limit(10);
    setItems(data ?? []);
  };

  const begin = () => { start.current = Date.now(); setDuration(0); setRunning(true); };
  const end = async () => {
    setRunning(false);
    const now = Date.now();
    const interval = lastEnd.current ? Math.floor((now - lastEnd.current) / 1000) : null;
    lastEnd.current = now;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("contractions").insert({ user_id: user.id, duration_seconds: duration, interval_seconds: interval, started_at: new Date(start.current!).toISOString() });
    toast.success("Contraction recorded");
    load();
  };

  const lastInterval = items[0]?.interval_seconds;
  return (
    <PhoneShell>
      <AppHeader title="Contraction Timer" back />
      <div className="px-6 pb-8 flex flex-col items-center">
        {running && <div className="mt-4 flex items-center gap-2 text-destructive text-sm font-semibold"><span className="w-2 h-2 rounded-full bg-destructive animate-pulse" /> Recording…</div>}
        <div className="font-serif text-6xl mt-6 tabular-nums">{fmt(duration)}</div>
        <div className="text-xs text-muted-foreground mt-1">Duration</div>

        <div className="mt-8 flex items-center gap-8">
          <div className="text-center">
            <div className="font-serif text-2xl">{lastInterval != null ? fmt(lastInterval) : "—"}</div>
            <div className="text-xs text-muted-foreground mt-1">Last interval</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-2xl">{items.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Today</div>
          </div>
        </div>

        <button
          onClick={running ? end : begin}
          className={`mt-10 w-56 h-56 rounded-full flex flex-col items-center justify-center shadow-2xl font-semibold text-lg ${running ? "bg-destructive text-destructive-foreground" : "gradient-primary text-primary-foreground"}`}
        >
          {running ? "Stop" : "Start"}
        </button>

        <div className="w-full mt-8">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">History</div>
          {items.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No contractions recorded.</div>
          ) : (
            <div className="space-y-2">
              {items.map((it) => (
                <div key={it.started_at} className="bg-card rounded-2xl p-4 flex items-center justify-between shadow-soft">
                  <div className="text-xs text-muted-foreground">{new Date(it.started_at).toLocaleTimeString()}</div>
                  <div className="text-sm font-semibold tabular-nums">{fmt(it.duration_seconds)}</div>
                  <div className="text-xs text-muted-foreground tabular-nums">{it.interval_seconds ? fmt(it.interval_seconds) : "—"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PhoneShell>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

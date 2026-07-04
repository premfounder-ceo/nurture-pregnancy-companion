import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/kicks")({
  component: KicksPage,
});

function KicksPage() {
  const [running, setRunning] = useState(false);
  const [kicks, setKicks] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const start = useRef<number | null>(null);
  const [recentSessions, setRecent] = useState<{ kicks: number; started_at: string; duration_seconds: number }[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (start.current) setElapsed(Math.floor((Date.now() - start.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("kick_sessions").select("kicks,started_at,duration_seconds").eq("user_id", user.id).order("started_at", { ascending: false }).limit(5);
      setRecent(data ?? []);
    })();
  }, []);

  const begin = () => { start.current = Date.now(); setElapsed(0); setKicks(0); setRunning(true); };
  const end = async () => {
    setRunning(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (user && kicks > 0) {
      await supabase.from("kick_sessions").insert({ user_id: user.id, kicks, duration_seconds: elapsed });
      toast.success(`${kicks} kicks in ${fmt(elapsed)}`);
      const { data } = await supabase.from("kick_sessions").select("kicks,started_at,duration_seconds").eq("user_id", user.id).order("started_at", { ascending: false }).limit(5);
      setRecent(data ?? []);
    }
  };

  return (
    <PhoneShell>
      <AppHeader title="Kick Counter" back />
      <div className="px-6 pb-8 flex flex-col items-center">
        <div className="text-xs text-muted-foreground mt-2">Session Time</div>
        <div className="font-serif text-4xl mt-1 tabular-nums">{fmt(elapsed)}</div>

        <button
          onClick={() => running && setKicks((k) => k + 1)}
          disabled={!running}
          className={`mt-8 w-64 h-64 rounded-full transition-all ${running ? "gradient-primary text-primary-foreground animate-pulse-ring shadow-2xl" : "bg-muted text-muted-foreground"} flex flex-col items-center justify-center`}
        >
          <div className="font-serif text-8xl leading-none">{kicks}</div>
          <div className="text-sm font-semibold mt-2 uppercase tracking-widest">Kicks</div>
        </button>

        <div className="mt-8 w-full">
          {running ? (
            <button onClick={end} className="w-full py-4 rounded-2xl bg-destructive text-destructive-foreground font-semibold shadow-card">End Session</button>
          ) : (
            <button onClick={begin} className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-card">Start Session</button>
          )}
        </div>

        {recentSessions.length > 0 && (
          <div className="w-full mt-8">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Recent Sessions</div>
            <div className="space-y-2">
              {recentSessions.map((s) => (
                <div key={s.started_at} className="bg-card rounded-2xl p-4 flex items-center justify-between shadow-soft">
                  <div>
                    <div className="font-semibold">{s.kicks} kicks</div>
                    <div className="text-xs text-muted-foreground">{new Date(s.started_at).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-muted-foreground tabular-nums">{fmt(s.duration_seconds)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

function fmt(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h ? h + ":" : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

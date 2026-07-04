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

  const progress = Math.min(kicks / 10, 1);
  const r = 118, c = 2 * Math.PI * r;

  return (
    <PhoneShell>
      <AppHeader title="Kick Counter" back />
      <div className="px-6 pb-8 flex flex-col items-center">
        <div className="relative mt-4">
          <svg viewBox="0 0 260 260" className="w-64 h-64 -rotate-90">
            <circle cx="130" cy="130" r={r} className="text-muted" stroke="currentColor" strokeWidth="14" fill="none" />
            <circle cx="130" cy="130" r={r} stroke="url(#kg)" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
            <defs>
              <linearGradient id="kg" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.2 5)" />
                <stop offset="100%" stopColor="oklch(0.6 0.22 15)" />
              </linearGradient>
            </defs>
          </svg>
          <button
            onClick={() => running && setKicks((k) => k + 1)}
            disabled={!running}
            className="absolute inset-4 rounded-full bg-card shadow-inner flex flex-col items-center justify-center disabled:opacity-90"
          >
            <div className="text-[10px] tracking-widest text-muted-foreground uppercase">Session Time</div>
            <div className="font-serif text-2xl tabular-nums mt-0.5">{fmt(elapsed)}</div>
            <div className="font-serif text-6xl leading-none mt-2 text-primary">{kicks}</div>
            <div className="text-[11px] font-semibold mt-1 uppercase tracking-widest text-muted-foreground">Kicks</div>
          </button>
        </div>

        <div className="mt-8 w-full">
          {running ? (
            <button onClick={end} className="w-full py-4 rounded-full bg-destructive text-destructive-foreground font-semibold shadow-card">End Session</button>
          ) : (
            <button onClick={begin} className="w-full py-4 rounded-full gradient-primary text-primary-foreground font-semibold shadow-card">Start Session</button>
          )}
        </div>

        <div className="mt-8 w-full grid grid-cols-3 gap-3">
          <Stat label="Sessions" value={String(recentSessions.length)} />
          <Stat label="Total Kicks" value={String(recentSessions.reduce((a, s) => a + s.kicks, 0))} />
          <Stat label="Total Time" value={fmt(recentSessions.reduce((a, s) => a + s.duration_seconds, 0))} />
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-3 text-center shadow-soft">
      <div className="font-serif text-xl">{value}</div>
      <div className="text-[10px] tracking-wide uppercase text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}


function fmt(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h ? h + ":" : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

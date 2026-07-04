import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { askAssistant } from "@/lib/ai.functions";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { computeFromDueDate } from "@/lib/pregnancy";

export const Route = createFileRoute("/_authenticated/ai")({
  component: AIPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function AIPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [week, setWeek] = useState<number | undefined>();
  const endRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askAssistant);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: history }, { data: profile }] = await Promise.all([
        supabase.from("ai_messages").select("role,content").eq("user_id", user.id).order("created_at").limit(50),
        supabase.from("profiles").select("due_date").eq("id", user.id).maybeSingle(),
      ]);
      setMessages((history ?? []) as Msg[]);
      const preg = computeFromDueDate(profile?.due_date);
      if (preg) setWeek(preg.week);
    })();
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, pending]);

  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setPending(true);
    try {
      const { reply } = await ask({ data: { message: text, currentWeek: week } });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI unavailable");
    } finally { setPending(false); }
  };

  const suggestions = ["Is it normal to feel dizzy?", "What foods are safe to eat?", "How can I reduce back pain?"];

  return (
    <PhoneShell>
      <AppHeader title="AI Pregnancy Assistant" back />
      <div className="flex-1 flex flex-col min-h-[600px]">
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
          {messages.length === 0 && (
            <div className="pt-4">
              <div className="flex items-center gap-3 bg-card rounded-3xl p-5 shadow-soft">
                <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground"><Sparkles className="w-5 h-5" /></div>
                <div>
                  <div className="font-semibold">Hello 👋</div>
                  <div className="text-xs text-muted-foreground">How can I help you today?</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setInput(s)} className="w-full text-left px-4 py-3 rounded-2xl bg-primary-soft text-primary text-sm font-medium">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user" ? "gradient-primary text-primary-foreground" : "bg-card shadow-soft"
              }`}>{m.content}</div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="bg-card rounded-2xl px-4 py-3 shadow-soft flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="px-4 py-3 border-t border-border bg-card">
          <div className="flex items-end gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask something…"
              className="flex-1 bg-muted rounded-full px-4 py-3 outline-none text-[15px]"
            />
            <button onClick={send} disabled={pending || !input.trim()} className="w-11 h-11 rounded-full gradient-primary text-primary-foreground flex items-center justify-center disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}

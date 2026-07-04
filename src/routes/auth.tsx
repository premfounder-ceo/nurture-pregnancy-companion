import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Heart, Mail, Lock, User } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

const emailSchema = z.string().email().max(255);
const passwordSchema = z.string().min(8, "Use at least 8 characters").max(72);

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(email.trim());
      passwordSchema.parse(password);
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.errors[0].message : "Invalid input";
      toast.error(msg);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Welcome to Nurture");
        navigate({ to: "/setup" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/home" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
      return;
    }
    if (!res.redirected) navigate({ to: "/home" });
  };

  return (
    <PhoneShell>
      <div className="min-h-[780px] gradient-soft px-6 pt-6 pb-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" fill="white" strokeWidth={0} />
          </div>
          <span className="font-serif text-2xl">Nurture</span>
        </div>

        <h1 className="font-serif text-4xl text-foreground">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup" ? "Start your pregnancy journey with us." : "Sign in to continue where you left off."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-3">
          {mode === "signup" && (
            <Field icon={<User className="w-4 h-4" />} placeholder="Your name" value={name} onChange={setName} />
          )}
          <Field icon={<Mail className="w-4 h-4" />} placeholder="Email" type="email" value={email} onChange={setEmail} />
          <Field icon={<Lock className="w-4 h-4" />} placeholder="Password" type="password" value={password} onChange={setPassword} />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-card disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={google}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl border border-border bg-card font-semibold flex items-center justify-center gap-2 shadow-soft"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New to Nurture?"}{" "}
          <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="text-primary font-semibold">
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </PhoneShell>
  );
}

function Field({ icon, placeholder, type = "text", value, onChange }: {
  icon: React.ReactNode; placeholder: string; type?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 focus-within:border-primary transition-colors">
      <span className="text-muted-foreground">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-[15px]"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.4-.2-2.1H12v4h5.9c-.3 1.3-1 2.4-2.2 3.2v2.7h3.5c2-1.9 3.3-4.7 3.3-7.8z"/>
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9C3.8 20.6 7.6 23 12 23z"/>
      <path fill="#FBBC05" d="M5.7 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7H2C1.3 8.5.9 10.2.9 12s.4 3.5 1.1 5l3.7-2.9z"/>
      <path fill="#EA4335" d="M12 5.3c1.6 0 3.1.6 4.2 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.6 1 3.8 3.4 2 7l3.7 2.9C6.6 7.3 9.1 5.3 12 5.3z"/>
    </svg>
  );
}

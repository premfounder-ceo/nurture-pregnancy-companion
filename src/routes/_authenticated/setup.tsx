import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addWeeks } from "date-fns";

export const Route = createFileRoute("/_authenticated/setup")({
  component: SetupPage,
});

function SetupPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lmp, setLmp] = useState("");
  const [type, setType] = useState<"single" | "twins">("single");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const autoFillDue = (v: string) => {
    setLmp(v);
    if (v && !dueDate) {
      const d = addWeeks(new Date(v), 40);
      setDueDate(d.toISOString().slice(0, 10));
    }
  };

  const save = async () => {
    if (!name.trim() || !dueDate) {
      toast.error("Please add your name and due date");
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Not signed in"); setSaving(false); return; }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: name.trim(),
      due_date: dueDate,
      lmp_date: lmp || null,
      baby_type: type,
      height_cm: height ? Number(height) : null,
      weight_kg: weight ? Number(weight) : null,
      onboarded: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    nav({ to: "/home" });
  };

  return (
    <PhoneShell>
      <AppHeader title="Pregnancy Profile" back={false} />
      <div className="px-6 pb-8">
        <p className="font-serif text-3xl leading-tight">Create Your<br />Pregnancy Profile</p>
        <p className="mt-2 text-sm text-muted-foreground">These details personalize your experience.</p>

        <div className="mt-6 space-y-4">
          <Label label="Your Name">
            <Input value={name} onChange={setName} placeholder="Priya Sharma" />
          </Label>
          <Label label="Due Date">
            <Input type="date" value={dueDate} onChange={setDueDate} />
          </Label>
          <Label label="Last Menstrual Period (LMP)">
            <Input type="date" value={lmp} onChange={autoFillDue} />
          </Label>
          <Label label="Baby">
            <div className="grid grid-cols-2 gap-2">
              {(["single", "twins"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-3 rounded-2xl text-sm font-semibold border transition-colors ${
                    type === t ? "gradient-primary text-primary-foreground border-transparent" : "bg-card border-border"
                  }`}
                >
                  {t === "single" ? "Single" : "Twins"}
                </button>
              ))}
            </div>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Label label="Height (cm)"><Input value={height} onChange={setHeight} placeholder="165" /></Label>
            <Label label="Weight (kg)"><Input value={weight} onChange={setWeight} placeholder="62" /></Label>
          </div>
        </div>

        <button
          disabled={saving}
          onClick={save}
          className="mt-8 w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-card disabled:opacity-60"
        >
          {saving ? "Saving…" : "Continue"}
        </button>
      </div>
    </PhoneShell>
  );
}

function Label({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide uppercase">{label}</div>
      {children}
    </div>
  );
}
function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-card border border-border rounded-2xl px-4 py-3.5 text-[15px] outline-none focus:border-primary transition-colors"
    />
  );
}

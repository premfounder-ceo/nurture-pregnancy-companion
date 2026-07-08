import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { ChevronRight, Globe, Ruler, Bell, Lock, Database } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <PhoneShell>
      <AppHeader title="Settings" back />
      <div className="px-5 pb-8">
        <Group title="General">
          <Row icon={<Globe className="w-4 h-4" />} label="Language" value="English" />
          <Row icon={<Ruler className="w-4 h-4" />} label="Units" value="Metric (kg, cm)" last />
        </Group>

        <Group title="Account">
          <Row icon={<Bell className="w-4 h-4" />} label="Reminders" to="/settings/reminders" />
          <Row icon={<Lock className="w-4 h-4" />} label="Privacy" to="/privacy" />
          <Row icon={<Database className="w-4 h-4" />} label="Data & Backup" value="Auto-synced" />
          <Row icon={<span className="text-xs font-semibold">T&C</span>} label="Terms & Conditions" to="/terms" last />
        </Group>
      </div>
    </PhoneShell>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1 mb-2">{title}</div>
      <div className="bg-card rounded-3xl shadow-soft overflow-hidden">{children}</div>
    </div>
  );
}
function Row({ icon, label, value, to, last }: { icon: React.ReactNode; label: string; value?: string; to?: string; last?: boolean }) {
  const body = (
    <>
      <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center">{icon}</div>
      <span className="flex-1 font-medium text-sm">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      {to && <ChevronRight className="w-4 h-4 text-muted-foreground ml-1" />}
    </>
  );
  const cls = `flex items-center gap-3 px-4 py-4 ${!last ? "border-b border-border" : ""}`;
  return to ? <Link to={to} className={cls}>{body}</Link> : <div className={cls}>{body}</div>;
}

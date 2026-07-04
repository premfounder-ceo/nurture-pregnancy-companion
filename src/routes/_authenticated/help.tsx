import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { ChevronRight, MessageCircle, HelpCircle, Send, Bug } from "lucide-react";

export const Route = createFileRoute("/_authenticated/help")({
  component: HelpPage,
});

const FAQ = [
  { q: "How is my due date calculated?", a: "From your due date, or from your last menstrual period plus 280 days." },
  { q: "Is my data private?", a: "Yes. All data is stored securely and only visible to your account." },
  { q: "Can I export a report for my doctor?", a: "Yes, open Reports and tap Export PDF." },
  { q: "How do I set medicine reminders?", a: "Open Medicine, add each prescription and choose a time." },
];

function HelpPage() {
  return (
    <PhoneShell>
      <AppHeader title="Help & Support" back />
      <div className="px-5 pb-8">
        <div className="rounded-3xl gradient-primary p-5 shadow-card text-primary-foreground">
          <div className="text-xs uppercase opacity-80">We're here to help</div>
          <div className="mt-1 font-serif text-2xl">24/7 Support</div>
          <p className="mt-2 text-sm opacity-90">Reach out anytime — we usually respond within a few hours.</p>
        </div>

        <div className="mt-6 bg-card rounded-3xl shadow-soft overflow-hidden">
          <Row icon={<HelpCircle className="w-4 h-4" />} label="FAQs" />
          <Row icon={<MessageCircle className="w-4 h-4" />} label="Contact Support" />
          <Row icon={<Bug className="w-4 h-4" />} label="Report a Problem" />
          <Row icon={<Send className="w-4 h-4" />} label="Send Feedback" last />
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-1">Frequently asked</div>
          <div className="space-y-2">
            {FAQ.map((f) => (
              <details key={f.q} className="bg-card rounded-2xl px-4 py-3 shadow-soft">
                <summary className="cursor-pointer font-semibold text-sm">{f.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

function Row({ icon, label, last }: { icon: React.ReactNode; label: string; last?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-4 ${!last ? "border-b border-border" : ""}`}>
      <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center">{icon}</div>
      <span className="flex-1 font-medium text-sm">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}

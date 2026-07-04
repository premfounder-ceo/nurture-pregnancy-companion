import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/nutrition")({
  component: NutritionPage,
});

const EAT = [
  { name: "Leafy greens", note: "Folate, iron, calcium" },
  { name: "Berries & citrus", note: "Vitamin C & antioxidants" },
  { name: "Whole grains", note: "Sustained energy & fiber" },
  { name: "Lean protein", note: "Chicken, eggs, tofu, lentils" },
  { name: "Dairy or fortified alternatives", note: "Calcium for bone development" },
  { name: "Salmon (well-cooked)", note: "Omega-3 for brain growth" },
];
const AVOID = [
  { name: "Raw fish & sushi", note: "Listeria risk" },
  { name: "Unpasteurized cheese", note: "Bacterial risk" },
  { name: "High-mercury fish", note: "Swordfish, king mackerel, shark" },
  { name: "Undercooked eggs & meat", note: "Salmonella risk" },
  { name: "Excess caffeine", note: "Keep under 200 mg / day" },
  { name: "Alcohol", note: "No safe amount during pregnancy" },
];

function NutritionPage() {
  return (
    <PhoneShell>
      <AppHeader title="Nutrition" back />
      <div className="px-5 pb-8">
        <div className="rounded-3xl gradient-primary p-5 shadow-card text-primary-foreground">
          <div className="text-xs uppercase tracking-wide opacity-80">Today's plan</div>
          <div className="mt-1 font-serif text-2xl leading-tight">A calm plate: greens, grains, protein & fruit.</div>
          <p className="mt-2 text-sm opacity-90">Aim for 3 balanced meals + 2 small snacks with 8 glasses of water.</p>
        </div>

        <Section title="Foods to eat" tint="success" items={EAT} accept />
        <Section title="Foods to avoid" tint="destructive" items={AVOID} />
      </div>
    </PhoneShell>
  );
}

function Section({ title, tint, items, accept }: { title: string; tint: "success" | "destructive"; items: { name: string; note: string }[]; accept?: boolean }) {
  const color = tint === "success" ? "text-success" : "text-destructive";
  return (
    <div className="mt-6">
      <div className={`text-xs font-semibold uppercase tracking-wide mb-3 px-1 ${color}`}>{title}</div>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.name} className="bg-card rounded-2xl p-4 flex items-center gap-3 shadow-soft">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${accept ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
              {accept ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-semibold text-sm">{i.name}</div>
              <div className="text-xs text-muted-foreground">{i.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

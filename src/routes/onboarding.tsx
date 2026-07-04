import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  component: OnboardingPage,
});

const slides = [
  {
    title: "Step Into Motherhood",
    body: "A peaceful, private space to guide you through every week of your pregnancy.",
    emoji: "🌸",
  },
  {
    title: "Track What Matters",
    body: "Kicks, contractions, symptoms, meals, sleep and mood — quietly logged, beautifully surfaced.",
    emoji: "💗",
  },
  {
    title: "Your Calm Companion",
    body: "Meet Nurture AI: a supportive assistant for everyday pregnancy questions, whenever you need her.",
    emoji: "✨",
  },
];

function OnboardingPage() {
  const [i, setI] = useState(0);
  const s = slides[i];
  const last = i === slides.length - 1;
  return (
    <PhoneShell>
      <div className="h-full flex flex-col gradient-soft min-h-[750px]">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-48 h-48 rounded-full gradient-primary flex items-center justify-center text-8xl shadow-2xl mb-10">
            <span>{s.emoji}</span>
          </div>
          <h1 className="font-serif text-4xl leading-tight text-foreground">{s.title}</h1>
          <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed max-w-xs">{s.body}</p>
        </div>
        <div className="flex justify-center gap-1.5 mb-6">
          {slides.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-1.5 bg-primary/25"}`} />
          ))}
        </div>
        <div className="px-6 pb-8 space-y-3">
          {last ? (
            <Link to="/auth" className="block text-center py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-card">
              Get Started
            </Link>
          ) : (
            <button
              onClick={() => setI(i + 1)}
              className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-card flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <Link to="/auth" className="block text-center py-2 text-sm text-muted-foreground">
            {last ? "" : "Skip"}
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}

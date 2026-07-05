import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import motherAsset from "@/assets/mother.png.asset.json";
import trackAsset from "@/assets/mother-track.jpg.asset.json";
import companionAsset from "@/assets/mother-companion.jpg.asset.json";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  component: OnboardingPage,
});

const slides = [
  {
    title: "Step Into Motherhood",
    body: "A peaceful, private space to guide you through every week of your pregnancy.",
    image: motherAsset.url,
  },
  {
    title: "Track What Matters",
    body: "Kicks, contractions, symptoms, meals, sleep and mood — quietly logged, beautifully surfaced.",
    image: trackAsset.url,
  },
  {
    title: "Your Calm Companion",
    body: "Meet Nurture AI: a supportive assistant for everyday pregnancy questions, whenever you need her.",
    image: companionAsset.url,
  },
] as Array<{ title: string; body: string; emoji?: string; image?: string }>;

function OnboardingPage() {
  const [i, setI] = useState(0);
  const s = slides[i];
  const last = i === slides.length - 1;
  return (
    <PhoneShell>
      <div className="h-full flex flex-col gradient-soft">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-[42%] gradient-primary blur-3xl opacity-30 scale-110" />
            <div className="relative w-56 h-72 rounded-[42%] bg-gradient-to-b from-[oklch(0.94_0.06_15)] via-[oklch(0.92_0.08_5)] to-[oklch(0.86_0.11_355)] shadow-2xl flex items-end justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.98_0.02_20/0.7),transparent_60%)]" />
              {s.image ? (
                <img src={s.image} alt={s.title} className="relative h-full w-full object-cover object-top" />
              ) : (
                <div className="relative pb-6 text-7xl">{s.emoji}</div>
              )}
            </div>
          </div>
          <h1 className="mt-10 font-serif text-[38px] leading-[1.05] text-foreground">{s.title}</h1>
          <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed max-w-xs">{s.body}</p>
        </div>
        <div className="flex justify-center gap-1.5 mb-6">
          {slides.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-1.5 bg-primary/25"}`} />
          ))}
        </div>
        <div className="px-6 pb-8 space-y-3">
          {last ? (
            <Link to="/auth" className="block text-center py-4 rounded-full gradient-primary text-primary-foreground font-semibold shadow-card">
              Get Started
            </Link>
          ) : (
            <button
              onClick={() => setI(i + 1)}
              className="w-full py-4 rounded-full gradient-primary text-primary-foreground font-semibold shadow-card flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {!last && (
            <Link to="/auth" className="block text-center py-2 text-sm text-muted-foreground">Skip</Link>
          )}
        </div>
      </div>
    </PhoneShell>
  );
}


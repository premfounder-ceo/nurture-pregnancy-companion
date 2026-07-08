import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/_authenticated/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Privacy Policy — Nurture" }] }),
});

function PrivacyPage() {
  return (
    <PhoneShell>
      <AppHeader title="Privacy Policy" back />
      <div className="px-5 pb-8 space-y-4">
        <div className="text-xs text-muted-foreground">Last updated: July 4, 2026</div>
        <p className="text-sm leading-relaxed">
          At Nurture, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, disclose and safeguard your information when you use our application.
        </p>

        <Section title="1. Information We Collect">
          We collect the information you provide directly to us — such as when you create an account, complete your pregnancy profile, log daily health data, symptoms, kick counts, appointments, or chat with the AI assistant. Data is encrypted in transit and stored on secured infrastructure.
        </Section>
        <Section title="2. How We Use Information">
          To provide personalized pregnancy tracking, deliver reminders you enable, generate reports you request, and respond to your inquiries. Chat messages you send to the AI assistant are processed to generate responses and stored in your account so you can review them.
        </Section>
        <Section title="3. Data Sharing">
          We do not sell your personal information. We share data only with service providers that help us operate Nurture (authentication, hosted database, AI model provider) under strict confidentiality obligations.
        </Section>
        <Section title="4. Your Rights">
          You may view, edit or export your data at any time from the app. You can permanently delete your account and all associated data from Profile → Delete account.
        </Section>
        <Section title="5. Children">
          Nurture is not directed to children under 13.
        </Section>
        <Section title="6. Trust & Safety / Compliance">
          This app complies with all applicable Google Play Developer Program Policies, including User Data, Permissions, Privacy, Ads, Device & Network Abuse, Malware, Spam, and Intellectual Property policies. It provides a safe, secure, and transparent user experience.
        </Section>
        <Section title="7. Contact">
          Questions? Reach us from Help & Support inside the app.
        </Section>
      </div>
    </PhoneShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold text-sm">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

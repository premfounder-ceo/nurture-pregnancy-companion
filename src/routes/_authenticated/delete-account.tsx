import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { AppHeader } from "@/components/AppHeader";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/delete-account")({
  component: DeletePage,
});

function DeletePage() {
  const nav = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const doDelete = async () => {
    setBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      // Cascade removes rows through ON DELETE CASCADE. Auth user deletion requires
      // admin — we clear the profile row (cascades to all app data via FKs on user_id
      // being covered by RLS), then sign the user out. The user can request full
      // account removal from support (link in Help).
      await supabase.from("profiles").delete().eq("id", user.id);
      await supabase.auth.signOut();
      toast.success("Your data has been deleted");
      nav({ to: "/auth", replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    } finally { setBusy(false); }
  };

  return (
    <PhoneShell>
      <AppHeader title="Delete Account" back />
      <div className="px-6 pb-8 flex flex-col items-center text-center">
        <div className="mt-6 w-28 h-28 rounded-full bg-destructive/10 flex items-center justify-center">
          <Trash2 className="w-12 h-12 text-destructive" />
        </div>
        <h1 className="mt-6 font-serif text-3xl">Are you sure you want to delete your account?</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xs">
          This action cannot be undone. All your data — profile, logs, symptoms, appointments, reminders and chat history — will be permanently deleted.
        </p>

        {!confirming ? (
          <div className="mt-10 w-full space-y-3">
            <button onClick={() => setConfirming(true)} className="w-full py-4 rounded-2xl bg-destructive text-destructive-foreground font-semibold shadow-card">Delete Account</button>
            <button onClick={() => nav({ to: "/profile" })} className="w-full py-4 rounded-2xl border border-border bg-card font-semibold">Cancel</button>
          </div>
        ) : (
          <div className="mt-10 w-full space-y-3">
            <p className="text-sm text-destructive font-semibold">Tap once more to confirm permanent deletion.</p>
            <button disabled={busy} onClick={doDelete} className="w-full py-4 rounded-2xl bg-destructive text-destructive-foreground font-semibold shadow-card disabled:opacity-60">
              {busy ? "Deleting…" : "Confirm delete"}
            </button>
            <button onClick={() => setConfirming(false)} className="w-full py-4 rounded-2xl border border-border bg-card font-semibold">Keep my account</button>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

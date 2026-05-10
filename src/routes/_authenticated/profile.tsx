import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data ?? { id: user.id, display_name: user.email });
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("profiles").upsert(profile);
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Profile saved");
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-hero text-white">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-4xl font-extrabold">Profile</h1>
        <form onSubmit={save} className="mt-8 space-y-4">
          <Field label="Display name" value={profile.display_name ?? ""} onChange={(v) => setProfile({ ...profile, display_name: v })} />
          <Field label="Avatar URL" value={profile.avatar_url ?? ""} onChange={(v) => setProfile({ ...profile, avatar_url: v })} />
          <div>
            <label className="block text-sm font-bold mb-2">Bio</label>
            <textarea value={profile.bio ?? ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={4}
              className="w-full rounded-2xl bg-white/8 border border-white/15 p-4 outline-none focus:border-accent" />
          </div>
          <button disabled={busy} className="h-12 px-6 rounded-2xl bg-cta text-background font-extrabold shadow-glow-cyan disabled:opacity-60">
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-2xl bg-white/8 border border-white/15 px-4 outline-none focus:border-accent" />
    </div>
  );
}

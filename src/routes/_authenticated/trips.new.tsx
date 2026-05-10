import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/trips/new")({
  component: NewTripPage,
});

function NewTripPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", destination: "", description: "",
    start_date: "", end_date: "", travelers: 1,
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sign in required"); setBusy(false); return; }
    const { data, error } = await supabase
      .from("trips")
      .insert({ ...form, user_id: user.id, start_date: form.start_date || null, end_date: form.end_date || null })
      .select().single();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Trip created");
    navigate({ to: "/trips/$tripId", params: { tripId: data.id } });
  };

  return (
    <div className="min-h-screen bg-hero text-white">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-4xl font-extrabold">Plan a new trip</h1>
        <p className="text-white/70 mt-2">Give your loop a name and pick the dates.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <Input label="Trip name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Input label="Destination" value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} placeholder="Bali, Indonesia" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" type="date" value={form.start_date} onChange={(v) => setForm({ ...form, start_date: v })} />
            <Input label="End date" type="date" value={form.end_date} onChange={(v) => setForm({ ...form, end_date: v })} />
          </div>
          <Input label="Travelers" type="number" value={String(form.travelers)} onChange={(v) => setForm({ ...form, travelers: Number(v) || 1 })} />
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
              className="w-full rounded-2xl bg-white/8 border border-white/15 p-4 outline-none focus:border-accent" />
          </div>
          <button disabled={busy} className="w-full h-13 min-h-[3.25rem] rounded-2xl bg-cta text-background font-extrabold shadow-glow-cyan disabled:opacity-60">
            {busy ? "Creating…" : "Create trip"}
          </button>
        </form>
      </main>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2">{label}</label>
      <input type={type} value={value} required={required} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-2xl bg-white/8 border border-white/15 px-4 outline-none focus:border-accent" />
    </div>
  );
}

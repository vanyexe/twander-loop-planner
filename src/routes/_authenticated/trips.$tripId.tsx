import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Share2, MapPin, DollarSign, CheckSquare, NotebookPen, Layers } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/trips/$tripId")({
  component: TripDetail,
});

type Tab = "itinerary" | "budget" | "packing" | "notes";

function TripDetail() {
  const { tripId } = Route.useParams();
  const [tab, setTab] = useState<Tab>("itinerary");
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    supabase.from("trips").select("*").eq("id", tripId).single().then(({ data }) => setTrip(data));
  }, [tripId]);

  const togglePublic = async () => {
    if (!trip) return;
    const next = !trip.is_public;
    const { error } = await supabase.from("trips").update({ is_public: next }).eq("id", tripId);
    if (error) return toast.error(error.message);
    setTrip({ ...trip, is_public: next });
    if (next) {
      const url = `${window.location.origin}/share/${tripId}`;
      navigator.clipboard?.writeText(url);
      toast.success("Public link copied to clipboard");
    } else toast.success("Made private");
  };

  return (
    <div className="min-h-screen bg-hero text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/trips" className="text-sm text-white/70 hover:text-white">← All trips</Link>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-3">
          <div>
            <h1 className="text-4xl font-extrabold">{trip?.name ?? "Trip"}</h1>
            {trip?.destination && <p className="text-white/70 mt-1 flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.destination}</p>}
          </div>
          <button onClick={togglePublic} className="inline-flex items-center gap-2 h-11 px-5 rounded-full glass font-bold">
            <Share2 className="h-4 w-4" /> {trip?.is_public ? "Public — copy link" : "Make public"}
          </button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          <TabBtn active={tab === "itinerary"} onClick={() => setTab("itinerary")} icon={<Layers className="h-4 w-4" />}>Itinerary</TabBtn>
          <TabBtn active={tab === "budget"} onClick={() => setTab("budget")} icon={<DollarSign className="h-4 w-4" />}>Budget</TabBtn>
          <TabBtn active={tab === "packing"} onClick={() => setTab("packing")} icon={<CheckSquare className="h-4 w-4" />}>Packing</TabBtn>
          <TabBtn active={tab === "notes"} onClick={() => setTab("notes")} icon={<NotebookPen className="h-4 w-4" />}>Notes</TabBtn>
        </div>

        <div className="mt-6">
          {tab === "itinerary" && <Itinerary tripId={tripId} />}
          {tab === "budget" && <Budget tripId={tripId} />}
          {tab === "packing" && <Packing tripId={tripId} />}
          {tab === "notes" && <Notes tripId={tripId} />}
        </div>
      </main>
    </div>
  );
}

function TabBtn({ active, children, onClick, icon }: any) {
  return (
    <button onClick={onClick}
      className={`px-5 h-11 rounded-full font-bold inline-flex items-center gap-2 whitespace-nowrap ${active ? "bg-cta text-background shadow-glow-cyan" : "glass text-white"}`}>
      {icon}{children}
    </button>
  );
}

function Itinerary({ tripId }: { tripId: string }) {
  const [stops, setStops] = useState<any[]>([]);
  const [city, setCity] = useState("");
  const load = async () => {
    const { data } = await supabase.from("stops").select("*, activities(*)").eq("trip_id", tripId).order("position");
    setStops(data ?? []);
  };
  useEffect(() => { load(); }, [tripId]);

  const addStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("stops").insert({ trip_id: tripId, user_id: user.id, city, position: stops.length });
    setCity("");
    load();
  };

  const addActivity = async (stopId: string, name: string, cost: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("activities").insert({ trip_id: tripId, stop_id: stopId, user_id: user.id, name, cost });
    load();
  };

  const remove = async (table: "stops" | "activities", id: string) => {
    await supabase.from(table).delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={addStop} className="glass rounded-2xl p-4 flex gap-3">
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Add a city stop…"
          className="flex-1 h-11 rounded-xl bg-white/10 px-4 outline-none focus:bg-white/15" />
        <button className="h-11 px-5 rounded-xl bg-cta text-background font-bold inline-flex items-center gap-2"><Plus className="h-4 w-4" />Add stop</button>
      </form>

      {stops.length === 0 && <p className="text-white/60">No stops yet — start adding cities.</p>}

      {stops.map((s) => (
        <div key={s.id} className="rounded-3xl bg-card text-card-foreground p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />{s.city}</h3>
            <button onClick={() => remove("stops", s.id)} className="h-9 w-9 grid place-items-center rounded-lg bg-destructive/15 text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {(s.activities ?? []).map((a: any) => (
              <li key={a.id} className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-2">
                <span className="font-medium">{a.name}</span>
                <span className="flex items-center gap-3 text-sm text-muted-foreground">
                  ${Number(a.cost ?? 0).toFixed(0)}
                  <button onClick={() => remove("activities", a.id)}><Trash2 className="h-4 w-4" /></button>
                </span>
              </li>
            ))}
          </ul>
          <ActivityForm onAdd={(n, c) => addActivity(s.id, n, c)} />
        </div>
      ))}
    </div>
  );
}

function ActivityForm({ onAdd }: { onAdd: (n: string, c: number) => void }) {
  const [n, setN] = useState(""); const [c, setC] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!n.trim()) return; onAdd(n, Number(c) || 0); setN(""); setC(""); }}
      className="mt-3 flex gap-2">
      <input value={n} onChange={(e) => setN(e.target.value)} placeholder="Activity (e.g. Sunset cruise)"
        className="flex-1 h-10 rounded-lg bg-background/40 border border-border px-3 outline-none" />
      <input value={c} onChange={(e) => setC(e.target.value)} placeholder="Cost" type="number"
        className="w-28 h-10 rounded-lg bg-background/40 border border-border px-3 outline-none" />
      <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-bold">Add</button>
    </form>
  );
}

function Budget({ tripId }: { tripId: string }) {
  const [acts, setActs] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("activities").select("*").eq("trip_id", tripId).then(({ data }) => setActs(data ?? []));
  }, [tripId]);
  const total = acts.reduce((s, a) => s + Number(a.cost ?? 0), 0);
  const byCategory = acts.reduce<Record<string, number>>((m, a) => {
    const k = a.category || "activities";
    m[k] = (m[k] ?? 0) + Number(a.cost ?? 0);
    return m;
  }, {});
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="rounded-3xl bg-card text-card-foreground p-6">
        <p className="text-sm text-muted-foreground">Total estimated</p>
        <p className="text-4xl font-extrabold mt-1">${total.toFixed(0)}</p>
        <p className="text-xs text-muted-foreground mt-2">{acts.length} item{acts.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="rounded-3xl bg-card text-card-foreground p-6">
        <h3 className="font-bold mb-3">Breakdown</h3>
        {Object.keys(byCategory).length === 0 && <p className="text-muted-foreground text-sm">No costs yet.</p>}
        <ul className="space-y-2">
          {Object.entries(byCategory).map(([k, v]) => (
            <li key={k} className="flex justify-between"><span className="capitalize">{k}</span><span className="font-bold">${v.toFixed(0)}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Packing({ tripId }: { tripId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const load = async () => {
    const { data } = await supabase.from("packing_items").select("*").eq("trip_id", tripId).order("created_at");
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, [tripId]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("packing_items").insert({ trip_id: tripId, user_id: user.id, name });
    setName(""); load();
  };
  const toggle = async (i: any) => { await supabase.from("packing_items").update({ packed: !i.packed }).eq("id", i.id); load(); };
  const del = async (id: string) => { await supabase.from("packing_items").delete().eq("id", id); load(); };

  return (
    <div className="rounded-3xl bg-card text-card-foreground p-6">
      <form onSubmit={add} className="flex gap-2 mb-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add item (passport, charger…)"
          className="flex-1 h-11 rounded-xl bg-muted px-4 outline-none" />
        <button className="h-11 px-5 rounded-xl bg-primary text-primary-foreground font-bold">Add</button>
      </form>
      {items.length === 0 && <p className="text-muted-foreground text-sm">Nothing packed yet.</p>}
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-2">
            <input type="checkbox" checked={i.packed} onChange={() => toggle(i)} className="h-4 w-4 accent-primary" />
            <span className={`flex-1 ${i.packed ? "line-through text-muted-foreground" : ""}`}>{i.name}</span>
            <button onClick={() => del(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Notes({ tripId }: { tripId: string }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const load = async () => {
    const { data } = await supabase.from("trip_notes").select("*").eq("trip_id", tripId).order("created_at", { ascending: false });
    setNotes(data ?? []);
  };
  useEffect(() => { load(); }, [tripId]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("trip_notes").insert({ trip_id: tripId, user_id: user.id, content });
    setContent(""); load();
  };
  const del = async (id: string) => { await supabase.from("trip_notes").delete().eq("id", id); load(); };

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="rounded-3xl bg-card text-card-foreground p-4">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Hotel check-in code, contacts, ideas…"
          className="w-full bg-muted rounded-xl p-3 outline-none resize-none" />
        <button className="mt-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground font-bold">Save note</button>
      </form>
      {notes.map((n) => (
        <div key={n.id} className="rounded-2xl bg-card text-card-foreground p-4 flex justify-between gap-3">
          <div>
            <p className="whitespace-pre-wrap">{n.content}</p>
            <p className="text-xs text-muted-foreground mt-2">{new Date(n.created_at).toLocaleString()}</p>
          </div>
          <button onClick={() => del(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></button>
        </div>
      ))}
    </div>
  );
}

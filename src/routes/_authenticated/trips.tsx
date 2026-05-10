import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, MapPin, Calendar, Users, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/trips")({
  component: TripsPage,
});

interface Trip {
  id: string; name: string; destination: string | null;
  start_date: string | null; end_date: string | null;
  travelers: number | null; status: string | null; cover_url: string | null;
}

function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("trips").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setTrips(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Trip deleted"); load(); }
  };

  return (
    <div className="min-h-screen bg-hero text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold">My Trips</h1>
            <p className="text-white/70 mt-1">Manage every loop you've planned.</p>
          </div>
          <Link to="/trips/new" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-cta text-background font-extrabold shadow-glow-cyan">
            <Plus className="h-4 w-4" /> New trip
          </Link>
        </div>

        {loading ? (
          <p className="text-white/60">Loading trips…</p>
        ) : trips.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <p className="text-white/80 text-lg">No trips yet. Plan your first adventure.</p>
            <Link to="/trips/new" className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-cta text-background font-bold">
              <Plus className="h-4 w-4" /> Plan a trip
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((t) => (
              <div key={t.id} className="rounded-3xl bg-card text-card-foreground overflow-hidden shadow-elev hover:-translate-y-1 transition-transform">
                <div className="h-40 bg-brand relative">
                  {t.cover_url && <img src={t.cover_url} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="text-lg font-extrabold">{t.name}</h3>
                    {t.destination && <p className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />{t.destination}</p>}
                  </div>
                </div>
                <div className="p-4 text-sm text-muted-foreground space-y-1">
                  {t.start_date && <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{t.start_date} → {t.end_date}</p>}
                  <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{t.travelers ?? 1} traveler{(t.travelers ?? 1) > 1 ? "s" : ""}</p>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <Link to="/trips/$tripId" params={{ tripId: t.id }} className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-bold inline-flex items-center justify-center">
                    Open
                  </Link>
                  <button onClick={() => remove(t.id)} className="h-10 w-10 rounded-xl bg-destructive/15 text-destructive grid place-items-center hover:bg-destructive/25">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

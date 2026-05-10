import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/share/$tripId")({
  component: SharePage,
});

function SharePage() {
  const { tripId } = Route.useParams();
  const [trip, setTrip] = useState<any>(null);
  const [stops, setStops] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: t } = await supabase.from("trips").select("*").eq("id", tripId).eq("is_public", true).maybeSingle();
      setTrip(t);
      const { data: s } = await supabase.from("stops").select("*, activities(*)").eq("trip_id", tripId).order("position");
      setStops(s ?? []);
    })();
  }, [tripId]);

  if (!trip) {
    return <div className="min-h-screen bg-hero text-white grid place-items-center"><p>This itinerary is private or not found.</p></div>;
  }

  return (
    <div className="min-h-screen bg-hero text-white">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-accent">Public itinerary</p>
        <h1 className="text-5xl font-extrabold mt-2">{trip.name}</h1>
        {trip.destination && <p className="mt-2 text-white/80 flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.destination}</p>}
        {trip.start_date && <p className="text-white/60 flex items-center gap-1 mt-1"><Calendar className="h-4 w-4" />{trip.start_date} → {trip.end_date}</p>}

        <div className="mt-8 space-y-4">
          {stops.map((s) => (
            <div key={s.id} className="rounded-3xl bg-card text-card-foreground p-5">
              <h3 className="text-xl font-extrabold">{s.city}</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {s.activities?.map((a: any) => (
                  <li key={a.id} className="flex justify-between bg-muted/40 rounded-lg px-3 py-2">
                    <span>{a.name}</span><span className="text-muted-foreground">${Number(a.cost ?? 0).toFixed(0)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

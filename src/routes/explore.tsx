import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

const CITIES = [
  { city: "Paris", country: "France", region: "Europe", cost: "$$$", popularity: 98 },
  { city: "Tokyo", country: "Japan", region: "Asia", cost: "$$$", popularity: 96 },
  { city: "Bali", country: "Indonesia", region: "Asia", cost: "$", popularity: 94 },
  { city: "New York", country: "USA", region: "Americas", cost: "$$$$", popularity: 95 },
  { city: "Santorini", country: "Greece", region: "Europe", cost: "$$$", popularity: 92 },
  { city: "Dubai", country: "UAE", region: "Middle East", cost: "$$$$", popularity: 90 },
  { city: "Sydney", country: "Australia", region: "Oceania", cost: "$$$", popularity: 88 },
  { city: "Lisbon", country: "Portugal", region: "Europe", cost: "$$", popularity: 87 },
  { city: "Bangkok", country: "Thailand", region: "Asia", cost: "$", popularity: 91 },
];

function ExplorePage() {
  const [q, setQ] = useState("");
  const filtered = CITIES.filter((c) => `${c.city} ${c.country} ${c.region}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="min-h-screen bg-hero text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl font-extrabold">Explore destinations</h1>
        <p className="text-white/70 mt-1">Find cities by name, country, or region.</p>

        <div className="mt-6 glass-light rounded-2xl flex items-center gap-3 px-5 h-13 min-h-[3.25rem]">
          <Search className="h-5 w-5 text-primary" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cities…" className="w-full bg-transparent outline-none text-foreground" />
        </div>

        <div className="mt-6 space-y-3">
          {filtered.map((c) => (
            <div key={c.city} className="rounded-2xl bg-card text-card-foreground p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg">{c.city}, <span className="text-muted-foreground font-semibold">{c.country}</span></h3>
                <p className="text-xs text-muted-foreground">{c.region} • Cost {c.cost} • Popularity {c.popularity}%</p>
              </div>
              <button className="h-10 px-4 rounded-full bg-cta text-background font-bold">Add to trip</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

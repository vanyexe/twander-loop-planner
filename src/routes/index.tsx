import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search, Filter, ArrowUpDown, Users, MapPin, Heart,
  CheckCircle2, Plus, Sparkles, ChevronRight, ArrowRight, Calendar,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useAuth } from "@/lib/auth";

import heroImg from "@/assets/hero-traveler.jpg";
import europe from "@/assets/region-europe.jpg";
import asia from "@/assets/region-asia.jpg";
import americas from "@/assets/region-americas.jpg";
import middleeast from "@/assets/region-middleeast.jpg";
import oceania from "@/assets/region-oceania.jpg";
import weekendImg from "@/assets/weekend-getaway.jpg";
import santorini from "@/assets/trip-santorini.jpg";
import bali from "@/assets/trip-bali.jpg";
import nyc from "@/assets/trip-nyc.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const REGIONS = [
  { name: "Europe", count: 128, img: europe, accent: "from-amber-400 to-amber-600", icon: "🏛️" },
  { name: "Asia", count: 96, img: asia, accent: "from-rose-400 to-rose-600", icon: "⛩️" },
  { name: "Americas", count: 120, img: americas, accent: "from-cyan-400 to-cyan-600", icon: "🗽" },
  { name: "Middle East", count: 64, img: middleeast, accent: "from-orange-400 to-orange-600", icon: "🐪" },
  { name: "Oceania", count: 48, img: oceania, accent: "from-teal-400 to-teal-600", icon: "🌴" },
];

const PREVIOUS_TRIPS = [
  { title: "Santorini Escape", place: "Santorini, Greece", date: "May 10 – May 17, 2024", people: 4, img: santorini },
  { title: "Bali Getaway", place: "Bali, Indonesia", date: "Mar 22 – Mar 29, 2024", people: 2, img: bali },
  { title: "New York City Break", place: "New York, USA", date: "Feb 14 – Feb 18, 2024", people: 3, img: nyc },
];

function Home() {
  const { user } = useAuth();
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background hero image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Traveler overlooking Halong Bay at sunset"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.16_0.06_240)]/95 via-[oklch(0.18_0.06_230)]/60 to-[oklch(0.2_0.05_220)]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      </div>

      <SiteHeader />

      <main className="relative mx-auto max-w-7xl px-6 md:px-10 pt-12 pb-20">
        {/* HERO */}
        <section className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-bold">
            <Sparkles className="h-4 w-4 text-accent" />
            Dream it. Plan it. Live it.
          </span>
          <h1 className="mt-5 font-extrabold leading-[0.95] tracking-tight text-balance text-[clamp(3rem,7vw,6rem)]">
            Where will<br />you go <span className="text-accent underline-gold">next?</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Discover places, plan unforgettable journeys, and make every loop count.
          </p>
        </section>

        {/* SEARCH ROW */}
        <section className="mt-8 flex flex-wrap items-center gap-3 max-w-4xl">
          <div className="glass-light flex h-13 min-h-[3.25rem] items-center gap-3 rounded-2xl px-5 flex-1 min-w-[260px]">
            <Search className="h-5 w-5 text-primary" />
            <input
              placeholder="Search destinations, places, or activities…"
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/70 outline-none font-medium"
            />
          </div>
          <PillButton icon={<Users className="h-4 w-4 text-primary" />} label="Group by" />
          <PillButton icon={<Filter className="h-4 w-4 text-primary" />} label="Filter" />
          <PillButton icon={<ArrowUpDown className="h-4 w-4 text-primary" />} label="Sort by" />
        </section>

        {/* WEEKEND GETAWAY card (floating right) */}
        <aside className="hidden xl:block absolute right-10 top-44 w-[300px] rounded-3xl glass p-5 animate-float shadow-elev">
          <div className="font-script text-xl text-cyan-glow">Weekend</div>
          <div className="mt-1 text-3xl font-extrabold leading-tight">Getaways</div>
          <p className="mt-2 text-sm text-white/80">Quick escapes,<br />lasting memories.</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-white text-background px-4 py-2 text-sm font-bold hover:scale-[1.02] transition-transform">
            Explore now <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <img src={weekendImg} alt="Hot air balloons" className="absolute right-3 top-3 h-32 w-24 object-cover rounded-2xl ring-2 ring-white/40" loading="lazy" />
        </aside>

        {/* REGIONS */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <MapPin className="h-5 w-5 text-cyan-glow" />
              Explore by Region
            </div>
            <Link to="/explore" className="text-sm font-semibold text-white/80 hover:text-white inline-flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {REGIONS.map((r) => (
              <Link
                to="/explore"
                key={r.name}
                className="group relative h-32 rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-elev hover:scale-[1.02] transition-transform"
              >
                <img src={r.img} alt={r.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute left-4 bottom-3">
                  <div className="text-xl font-extrabold leading-none">{r.name}</div>
                  <div className="text-xs text-white/80 mt-1">{r.count} destinations</div>
                </div>
                <div className={`absolute right-3 bottom-3 grid h-11 w-11 place-items-center rounded-full text-white text-lg ring-1 ring-white/40 shadow-card bg-gradient-to-br ${r.accent}`}>
                  {r.icon}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PREVIOUS TRIPS + CTA */}
        <section className="mt-10 grid lg:grid-cols-[1fr_360px] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 text-lg font-bold">
              <Heart className="h-5 w-5 text-coral fill-coral" /> Your previous trips
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PREVIOUS_TRIPS.map((t) => (
                <article key={t.title} className="rounded-3xl bg-card text-card-foreground overflow-hidden shadow-elev grid grid-cols-[42%_58%] hover:-translate-y-1 transition-transform">
                  <img src={t.img} alt={t.title} className="h-full w-full object-cover" loading="lazy" />
                  <div className="p-4 relative">
                    <button className="absolute right-2 top-2 h-7 w-7 grid place-items-center rounded-full bg-white text-coral shadow">
                      <Heart className="h-3.5 w-3.5 fill-current" />
                    </button>
                    <h3 className="text-sm font-extrabold pr-8">{t.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" />{t.place}</p>
                    <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3" />{t.date}</p>
                    <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5"><Users className="h-3 w-3" />{t.people} People</p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-[11px] font-bold">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl bg-promo p-6 ring-1 ring-amber-200/40 shadow-elev overflow-hidden">
            <Sparkles className="absolute right-5 top-4 h-7 w-7 text-white/90 animate-pulse-soft" />
            <h2 className="text-2xl font-extrabold leading-tight">
              Ready for your<br />next <span className="font-script text-3xl text-accent">adventure?</span>
            </h2>
            <p className="mt-3 text-sm text-white/85">Plan it, pack it, share it — all in one beautiful loop.</p>
            <Link
              to={user ? "/trips/new" : "/login"}
              className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-cta text-background text-lg font-extrabold shadow-glow-cyan ring-4 ring-white/40 hover:scale-[1.02] transition-transform"
            >
              <Plus className="h-5 w-5" /> Plan a trip
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function PillButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="glass-light h-13 min-h-[3.25rem] px-5 rounded-2xl inline-flex items-center gap-2 font-semibold hover:scale-[1.02] transition-transform">
      {icon}
      {label}
    </button>
  );
}

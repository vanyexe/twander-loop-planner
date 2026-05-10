import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/trips", label: "Trips" },
  { to: "/explore", label: "Explore" },
  { to: "/deals", label: "Deals" },
  { to: "/inspiration", label: "Inspiration" },
] as const;

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-9 w-9 rounded-xl bg-brand shadow-glow-cyan grid place-items-center">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M5 12 L12 5 L19 12 L12 19 Z" />
          <circle cx="19" cy="5" r="1.6" fill="currentColor" />
        </svg>
      </div>
      <span className="text-2xl font-extrabold tracking-tight">Traveloop</span>
    </div>
  );
}

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="relative z-30 px-6 md:px-10 pt-6">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-6">
        <Link to="/"><Logo /></Link>

        <nav className="hidden md:flex items-center gap-10 text-base font-semibold text-white/80">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative py-2 transition-colors hover:text-white"
              activeProps={{ className: "text-white [&>span]:opacity-100" }}
            >
              {item.label}
              <span className="pointer-events-none absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-cta opacity-0 transition-opacity" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button className="hidden sm:grid relative h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-coral ring-2 ring-background" />
              </button>
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="h-10 w-10 rounded-full bg-brand ring-2 ring-white/70 grid place-items-center text-sm font-bold uppercase">
                  {(user.email ?? "U")[0]}
                </div>
                <span className="hidden lg:block text-sm font-semibold">Hey, {user.email?.split("@")[0]}</span>
              </Link>
              <button onClick={handleSignOut} className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/login" className="px-5 h-10 rounded-full bg-cta text-background font-bold grid place-items-center shadow-glow-cyan">
              Sign in
            </Link>
          )}
          <button className="md:hidden h-10 w-10 grid place-items-center rounded-full bg-white/10" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-4 glass rounded-2xl p-4 mx-auto max-w-7xl flex flex-col gap-2">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="px-3 py-2 rounded-lg hover:bg-white/10" onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

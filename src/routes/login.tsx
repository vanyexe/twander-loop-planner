import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import heroImg from "@/assets/hero-traveler.jpg";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional().catch(undefined) }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: search.redirect ?? "/trips" });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — welcome aboard!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
      }
      navigate({ to: (search.redirect as string) || "/trips" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed"); return; }
    if (result.redirected) return;
    navigate({ to: "/trips" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      <div className="hidden lg:block relative overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/40 to-transparent" />
        <div className="relative z-10 p-10 h-full flex flex-col justify-between text-white">
          <Link to="/" className="text-2xl font-extrabold">Traveloop</Link>
          <div className="max-w-sm">
            <h2 className="text-4xl font-extrabold leading-tight">Plan it. <br /><span className="font-script text-5xl text-accent">Loop it.</span></h2>
            <p className="mt-4 text-white/85">Itineraries, budgets, packing lists, and journal — all in one place.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden text-2xl font-extrabold">Traveloop</Link>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-bold text-white">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Welcome back
          </span>
          <h1 className="mt-3 text-4xl font-extrabold text-white">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-2 text-white/70 text-sm">
            {mode === "signin" ? "Continue your adventure" : "Start your travel loop in seconds"}
          </p>

          <button onClick={google} className="mt-6 w-full h-12 rounded-2xl glass-light text-foreground font-bold inline-flex items-center justify-center gap-3 hover:scale-[1.01] transition-transform">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-white/40 text-xs">
            <div className="h-px flex-1 bg-white/15" /> OR <div className="h-px flex-1 bg-white/15" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <Field icon={<Sparkles className="h-4 w-4" />} type="text" placeholder="Display name" value={name} onChange={setName} />
            )}
            <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@example.com" value={email} onChange={setEmail} required />
            <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="Password" value={password} onChange={setPassword} required minLength={6} />
            <button disabled={loading} className="w-full h-12 rounded-2xl bg-cta text-background font-extrabold inline-flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.01] transition-transform disabled:opacity-60">
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-sm text-white/70 text-center">
            {mode === "signin" ? "New here? " : "Already have an account? "}
            <button onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))} className="text-accent font-bold hover:underline">
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, type, placeholder, value, onChange, required, minLength }: {
  icon: React.ReactNode; type: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; minLength?: number;
}) {
  return (
    <label className="flex items-center gap-3 h-12 rounded-2xl bg-white/8 border border-white/15 px-4 focus-within:border-accent transition-colors">
      <span className="text-white/60">{icon}</span>
      <input
        type={type} placeholder={placeholder} value={value} required={required} minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

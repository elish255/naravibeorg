import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PROFILES, slugify } from "@/lib/vibe-data";
import { LogOut, MessageCircle, Wallet, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NaraVibe" },
      { name: "description", content: "Dashboard ya NaraVibe: endelea kuchat na wageni na kufuatilia malipo yako." },
    ],
  }),
  component: DashboardPage,
});

type Profile = { full_name: string; username: string; phone: string; has_paid: boolean };
type Payment = { id: string; amount: number; currency: string; phone: string; status: string; reference: string | null; created_at: string };

function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) { navigate({ to: "/login" }); return; }
      const uid = sessionData.session.user.id;
      const [{ data: p }, { data: pay }] = await Promise.all([
        supabase.from("profiles").select("full_name, username, phone, has_paid").eq("id", uid).maybeSingle(),
        supabase.from("payments").select("id, amount, currency, phone, status, reference, created_at").eq("user_id", uid).order("created_at", { ascending: false }),
      ]);
      if (!p?.has_paid) { navigate({ to: "/payment" }); return; }
      setProfile(p as Profile);
      setPayments((pay ?? []) as Payment[]);
      setLoading(false);
    })();
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Inapakia...</main>;

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="brand-gradient sticky top-0 z-40 border-b border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 md:px-6">
          <Link to="/" className="text-xl font-extrabold italic text-primary-foreground">NARAVIBE</Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="rounded-full bg-primary-foreground/10 px-4 py-2 text-xs font-semibold text-primary-foreground">Home</Link>
            <button onClick={signOut} className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-bold text-foreground"><LogOut className="h-4 w-4" /> Toka</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 md:px-6">
        <div className="hero-surface rounded-3xl p-6 md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-brand">DASHBOARD</p>
              <h1 className="mt-2 text-2xl font-extrabold text-foreground md:text-3xl">Karibu, {profile?.full_name || profile?.username}</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Akaunti yako iko ACTIVE. Chagua mgeni hapa chini kuendelea kuchat na kuanza kupata malipo.</p>
            </div>
            <div className="brand-pill flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold"><CheckCircle2 className="h-5 w-5" /> MALIPO YAMETHIBITISHWA</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Hali ya akaunti" value="ACTIVE" />
          <Stat icon={<MessageCircle className="h-5 w-5" />} label="Username" value={profile?.username ?? "-"} />
          <Stat icon={<Wallet className="h-5 w-5" />} label="Simu" value={profile?.phone || "-"} />
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div><h2 className="text-xl font-extrabold text-foreground">Endelea Kuchat</h2><p className="mt-1 text-sm text-muted-foreground">Wageni wako wapo tayari kuanza mazungumzo.</p></div>
            <Link to="/" className="text-sm font-bold text-brand">Waone wote →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROFILES.slice(0, 6).map((guest) => (
              <div key={guest.name} className="card-soft rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <img src={`https://i.pravatar.cc/120?img=${guest.avatar}`} alt={guest.name} className="h-12 w-12 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1"><div className="font-bold text-foreground">{guest.name}</div><div className="text-xs text-muted-foreground">{guest.topic}</div></div>
                  <span className="h-2.5 w-2.5 rounded-full bg-brand" title="Online" />
                </div>
                <Link to="/chat/$slug" params={{ slug: slugify(guest.name) }} className="brand-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-primary-foreground"><MessageCircle className="h-4 w-4" /> Anza Kuchat</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4"><h2 className="font-bold text-foreground">Historia ya malipo</h2></div>
          {payments.length === 0 ? <p className="px-5 py-6 text-sm text-muted-foreground">Hakuna malipo bado.</p> : (
            <ul>{payments.map((p) => <li key={p.id} className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-0"><div><div className="font-bold text-foreground">{Number(p.amount).toLocaleString()} {p.currency}</div><div className="text-xs text-muted-foreground">{p.phone} · {new Date(p.created_at).toLocaleString()}</div></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-foreground">{p.status}</span></li>)}</ul>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-card p-4"><div className="flex items-center gap-2 text-brand">{icon}<span className="text-xs font-semibold text-muted-foreground">{label}</span></div><div className="mt-2 truncate text-lg font-extrabold text-foreground">{value}</div></div>;
}

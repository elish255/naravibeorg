import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/naravibe/SiteHeader";
import { SiteFooter } from "@/components/naravibe/SiteFooter";
import { AboutSection } from "@/components/naravibe/AboutSection";
import { ProfileCard } from "@/components/naravibe/ProfileCard";
import { WhatsAppFab } from "@/components/naravibe/WhatsAppFab";
import { SupportDialog } from "@/components/naravibe/SupportDialog";
import { PER_PAGE, PROFILES, TOTAL_PAGES } from "@/lib/vibe-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NaraVibe – Lipwa kwa Kuchati na Wageni Duniani" },
      {
        name: "description",
        content:
          "Ungana na wageni kutoka nchi mbalimbali, wafundishe Kiswahili na ulipwe kwa muda unaotumia kuchati. Jisajili NaraVibe leo.",
      },
      { property: "og:title", content: "NaraVibe – Lipwa kwa Kuchati na Wageni Duniani" },
      {
        property: "og:description",
        content:
          "Chagua mgeni, chati kuhusu mada anayopenda, na ulipwe kwa TZS kwa kila dakika ya mazungumzo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [page, setPage] = useState(1);
  const [supportOpen, setSupportOpen] = useState(false);
  const start = (page - 1) * PER_PAGE;
  const visible = PROFILES.slice(start, start + PER_PAGE);

  return (
    <div id="home" className="min-h-screen bg-background font-sans">
      <SiteHeader />

      <section className="hero-surface px-4 pb-10 pt-14 text-center md:px-6">
        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
          Get paid by <span className="text-brand">chatting with foreigners</span> about different
          topics
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground md:text-base">
          Ungana na wageni kutoka nchi mbalimbali duniani, wafundishe Kiswahili, na ulipwe kwa muda
          unaotumia kuchati.
        </p>
        <span className="mx-auto mt-8 block h-1 w-16 rounded-full bg-brand" />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-8 rounded-full bg-brand" />
            <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground">
              AVAILABLE NOW
            </h2>
          </div>
          <button
            onClick={() => setSupportOpen(true)}
            className="card-soft flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
          >
            <MessageCircle className="h-4 w-4 text-brand" /> Customer services
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm font-semibold text-muted-foreground">
            Page {page} / {TOTAL_PAGES}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={page === TOTAL_PAGES}
            className="brand-pill rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </section>

      <AboutSection />
      <SiteFooter />
      <WhatsAppFab />
      <SupportDialog open={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  );
}

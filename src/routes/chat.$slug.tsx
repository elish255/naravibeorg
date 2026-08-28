import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, Lock, MessageCircle, Send, UserPlus, X } from "lucide-react";
import { SiteHeader } from "@/components/naravibe/SiteHeader";
import { WhatsAppFab } from "@/components/naravibe/WhatsAppFab";
import { PROFILES, REGISTER_URL, formatTzs, slugify } from "@/lib/vibe-data";

export const Route = createFileRoute("/chat/$slug")({
  head: () => ({
    meta: [
      { title: "Mazungumzo – NaraVibe" },
      {
        name: "description",
        content:
          "Anza mazungumzo na mgeni kwenye NaraVibe, mfundishe Kiswahili na ulipwe kwa kila dakika.",
      },
      { property: "og:title", content: "Mazungumzo – NaraVibe" },
      {
        property: "og:description",
        content: "Anza mazungumzo na mgeni kwenye NaraVibe na ulipwe kwa muda unaotumia kuchati.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatDetails,
});

type Bubble = { from: "them" | "me"; text: string; time: string };

const nowTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function ChatDetails() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const profile = PROFILES.find((p) => slugify(p.name) === slug);

  const [typing, setTyping] = useState(true);
  const [messages, setMessages] = useState<Bubble[]>([]);
  const [draft, setDraft] = useState("");
  const [locked, setLocked] = useState(false);
  const [paid, setPaid] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {

        return;
      }
      const { data: p } = await supabase.from("profiles").select("has_paid").eq("id", data.session.user.id).maybeSingle();
      if (p?.has_paid) setPaid(true);
      else if (p) navigate({ to: "/payment" });

    })();
  }, []);

  useEffect(() => {
    if (!profile) return;
    const t = setTimeout(() => {
      setTyping(false);
      setMessages([
        {
          from: "them",
          text: `Habari, mimi jina ${profile.name}, natoka ${profile.country.toUpperCase()}. Mimi kupenda kujua Kiswahili ya ${profile.topic}. Unaweza kunifundisha?`,
          time: nowTime(),
        },
      ]);
    }, 2200);
    return () => clearTimeout(t);
  }, [profile]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-xl font-bold text-foreground">Mgeni huyu hapatikani</h1>
        <Link to="/" className="brand-pill rounded-full px-5 py-2.5 text-sm font-bold">
          Rudi Mwanzo
        </Link>
      </div>
    );
  }

  const send = () => {
    if (!draft.trim() || locked || !paid) {
      if (!paid) setLocked(true);
      return;
    }
    setMessages((m) => [...m, { from: "me", text: draft.trim(), time: nowTime() }]);
    setDraft("");
    setTimeout(() => setLocked(true), 700);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <SiteHeader />

      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button
          onClick={() => navigate({ to: "/" })}
          aria-label="Rudi mwanzo"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <img
          src={`https://i.pravatar.cc/160?img=${profile.avatar}`}
          alt={profile.name}
          className="h-12 w-12 rounded-2xl object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <img
              src={`https://flagcdn.com/24x18/${profile.country}.png`}
              alt={profile.country.toUpperCase()}
              width={24}
              height={18}
              className="rounded-[2px]"
            />
            <h1 className="text-lg font-bold text-foreground">{profile.name}</h1>
          </div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-brand">
            <span className="h-2 w-2 rounded-full bg-brand" /> Online Now
          </p>
        </div>
      </div>

      <div className="hero-surface flex-1 px-4 py-5">
        <div className="mx-auto max-w-2xl">
          <div className="brand-gradient rounded-2xl px-5 py-4 text-center text-primary-foreground">
            <MessageCircle className="mx-auto h-5 w-5" />
            <p className="mt-2 text-sm font-bold">
              Unachati na {profile.name} kwa muda wa {profile.minutes} dakika na malipo yake ni TZS{" "}
              {formatTzs(profile.tzs)}.
            </p>
          </div>

          {typing && (
            <div className="mt-6">
              <div className="card-soft inline-flex items-center gap-1.5 rounded-2xl bg-card px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand/50 [animation-delay:240ms]" />
              </div>
              <p className="mt-2 text-sm italic text-muted-foreground">
                {profile.name} anaandika...
              </p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "me" ? "flex justify-end" : ""}>
                <div className="max-w-[85%]">
                  <div
                    className={
                      m.from === "me"
                        ? "brand-gradient rounded-2xl px-4 py-3 text-sm text-primary-foreground"
                        : "card-soft rounded-2xl bg-card px-4 py-3 text-sm text-foreground"
                    }
                  >
                    {m.text}
                  </div>
                  <p
                    className={`mt-1 text-xs text-muted-foreground ${m.from === "me" ? "text-right" : ""}`}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div ref={endRef} />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Andika ujumbe wako..."
            aria-label="Andika ujumbe wako"
            className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-brand"
          />
          <button
            onClick={send}
            aria-label="Tuma ujumbe"
            className="brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-primary-foreground"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {locked && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="card-soft relative w-full max-w-md rounded-3xl bg-card p-6 text-center"
          >
            <button
              onClick={() => setLocked(false)}
              aria-label="Funga"
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-foreground">Huwezi Kutuma Ujumbe</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Huwezi kutuma ujumbe au kupata huduma hii kwa sasa{" "}
              <strong className="text-foreground">mpaka ujisajili</strong> kwenye NaraVibe.
            </p>
            <p className="mt-2 text-sm text-muted-foreground/80">
              Jisajili sasa ili uweze kuendelea na mazungumzo na kuanza kupata fedha.
            </p>
            <a
              href={REGISTER_URL}
              className="brand-gradient mt-5 flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-base font-bold text-primary-foreground"
            >
              <UserPlus className="h-5 w-5" /> Jisajili Sasa
            </a>
            <button
              onClick={() => setLocked(false)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-base font-bold text-foreground transition-colors hover:bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" /> Rudi Kwenye Chat
            </button>
          </div>
        </div>
      )}

      <WhatsAppFab raised />
    </div>
  );
}

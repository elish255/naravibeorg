import { Link } from "@tanstack/react-router";
import { Calendar, Clock, MessageCircle, Tag } from "lucide-react";
import { formatTzs, slugify, usd, type Profile } from "@/lib/vibe-data";

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <article className="card-soft rounded-2xl border border-border bg-card p-4 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <img
              src={`https://i.pravatar.cc/160?img=${profile.avatar}`}
              alt={profile.name}
              loading="lazy"
              className="h-14 w-14 rounded-full border-2 border-brand/40 object-cover"
            />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-brand" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <img
                src={`https://flagcdn.com/24x18/${profile.country}.png`}
                alt={profile.country.toUpperCase()}
                width={24}
                height={18}
                loading="lazy"
                className="rounded-[2px]"
              />
              <h3 className="text-base font-semibold text-foreground">{profile.name}</h3>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Online
            </p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">{profile.rating}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
          <Calendar className="h-3.5 w-3.5" /> August 24
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-secondary/70 p-3">
          <Clock className="h-4 w-4 text-brand" />
          <p className="mt-2 text-[10px] font-semibold tracking-widest text-muted-foreground">
            CHAT TIME
          </p>
          <p className="text-sm font-semibold text-foreground">{profile.minutes} minutes</p>
        </div>
        <div className="rounded-xl bg-secondary/70 p-3">
          <Tag className="h-4 w-4 text-brand" />
          <p className="mt-2 text-[10px] font-semibold tracking-widest text-muted-foreground">
            TOPIC
          </p>
          <p className="truncate text-sm font-semibold text-foreground">{profile.topic}</p>
        </div>
      </div>

      <div
        aria-label={`Malipo TZS ${formatTzs(profile.tzs)}`}
        className="brand-pill mt-4 flex select-none items-center justify-center rounded-xl px-3 py-3 text-base font-bold"
      >
        TZS {formatTzs(profile.tzs)}
      </div>

      <Link
        to="/chat/$slug"
        params={{ slug: slugify(profile.name) }}
        className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-bold tracking-wide text-foreground transition-colors hover:bg-secondary"
      >
        <MessageCircle className="h-4 w-4" /> START CHAT
      </Link>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        ≈ USD {usd(profile.tzs)}
      </p>
    </article>
  );
}

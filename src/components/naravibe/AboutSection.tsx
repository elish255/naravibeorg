import { Coins, Globe2, ShieldCheck, Users } from "lucide-react";
import { REGISTER_URL } from "@/lib/vibe-data";

const items = [
  {
    icon: Globe2,
    title: "Ungana na wageni",
    text: "Chagua mgeni kutoka nchi yoyote duniani na anza mazungumzo kwenye mada anayopenda.",
  },
  {
    icon: Coins,
    title: "Lipwa kwa muda",
    text: "Kila dakika unayotumia kuchati inalipwa kwa TZS, na malipo yanaonekana kwenye akaunti yako.",
  },
  {
    icon: ShieldCheck,
    title: "Salama na rahisi",
    text: "Akaunti yako inalindwa, na unaweza kutoa fedha zako wakati wowote kwa njia rahisi.",
  },
  {
    icon: Users,
    title: "Fundisha Kiswahili",
    text: "Wageni wanataka kujifunza Kiswahili na utamaduni wetu — wewe ni mwalimu wao.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto mt-24 max-w-7xl px-4 md:px-6">
      <div className="flex items-center gap-3">
        <span className="h-0.5 w-8 rounded-full bg-brand" />
        <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground">ABOUT NARAVIBE</h2>
      </div>
      <h3 className="mt-4 max-w-2xl text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
        Namna NaraVibe inavyofanya kazi
      </h3>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="card-soft rounded-2xl border border-border bg-card p-5">
            <span className="brand-pill inline-flex h-10 w-10 items-center justify-center rounded-xl">
              <item.icon className="h-5 w-5" />
            </span>
            <h4 className="mt-4 text-base font-semibold text-foreground">{item.title}</h4>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <a
          href={REGISTER_URL}
          className="brand-pill inline-flex rounded-full px-6 py-3 text-sm font-bold"
        >
          Jisajili Sasa
        </a>
      </div>
    </section>
  );
}

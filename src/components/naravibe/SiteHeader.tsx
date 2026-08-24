import { Eye, User, Wallet } from "lucide-react";
import { REGISTER_URL } from "@/lib/vibe-data";

const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="brand-gradient w-full">
      <div className="mx-auto flex max-w-7xl flex-row flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
        <a href="#home" className="shrink-0">
          <span className="block text-2xl font-extrabold italic tracking-tight text-primary-foreground">
            NARAVIBE
          </span>
          <span className="block text-[10px] tracking-[0.2em] text-primary-foreground/60">
            Share your countrie's vibe
          </span>
        </a>

        <div className="flex flex-col items-center gap-3">
          <nav className="flex items-center gap-1 rounded-full bg-primary-foreground/10 p-1">
            {nav.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className={
                  i === 0
                    ? "rounded-full bg-card px-4 py-1.5 text-sm font-semibold text-foreground"
                    : "rounded-full px-4 py-1.5 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10"
                }
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs text-primary-foreground">
              <span className="h-2 w-2 rounded-full bg-brand-light" />
              <strong>2,535</strong> live
            </span>
            <a
              href={REGISTER_URL}
              className="brand-pill flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            >
              <Wallet className="h-4 w-4" /> Withdraw
            </a>
            <a
              href={REGISTER_URL}
              className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-primary-foreground"
            >
              <Eye className="h-4 w-4" />
              <span className="text-left">
                <span className="block text-[9px] tracking-[0.15em] text-primary-foreground/70">
                  CURRENT BALANCE
                </span>
                <span className="block text-xs tracking-widest">•••••</span>
              </span>
            </a>
          </div>
        </div>

        <a
          href={REGISTER_URL}
          className="flex items-center justify-center gap-2 self-center rounded-full bg-card px-5 py-2 text-sm font-semibold text-foreground md:self-auto"
        >
          <User className="h-4 w-4" /> Login
        </a>
      </div>
    </header>
  );
}

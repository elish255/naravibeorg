import { Eye, User, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMe } from "@/lib/app.functions";
import { REGISTER_URL } from "@/lib/vibe-data";

export function SiteHeader() {
  const load = useServerFn(getMe);
  const [balance, setBalance] = useState(0);
  useEffect(() => { void load().then((r) => setBalance(Number(r.user?.balance ?? 0))).catch(() => undefined); }, [load]);
  return <header className="brand-gradient w-full"><div className="mx-auto flex max-w-7xl flex-row flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6"><a href="#home" className="shrink-0"><span className="block text-2xl font-extrabold italic tracking-tight text-primary-foreground">NARAVIBE</span><span className="block text-[10px] tracking-[0.2em] text-primary-foreground/60">Share your countrie's vibe</span></a><div className="flex flex-1 flex-row flex-wrap items-center justify-end gap-3"><div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs text-primary-foreground"><span className="h-2 w-2 rounded-full bg-brand-light"/><strong>2,535</strong> live</div><Link to="/dashboard" className="brand-pill flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"><Wallet className="h-4 w-4"/> Withdraw</Link><Link to="/dashboard" className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-primary-foreground"><Eye className="h-4 w-4"/><span className="text-left"><span className="block text-[9px] tracking-[0.15em] text-primary-foreground/70">CURRENT BALANCE</span><span className="block text-xs tracking-widest">TZS {balance.toLocaleString()}</span></span></Link></div><Link to="/login" className="flex shrink-0 items-center gap-2 rounded-full bg-card px-5 py-2 text-sm font-semibold text-foreground"><User className="h-4 w-4"/> Login</Link></div></header>;
}

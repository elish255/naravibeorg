import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { formatTzs } from "@/lib/vibe-data";

const PAYEES = [
  "Amina J.",
  "Joseph M.",
  "Fatuma S.",
  "Baraka N.",
  "Neema K.",
  "Hamisi R.",
  "Zainabu A.",
  "Emmanuel T.",
  "Rehema P.",
  "Juma L.",
  "Grace W.",
  "Salim B.",
];

const AMOUNTS = [18500, 24000, 31500, 34500, 40000, 45500, 52000, 61000];

type Payout = { id: number; name: string; amount: number; ago: number };

const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]!;

export function PayoutToasts() {
  const [toast, setToast] = useState<Payout | null>(null);

  useEffect(() => {
    let id = 0;
    let hide: ReturnType<typeof setTimeout>;

    const cycle = () => {
      id += 1;
      setToast({
        id,
        name: rand(PAYEES),
        amount: rand(AMOUNTS),
        ago: 1 + Math.floor(Math.random() * 9),
      });
      hide = setTimeout(() => setToast(null), 5000);
    };

    const first = setTimeout(cycle, 3000);
    const interval = setInterval(cycle, 9000);
    return () => {
      clearTimeout(first);
      clearTimeout(hide);
      clearInterval(interval);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-50 max-w-[80vw]">
      <div
        key={toast.id}
        role="status"
        className="card-soft flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand">
          <BadgeCheck className="h-5 w-5 text-primary-foreground" />
        </span>
        <span>
          <span className="block text-sm font-bold text-foreground">
            {toast.name} amelipwa TZS {formatTzs(toast.amount)}
          </span>
          <span className="block text-xs text-muted-foreground">
            Dakika {toast.ago} zilizopita · malipo yamekamilika
          </span>
        </span>
      </div>
    </div>
  );
}

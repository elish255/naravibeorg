import { ChevronLeft, Info, MessageCircle, Phone, X } from "lucide-react";
import { SMS_URL, WHATSAPP_CHANNEL_URL } from "@/lib/vibe-data";

export function SupportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact Customer Support"
        className="card-soft relative w-full max-w-md rounded-3xl bg-card p-6 text-center"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand">
          <MessageCircle className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-foreground">Contact Customer Support</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Chagua namna unayotaka kuwasiliana nasi
        </p>

        <a
          href={WHATSAPP_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center gap-3 rounded-2xl bg-secondary/70 p-4 text-left transition-colors hover:bg-secondary"
        >
          <span className="card-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card">
            <MessageCircle className="h-6 w-6 text-brand" />
          </span>
          <span className="flex-1">
            <span className="block text-base font-bold text-foreground">WhatsApp Channel</span>
            <span className="block text-sm text-muted-foreground">
              Follow channel yetu upate msaada na taarifa
            </span>
          </span>
          <ChevronLeft className="h-5 w-5 shrink-0 text-brand" />
        </a>

        <a
          href={SMS_URL}
          className="mt-3 flex items-center gap-3 rounded-2xl bg-secondary/70 p-4 text-left transition-colors hover:bg-secondary"
        >
          <span className="card-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card">
            <Phone className="h-6 w-6 text-foreground" />
          </span>
          <span className="flex-1">
            <span className="block text-base font-bold text-foreground">Send SMS</span>
            <span className="block text-sm text-muted-foreground">Bonyeza hapa kutuma ujumbe</span>
          </span>
          <ChevronLeft className="h-5 w-5 shrink-0 text-brand" />
        </a>

        <div className="mt-4 space-y-2 rounded-2xl bg-secondary/50 p-4 text-sm text-muted-foreground">
          <p className="flex gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong className="text-foreground">WhatsApp Channel:</strong> Follow channel yetu kwa
              taarifa zaidi.
            </span>
          </p>
          <p className="flex gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong className="text-foreground">SMS:</strong> Bonyeza ili kutuma ujumbe kwa msaada
              wa haraka.
            </span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-base font-bold text-foreground transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" /> Close
        </button>
      </div>
    </div>
  );
}

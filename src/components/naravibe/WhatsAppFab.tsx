import { useState } from "react";
import { SupportDialog } from "./SupportDialog";

export function WhatsAppFab({ raised = false }: { raised?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed right-5 z-50 flex items-center gap-2 ${raised ? "bottom-24" : "bottom-5"}`}
      >
        <span className="hidden rounded-full bg-brand-deep px-3 py-1.5 text-xs font-semibold text-primary-foreground sm:block">
          customer services
        </span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open customer services"
          className="card-soft flex h-14 w-14 items-center justify-center rounded-full bg-card"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="Customer services"
            width={30}
            height={30}
            loading="lazy"
          />
        </button>
      </div>
      <SupportDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

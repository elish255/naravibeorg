import { WHATSAPP_URL } from "@/lib/vibe-data";

export function WhatsAppFab() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <span className="hidden rounded-full bg-brand-deep px-3 py-1.5 text-xs font-semibold text-primary-foreground sm:block">
        customer services
      </span>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with customer services on WhatsApp"
        className="card-soft flex h-14 w-14 items-center justify-center rounded-full bg-card"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          width={30}
          height={30}
          loading="lazy"
        />
      </a>
    </div>
  );
}

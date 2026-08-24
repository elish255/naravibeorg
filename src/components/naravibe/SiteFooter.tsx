import { Download, MessageCircle, Radio } from "lucide-react";
import { REGISTER_URL, WHATSAPP_CHANNEL_URL, WHATSAPP_URL } from "@/lib/vibe-data";

export function SiteFooter() {
  return (
    <footer id="contact" className="brand-gradient mt-20 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <span className="block text-2xl font-extrabold italic">NARAVIBE</span>
            <span className="block text-[10px] tracking-[0.2em] text-primary-foreground/60">
              Share your countrie's vibe
            </span>
            <p className="mt-4 max-w-sm text-sm text-primary-foreground/75">
              Ungana na wageni kutoka nchi mbalimbali duniani, wafundishe Kiswahili, na ulipwe kwa
              muda unaotumia kuchati.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/70">
              CUSTOMER SERVICES
            </h4>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/20"
              >
                <MessageCircle className="h-4 w-4" /> Contact Us · 0743871339
              </a>
              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/20"
              >
                <Radio className="h-4 w-4" /> WhatsApp Channel
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/70">
              GET STARTED
            </h4>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={REGISTER_URL}
                className="brand-pill flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
              >
                <Download className="h-4 w-4" /> Download NaraVibe App
              </a>
              <a
                href={REGISTER_URL}
                className="w-fit rounded-full bg-card px-5 py-2.5 text-sm font-bold text-foreground"
              >
                Jisajili Sasa
              </a>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} NaraVibe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

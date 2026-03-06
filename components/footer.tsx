import { Instagram, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone text-pearl">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-pearl/70">
            Maison Rituals
          </p>
          <p className="max-w-sm text-sm text-pearl/80">
            A quiet rebellion against rushed spa visits. Thoughtful, in-home
            rituals for those who crave unhurried care.
          </p>
        </div>
        <div className="space-y-4 text-sm text-pearl/80">
          <div className="flex flex-col gap-2">
            <a
              href="/journal"
              className="inline-flex text-sm text-pearl/80 hover:text-pearl"
            >
              Journal
            </a>
            <a
              href="tel:07736365252"
              className="inline-flex items-center gap-2 text-sm text-pearl/80 hover:text-pearl"
            >
              <Phone className="h-4 w-4" />
              <span>07736 365 252</span>
            </a>
            <a
              href="mailto:tbaker.bhb@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-pearl/80 hover:text-pearl"
            >
              <Mail className="h-4 w-4" />
              <span>tbaker.bhb@gmail.com</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-pearl/30 text-pearl/80 hover:border-pearl hover:text-pearl"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <span className="text-xs text-pearl/60">
              © 2026 Maison Rituals. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


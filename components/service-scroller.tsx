"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "@/data/content";
import { Sparkles, X } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { CursorHover } from "@/components/custom-cursor";

export function ServiceScroller() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedService = selectedId
    ? services.find((s) => s.id === selectedId) ?? null
    : null;

  return (
    <section
      id="services"
      className="relative bg-sand/60 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl flex-col gap-8 px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-stone/70" data-reveal-child>
              Service Menu
            </p>
            <h2 className="font-serifLux text-2xl text-stone md:text-3xl" data-reveal-child>
              Curated rituals for every season of you.
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone/70">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Scroll or swipe to explore • Tap to open</span>
          </div>
        </div>
        <div
          className="no-scrollbar flex h-[420px] gap-6 overflow-x-auto px-4 snap-x snap-mandatory md:h-[460px]"
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="h-full w-[280px] snap-center flex-shrink-0"
            >
              <ServiceCard
                service={service}
                onClick={() => setSelectedId(service.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone/40 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`service-${selectedService.id}`}
              className="glass-panel relative max-h-[90vh] w-full max-w-lg overflow-hidden bg-pearl/95 p-6 shadow-peach-glow"
              initial={{ borderRadius: 999 }}
              animate={{ borderRadius: 28 }}
              exit={{ borderRadius: 999 }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <button
                onClick={() => setSelectedId(null)}
                className="absolute right-4 top-4 rounded-full bg-pearl/80 p-1 text-stone/70 hover:text-stone"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="space-y-4 pt-2">
                <span className="inline-flex rounded-full bg-peach/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone/80">
                  {selectedService.tag}
                </span>
                <h3 className="font-serifLux text-2xl text-stone">
                  {selectedService.name}
                </h3>
                <p className="text-sm text-stone/80">
                  {selectedService.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs">
                  {selectedService.durationOptions.map((duration) => (
                    <span
                      key={duration}
                      className="rounded-full bg-sand/80 px-3 py-1 uppercase tracking-[0.18em] text-stone/80"
                    >
                      {duration} minutes
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 text-sm text-stone/90">
                  <span>From</span>
                  <span className="font-medium">£{selectedService.priceFrom}</span>
                </div>
                <CursorHover>
                  <motion.button
                    className="btn-primary mt-3 w-full bg-sage text-pearl text-xs uppercase tracking-[0.25em] shadow-peach-glow"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => {
                      setSelectedId(null);
                      if (typeof document === "undefined") return;
                      const el = document.getElementById("booking");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    Book This Ritual
                  </motion.button>
                </CursorHover>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { services } from "@/data/content";
import { Sparkles, X } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { CursorHover } from "@/components/custom-cursor";

export function ServiceScroller() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedService = selectedId
    ? services.find((s) => s.id === selectedId) ?? null
    : null;

  return (
    <section
      id="services"
      className="relative bg-sand/60 py-20 md:py-28"
      ref={sectionRef}
    >
      <div className="pointer-events-none sticky top-16 z-10 mx-auto flex h-[420px] max-w-6xl flex-col gap-8 px-4 md:h-[460px]">
        <div className="flex items-baseline justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-stone/70" data-reveal-child>
              Service Menu
            </p>
            <h2 className="font-serifLux text-2xl text-stone md:text-3xl" data-reveal-child>
              Curated rituals for every season of you.
            </h2>
          </div>
          <div className="hidden items-center gap-2 text-xs text-stone/70 md:flex">
            <Sparkles className="h-4 w-4" />
            <span>Tap a card to open</span>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-3xl">
          <div className="pointer-events-auto absolute inset-0 hidden md:block">
            <motion.div
              className="flex h-full items-stretch gap-6 px-1"
              style={{ x }}
            >
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => setSelectedId(service.id)}
                />
              ))}
            </motion.div>
          </div>

          <div className="pointer-events-auto no-scrollbar flex h-full gap-4 overflow-x-auto px-1 md:hidden">
            {services.map((service) => (
              <CursorHover key={service.id}>
                <article
                  className="glass-panel flex h-full min-w-[260px] max-w-[280px] cursor-pointer flex-col justify-between bg-pearl/80 p-5 shadow-soft-elevated"
                  onClick={() => setSelectedId(service.id)}
                >
                  <div className="space-y-3">
                    {service.tag && (
                      <span className="inline-flex rounded-full bg-peach/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone/80">
                        {service.tag}
                      </span>
                    )}
                    <h3 className="font-serifLux text-lg text-stone">
                      {service.name}
                    </h3>
                    <p className="text-xs text-stone/80">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-stone/80">
                    <div>
                      <p className="uppercase tracking-[0.2em]">Durations</p>
                      <p className="mt-1">
                        {service.durationOptions.join(" / ")} min
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="uppercase tracking-[0.2em]">From</p>
                      <p className="mt-1 text-sm font-medium">
                        ${service.priceFrom}
                      </p>
                    </div>
                  </div>
                </article>
              </CursorHover>
            ))}
          </div>
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


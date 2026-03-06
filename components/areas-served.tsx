"use client";

import { motion } from "framer-motion";
import { neighborhoods } from "@/data/content";
import { MapPinned } from "lucide-react";
import { useRef } from "react";
import { useScrollReveal } from "@/components/hooks/useScrollReveal";
import { useParallax } from "@/components/hooks/useParallax";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 }
  }
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

export function AreasServed() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollReveal(sectionRef, { stagger: 0.06 });

  return (
    <motion.section
      id="areas"
      className="mx-auto w-full max-w-5xl px-4 py-20 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      ref={sectionRef}
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-stone/70">
            Areas Served
          </p>
          <h2 className="font-serifLux text-2xl text-stone md:text-3xl">
            From hilltops to waterfronts, we meet you where you are.
          </h2>
          <p className="text-sm text-stone/80 md:text-base">
            Currently serving select neighborhoods across the city and nearby
            coastal escapes. If you don&apos;t see your area listed, reach out
            to our concierge team and we&apos;ll do our best to accommodate.
          </p>
        </div>

        <motion.div
          className="glass-panel relative overflow-hidden bg-gradient-to-br from-sand/70 via-pearl/40 to-peach/40 p-5"
          variants={listVariants}
        >
          <div className="absolute inset-0 opacity-60">
            <div className="absolute -left-10 top-6 h-40 w-40 rounded-full bg-sage/25 blur-3xl" />
            <div className="absolute -right-6 bottom-0 h-40 w-40 rounded-full bg-peach/35 blur-3xl" />
          </div>
          <div className="relative flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-pearl/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone/80">
                <MapPinned className="h-3.5 w-3.5" />
                <span>Inner City</span>
              </div>
              <p className="text-xs text-stone/75">
                7-day availability with limited late-evening appointments.
              </p>
            </div>
            <p className="text-xs text-stone/70">
              Travel beyond core neighborhoods may include a discreet travel
              fee, confirmed before booking.
            </p>
          </div>
          <motion.ul
            className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-stone/90 md:grid-cols-3"
            variants={listVariants}
          >
            {neighborhoods.map((name) => (
              <motion.li key={name} variants={itemVariants}>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                  <span>{name}</span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </motion.section>
  );
}


"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useScrollReveal } from "@/components/hooks/useScrollReveal";
import { CursorHover } from "@/components/custom-cursor";

const THERAPIST_IMAGES = [
  "/photos/thomas-1.jpg",
  "/photos/thomas-2.jpg",
  "/photos/thomas-3.jpg",
  "/photos/thomas-4.jpg"
];

export function AboutTherapist() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollReveal(sectionRef, { stagger: 0.08 });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-sand/30 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
          <div className="space-y-6">
            <p
              className="text-xs uppercase tracking-[0.3em] text-stone/70"
              data-reveal-child
            >
              Meet Your Therapist
            </p>
            <h2
              className="font-serifLux text-2xl text-stone md:text-3xl"
              data-reveal-child
            >
              Grounded presence. Expert touch.
            </h2>
            <p
              className="max-w-lg text-sm leading-relaxed text-stone/85 md:text-base"
              data-reveal-child
            >
              Thomas is your Lead Massage Therapist — one dedicated practitioner
              bringing restorative wellness directly to you. Every session is
              one-on-one, tailored to your body and goals, with no rotating
              roster: you work with the same skilled hands each time. Whether
              you need to unwind, recover, or simply pause, he meets you where
              you are with a calm, professional presence and a commitment to
              lasting relief.
            </p>
          </div>

          <CursorHover>
            <div
              className="no-scrollbar flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:gap-6"
            >
              {THERAPIST_IMAGES.map((src, index) => (
                <div
                  key={src}
                  className="relative h-[350px] w-[280px] flex-shrink-0 snap-center"
                >
                  <motion.div
                    className="relative h-full w-full overflow-hidden rounded-3xl shadow-soft-elevated"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <Image
                      src={src}
                      alt={`Thomas — massage therapist (${index + 1} of ${THERAPIST_IMAGES.length})`}
                      fill
                      sizes="(max-width: 768px) 280px, 280px"
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </CursorHover>
        </div>
      </div>
    </section>
  );
}

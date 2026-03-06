"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { CursorHover } from "@/components/custom-cursor";
import { useRef } from "react";
import { useScrollReveal } from "@/components/hooks/useScrollReveal";
import { useParallax } from "@/components/hooks/useParallax";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delayChildren: 0.2, staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollReveal(sectionRef, { stagger: 0.08 });

  const x = useMotionValue(50);
  const y = useMotionValue(50);

  const background = useMotionTemplate`
    radial-gradient(circle at ${x}% ${y}%, rgba(235, 223, 206, 0.8), rgba(244, 229, 217, 1))
  `;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
    const relativeY = ((event.clientY - rect.top) / rect.height) * 100;
    x.set(relativeX);
    y.set(relativeY);
  };

  const scrollToId = (id: string) => {
    if (typeof document === "undefined") return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.section
      id="hero"
      className="relative flex min-h-screen items-center justify-center px-4 pb-24 pt-28 md:pt-32"
      style={{ background }}
      onPointerMove={handlePointerMove}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      ref={sectionRef}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-pearl/60 via-transparent to-sand/70" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-start gap-10 md:flex-row md:items-center">
        <motion.div className="flex-1 space-y-6" variants={itemVariants}>
          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-stone/70"
            variants={itemVariants}
          >
            Luxury wellness, on your schedule
          </motion.p>
          <motion.h1
            className="font-serifLux text-4xl leading-tight text-stone md:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            Luxury Wellness,
            <br className="hidden md:block" /> Delivered to Your Door.
          </motion.h1>
          <motion.p
            className="max-w-xl text-sm text-stone/80 md:text-base"
            variants={itemVariants}
          >
            Bespoke in-home massage rituals designed for those who value stillness as much as success.
            We bring the spa to your space with elevated details and a deeply calming presence.
          </motion.p>
          <motion.div
            className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center"
            variants={itemVariants}
          >
            <CursorHover>
              <motion.button
                className="btn-primary bg-sage text-pearl text-xs uppercase tracking-[0.25em] animate-pulse-soft"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => scrollToId("booking")}
              >
                Begin Booking
              </motion.button>
            </CursorHover>
            <CursorHover>
              <motion.button
                className="btn-ghost text-xs uppercase tracking-[0.25em]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => scrollToId("services")}
              >
                Explore Services
              </motion.button>
            </CursorHover>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-6 flex flex-1 justify-center md:mt-0"
          variants={itemVariants}
        >
          <motion.div
            className="glass-panel relative h-72 w-full max-w-xs overflow-hidden bg-gradient-to-br from-sage/40 via-pearl/40 to-peach/40 p-5 md:h-80 md:max-w-sm"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80"
                alt="Calm massage ritual set up in a warm, softly lit room"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-stone/70 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0,rgba(248,211,187,0.3),transparent_50%),radial-gradient(circle_at_90%_100%,rgba(178,189,163,0.35),transparent_45%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.25em] text-pearl/90">
                  Tonight&apos;s Ritual
                </p>
                <p className="font-serifLux text-2xl text-pearl">
                  Swedish Calm
                  <span className="block text-sm font-normal text-pearl/70">
                    90 minutes of guided stillness
                  </span>
                </p>
              </div>
              <div className="space-y-3 text-xs text-pearl/80">
                <div className="flex items-center justify-between">
                  <span>Arrival window</span>
                  <span>7:00–7:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span>Epsom, Surrey</span>
                </div>
                <div className="mt-2 h-px bg-pearl/20" />
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span>Therapist</span>
                  <span className="font-medium">Thomas · Lead Massage Therapist</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}


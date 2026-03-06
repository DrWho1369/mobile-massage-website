"use client";

import { motion } from "framer-motion";
import { experienceTiles } from "@/data/content";
import { CursorHover } from "@/components/custom-cursor";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const tileVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

export function ExperienceTiles() {
  return (
    <motion.section
      id="experience"
      className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-20 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={containerVariants}
    >
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-stone/70">
          The Experience
        </p>
        <h2 className="font-serifLux text-2xl text-stone md:text-3xl">
          Three ways to meet your nervous system.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {experienceTiles.map((tile) => (
          <motion.div
            key={tile.id}
            variants={tileVariants}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <CursorHover>
              <div className="glass-panel h-full bg-gradient-to-b from-sand/60 via-pearl/40 to-transparent p-5 shadow-soft-elevated transition-shadow hover:shadow-peach-glow">
                <p className="text-xs uppercase tracking-[0.28em] text-stone/60">
                  {tile.subtitle}
                </p>
                <h3 className="mt-3 font-serifLux text-xl text-stone">
                  {tile.title}
                </h3>
                <p className="mt-4 text-sm text-stone/80">{tile.description}</p>
              </div>
            </CursorHover>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}


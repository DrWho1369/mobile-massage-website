"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CursorHover } from "@/components/custom-cursor";

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

const scrollToId = (id: string) => {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export function NavBar() {
  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 pb-2 pointer-events-none"
    >
      <div className="glass-panel pointer-events-auto flex w-full max-w-5xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-sage/80" />
          <span className="font-serifLux text-lg text-stone">Maison Rituals</span>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            className="text-xs uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
            onClick={() => scrollToId("experience")}
          >
            The Experience
          </button>
          <button
            type="button"
            className="text-xs uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
            onClick={() => scrollToId("services")}
          >
            Services
          </button>
          <Link
            href="/journal"
            className="text-xs uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
          >
            Journal
          </Link>
          <CursorHover>
            <motion.button
              type="button"
              className="btn-primary text-xs uppercase tracking-[0.2em] bg-sage text-pearl animate-pulse-soft"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollToId("booking")}
            >
              Book Now
            </motion.button>
          </CursorHover>
        </div>
      </div>
    </motion.nav>
  );
}


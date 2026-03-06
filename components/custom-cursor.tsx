"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { createPortal } from "react-dom";
import { useScrollVelocity } from "@/components/lenis-provider";

type CursorContextValue = {
  setActive: (active: boolean) => void;
  cursorPosition: { x: number; y: number } | null;
};

const CursorContext = createContext<CursorContextValue | null>(null);

export const useCursor = () => {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    throw new Error("useCursor must be used within CustomCursorProvider");
  }
  return ctx;
};

export function CustomCursorProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rawVelocity = useScrollVelocity();
  const velocity = useSpring(rawVelocity, { stiffness: 120, damping: 20, mass: 0.4 });

  const baseSize = 52;
  const width = useTransform(velocity, [-1, 0, 1], [baseSize * 1.3, baseSize, baseSize * 1.3]);
  const height = useTransform(velocity, [-1, 0, 1], [baseSize * 0.8, baseSize, baseSize * 0.8]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, [x, y]);

  const cursorNode =
    mounted &&
    typeof document !== "undefined" &&
    createPortal(
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%"
        }}
      >
        <motion.div
          className="bg-sage/70 blur-md"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isActive ? 0.95 : 0.75,
            scale: isActive ? 1.25 : 0.9
          }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          style={{
            width,
            height,
            borderRadius: 999
          }}
        />
      </motion.div>,
      document.body
    );

  return (
    <CursorContext.Provider value={{ setActive: setIsActive, cursorPosition: { x: x.get(), y: y.get() } }}>
      {children}
      {cursorNode}
    </CursorContext.Provider>
  );
}

export function CursorHover({ children }: { children: React.ReactNode }) {
  const { setActive } = useCursor();
  return (
    <div
      data-cursor="interactive"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
    >
      {children}
    </div>
  );
}


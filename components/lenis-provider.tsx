"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";

type ScrollContextValue = {
  velocity: number;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export const useScrollVelocity = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollVelocity must be used within LenisProvider");
  }
  return ctx.velocity;
};

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [velocity, setVelocity] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1
    });

    lenisRef.current = lenis;

    const handleScroll = (e: { velocity: number }) => {
      const v = Math.max(-1, Math.min(1, e.velocity));
      setVelocity(v);
    };

    lenis.on("scroll", handleScroll);

    let frameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      lenis.off("scroll", handleScroll);
      lenis.destroy();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ velocity }}>
      {children}
    </ScrollContext.Provider>
  );
}


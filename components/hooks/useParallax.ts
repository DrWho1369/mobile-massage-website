"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useParallax(
  ref: React.RefObject<HTMLElement>,
  options: { y?: number; x?: number } = { y: 40 }
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const distanceY = options.y ?? 40;
      const distanceX = options.x ?? 0;

      gsap.fromTo(
        el,
        { y: distanceY, x: distanceX },
        {
          y: 0,
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [ref, options.y, options.x]);
}


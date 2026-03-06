 "use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Options = {
  stagger?: number;
  delay?: number;
};

export function useScrollReveal(ref: React.RefObject<HTMLElement>, options: Options = {}) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll("[data-reveal-child]");
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: options.stagger ?? 0.08,
          duration: 0.7,
          ease: "power3.out",
          delay: options.delay ?? 0,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [ref, options.stagger, options.delay]);
}


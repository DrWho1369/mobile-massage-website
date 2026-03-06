"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

type Options = {
  radius?: number;
  strength?: number;
};

export function useMagnetic(
  ref: React.RefObject<HTMLElement>,
  cursor: { x: number; y: number } | null,
  options: Options = {}
) {
  const radius = options.radius ?? 120;
  const strength = options.strength ?? 0.2;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !cursor) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = cursor.x - centerX;
    const distY = cursor.y - centerY;

    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < radius) {
      const pull = ((radius - distance) / radius) * strength;
      x.set(distX * pull);
      y.set(distY * pull);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [cursor, radius, strength, ref, x, y]);

  return { x: springX, y: springY };
}


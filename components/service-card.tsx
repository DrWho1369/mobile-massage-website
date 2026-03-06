"use client";

import { motion } from "framer-motion";
import { CursorHover } from "@/components/custom-cursor";
import type { services as servicesData } from "@/data/content";

type Service = (typeof servicesData)[number];

type Props = {
  service: Service;
  onClick: () => void;
};

export function ServiceCard({ service, onClick }: Props) {
  return (
    <CursorHover>
      <motion.article
        layoutId={`service-${service.id}`}
        className="glass-panel flex h-full min-w-[280px] flex-1 cursor-pointer flex-col justify-between bg-pearl/70 p-6 shadow-soft-elevated"
        whileHover={{
          y: -10,
          rotateX: 3,
          rotateY: -3
        }}
        transition={{ type: "spring", stiffness: 230, damping: 22 }}
        onClick={onClick}
      >
        <div className="space-y-4" data-reveal-child>
          {service.tag && (
            <span className="inline-flex rounded-full bg-peach/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone/80">
              {service.tag}
            </span>
          )}
          <h3 className="font-serifLux text-xl text-stone">{service.name}</h3>
          <p className="text-sm text-stone/80">{service.description}</p>
        </div>
        <div className="mt-6 flex items-center justify-between text-xs text-stone/80">
          <div>
            <p className="uppercase tracking-[0.2em]">Durations</p>
            <p className="mt-1">{service.durationOptions.join(" / ")} min</p>
          </div>
          <div className="text-right">
            <p className="uppercase tracking-[0.2em]">From</p>
            <p className="mt-1 text-base font-medium">${service.priceFrom}</p>
          </div>
        </div>
      </motion.article>
    </CursorHover>
  );
}


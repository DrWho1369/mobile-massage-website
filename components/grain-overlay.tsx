"use client";

export function GrainOverlay() {
  return (
    <>
      <svg width="0" height="0" aria-hidden focusable="false">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1"
            numOctaves="3"
            stitchTiles="noStitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.08]"
        style={{ mixBlendMode: "soft-light", filter: "url(#grain)" }}
      />
    </>
  );
}


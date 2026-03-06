export type ExperienceKey = "calm" | "restore" | "heal";

export const experienceTiles = [
  {
    id: "calm" as ExperienceKey,
    title: "Calm",
    subtitle: "Unwind your nervous system",
    description:
      "Long, flowing strokes and breath-led pacing create a cocoon of stillness to quiet the mind and reset your sleep."
  },
  {
    id: "restore" as ExperienceKey,
    title: "Restore",
    subtitle: "Release deep-held tension",
    description:
      "Targeted bodywork with intentional pressure to soften tight muscles, increase mobility, and restore effortless movement."
  },
  {
    id: "heal" as ExperienceKey,
    title: "Heal",
    subtitle: "Support deeper recovery",
    description:
      "Thoughtful, therapeutic touch designed to support injury recovery, pre/post-natal shifts, and long-term wellbeing."
  }
];

export const services = [
  {
    id: "signature",
    name: "Signature In-Home Massage",
    durationOptions: [60, 90, 120],
    description:
      "Our most-requested ritual. A personalized blend of Swedish and deep tissue set to calming soundscapes and aromatherapy.",
    priceFrom: 210,
    tag: "Most loved"
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Reset",
    durationOptions: [75, 90],
    description:
      "Focused pressure and slow, precise techniques to melt muscular knots and support athletic recovery.",
    priceFrom: 230,
    tag: "For athletes"
  },
  {
    id: "prenatal",
    name: "Prenatal Cocoon",
    durationOptions: [60, 90],
    description:
      "A grounding, side-lying massage tailored to each trimester, easing swelling, lower back tension, and restless sleep.",
    priceFrom: 220,
    tag: "Pre + post-natal"
  },
  {
    id: "couples",
    name: "Couples Ritual",
    durationOptions: [60, 90],
    description:
      "Two therapists, two tables, one beautifully synchronized experience curated in the privacy of your space.",
    priceFrom: 420,
    tag: "Shared experience"
  }
];

export const neighborhoods = [
  "Pacific Heights",
  "Nob Hill",
  "Russian Hill",
  "Marina",
  "Cow Hollow",
  "Presidio Heights",
  "Noe Valley",
  "Bernal Heights",
  "SoMa",
  "Mission District",
  "Hayes Valley",
  "North Beach"
];


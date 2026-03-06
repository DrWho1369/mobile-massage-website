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
      "Our most-requested ritual. A personalised blend of Swedish and deep tissue set to calming soundscapes and aromatherapy.",
    priceFrom: 50,
    tag: "Most loved"
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Reset",
    durationOptions: [75, 90],
    description:
      "Focused pressure and slow, precise techniques to melt muscular knots and support athletic recovery after long commutes or training.",
    priceFrom: 60,
    tag: "For athletes"
  },
  {
    id: "prenatal",
    name: "Prenatal Cocoon",
    durationOptions: [60, 90],
    description:
      "A grounding, side-lying massage tailored to each trimester, easing swelling, lower back tension, and restless sleep.",
    priceFrom: 75,
    tag: "Pre + post-natal"
  },
  {
    id: "couples",
    name: "Couples Ritual",
    durationOptions: [60, 90],
    description:
      "A premium back-to-back partners ritual: Thomas works with one partner, then the other, in the same space — one beautifully synchronised experience in the privacy of your home or hotel.",
    priceFrom: 90,
    tag: "Shared experience"
  }
];

export const neighborhoods = [
  "Epsom Town Centre",
  "Ewell",
  "Ashtead",
  "Banstead",
  "Tadworth",
  "Leatherhead",
  "Stoneleigh",
  "Worcester Park",
  "Kingswood",
  "Surbiton",
  "Kingston upon Thames",
  "Wimbledon"
];


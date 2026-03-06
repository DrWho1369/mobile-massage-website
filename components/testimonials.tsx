"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CursorHover } from "@/components/custom-cursor";
import { Star, X } from "lucide-react";

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
};

function formatUkDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/reviews", { cache: "no-store" });
        const json = (await res.json()) as { reviews?: Review[]; error?: string };
        if (!res.ok) throw new Error(json.error || "Failed to load reviews.");
        if (!cancelled) setReviews(json.reviews ?? []);
      } catch (e) {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, [reviews.length]);

  const active = reviews[index] ?? null;

  const dots = useMemo(() => {
    const count = Math.min(reviews.length, 8);
    return Array.from({ length: count }, (_, i) => i);
  }, [reviews.length]);

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          rating,
          text
        })
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || "Could not submit review.");
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    window.setTimeout(() => {
      setSubmitted(false);
      setError(null);
      setName("");
      setRating(5);
      setText("");
    }, 250);
  };

  return (
    <section id="testimonials" className="relative bg-pearl py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-stone/70" data-reveal-child>
              Testimonials
            </p>
            <h2 className="font-serifLux text-2xl text-stone md:text-3xl" data-reveal-child>
              Quiet praise, shared by clients.
            </h2>
            <p className="max-w-2xl text-sm text-stone/80 md:text-base" data-reveal-child>
              Reviews appear after approval to keep the space thoughtful and genuine.
            </p>
          </div>
          <CursorHover>
            <motion.button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-primary w-full bg-sage text-pearl text-xs uppercase tracking-[0.25em] shadow-peach-glow sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Share Your Experience
            </motion.button>
          </CursorHover>
        </div>

        <div className="glass-panel relative overflow-hidden bg-sand/40 p-6 md:p-8">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-peach/35 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-sage/25 blur-3xl" />

          <div className="relative">
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 w-40 rounded-full bg-stone/10" />
                <div className="h-20 w-full rounded-3xl bg-stone/10" />
                <div className="h-4 w-56 rounded-full bg-stone/10" />
              </div>
            ) : active ? (
              <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)] md:items-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-stone/80">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < active.rating ? "fill-peach/90 text-peach" : "text-stone/30"}`}
                        />
                      ))}
                    </div>
                    <p className="text-pretty text-base leading-relaxed text-stone md:text-lg">
                      “{active.text}”
                    </p>
                    <div className="text-xs uppercase tracking-[0.25em] text-stone/70">
                      {active.name}
                      {active.created_at ? <span className="text-stone/40"> · {formatUkDate(active.created_at)}</span> : null}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <div className="flex items-center gap-2">
                    {dots.map((i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Go to testimonial ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 w-6 rounded-full transition ${
                          i === clamp(index, 0, dots.length - 1) ? "bg-sage" : "bg-stone/20 hover:bg-stone/30"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
                      className="rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => setIndex((prev) => (prev + 1) % reviews.length)}
                      className="rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-stone/80">
                  No approved reviews yet. If you&apos;ve had a ritual with Thomas, you can be the first to share.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone/50 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-panel relative w-full max-w-lg overflow-hidden bg-pearl/95 p-6 shadow-peach-glow"
              initial={{ opacity: 0, y: 18, borderRadius: 36 }}
              animate={{ opacity: 1, y: 0, borderRadius: 28 }}
              exit={{ opacity: 0, y: 18, borderRadius: 36 }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Share your experience"
            >
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full bg-pearl/80 p-1 text-stone/70 hover:text-stone"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {submitted ? (
                <div className="space-y-4 pt-2">
                  <h3 className="font-serifLux text-2xl text-stone">Thank you.</h3>
                  <p className="text-sm text-stone/80">
                    Your review has been received and will appear once approved.
                  </p>
                  <CursorHover>
                    <motion.button
                      type="button"
                      className="btn-primary mt-2 w-full bg-sage text-pearl text-xs uppercase tracking-[0.25em]"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={closeModal}
                    >
                      Close
                    </motion.button>
                  </CursorHover>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <h3 className="font-serifLux text-2xl text-stone">Share your experience</h3>
                  <p className="text-sm text-stone/80">
                    A few words are plenty. Reviews are moderated before appearing publicly.
                  </p>

                  <div className="grid gap-3">
                    <label className="text-xs text-stone/80">
                      Name
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-full border border-stone/20 bg-pearl/80 px-3 py-2 text-xs outline-none placeholder:text-stone/40 focus:border-sage/70"
                        placeholder="Your first name (or initials)"
                        maxLength={80}
                      />
                    </label>

                    <div className="flex items-center justify-between gap-3 rounded-3xl border border-stone/20 bg-pearl/80 px-4 py-3">
                      <div className="text-xs text-stone/80">Rating</div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => {
                          const value = i + 1;
                          const activeStar = value <= rating;
                          return (
                            <button
                              key={value}
                              type="button"
                              aria-label={`${value} star`}
                              onClick={() => setRating(value)}
                              className="p-1"
                            >
                              <Star
                                className={`h-5 w-5 transition ${
                                  activeStar ? "fill-peach/90 text-peach" : "text-stone/30 hover:text-stone/45"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="text-xs text-stone/80">
                      Review
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="mt-1 h-28 w-full resize-none rounded-3xl border border-stone/20 bg-pearl/80 px-3 py-2 text-xs outline-none placeholder:text-stone/40 focus:border-sage/70"
                        placeholder="What shifted for you after the session?"
                        maxLength={1200}
                      />
                    </label>
                  </div>

                  {error ? (
                    <p className="text-sm text-peach">{error}</p>
                  ) : null}

                  <CursorHover>
                    <motion.button
                      type="button"
                      disabled={submitting}
                      className="btn-primary mt-2 w-full bg-sage text-pearl text-xs uppercase tracking-[0.25em] shadow-peach-glow disabled:opacity-60"
                      whileHover={{ scale: submitting ? 1 : 1.03 }}
                      whileTap={{ scale: submitting ? 1 : 0.97 }}
                      onClick={onSubmit}
                    >
                      {submitting ? "Sending..." : "Submit for approval"}
                    </motion.button>
                  </CursorHover>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


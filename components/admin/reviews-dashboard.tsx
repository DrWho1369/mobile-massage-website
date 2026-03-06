"use client";

import { useState } from "react";
import { Check, LogOut, Trash2 } from "lucide-react";
import type { AdminReview } from "@/app/admin/actions";
import {
  approveReview,
  deleteReview,
  logoutAdmin
} from "@/app/admin/actions";
import { CursorHover } from "@/components/custom-cursor";
import { motion } from "framer-motion";

function formatUkDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

type Props = { initialReviews: AdminReview[] };

export function ReviewsDashboard({ initialReviews }: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const pending = reviews.filter((r) => !r.is_approved);
  const approved = reviews.filter((r) => r.is_approved);

  async function handleApprove(id: string) {
    setError(null);
    setActionId(id);
    try {
      const result = await approveReview(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r))
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    setActionId(id);
    try {
      const result = await deleteReview(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-serifLux text-2xl text-stone sm:text-3xl">
            Review approvals
          </h1>
          <p className="text-sm text-stone/80">
            Approve or remove client reviews before they appear on the site.
          </p>
        </div>
        <form action={logoutAdmin}>
          <CursorHover>
            <motion.button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </motion.button>
          </CursorHover>
        </form>
      </div>

      {error && <p className="text-sm text-peach">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel bg-pearl/70 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-serifLux text-xl text-stone">Pending</h2>
            <span className="text-xs uppercase tracking-[0.25em] text-stone/60">
              {pending.length}
            </span>
          </div>
          {pending.length ? (
            <div className="space-y-4">
              {pending.map((r) => (
                <article
                  key={r.id}
                  className="rounded-3xl border border-stone/15 bg-sand/40 p-4"
                >
                  <div className="text-xs uppercase tracking-[0.25em] text-stone/70">
                    {r.name} · {r.rating}/5
                    {r.created_at && (
                      <span className="text-stone/40">
                        {" "}
                        · {formatUkDate(r.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-stone/85">{r.text}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <CursorHover>
                      <motion.button
                        type="button"
                        disabled={actionId === r.id}
                        onClick={() => handleApprove(r.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-pearl shadow-peach-glow disabled:opacity-60"
                        whileHover={
                          actionId === r.id ? undefined : { scale: 1.03 }
                        }
                        whileTap={
                          actionId === r.id ? undefined : { scale: 0.97 }
                        }
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </motion.button>
                    </CursorHover>
                    <button
                      type="button"
                      disabled={actionId === r.id}
                      onClick={() => handleDelete(r.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone/70">No pending reviews.</p>
          )}
        </section>

        <section className="glass-panel bg-pearl/70 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-serifLux text-xl text-stone">Approved</h2>
            <span className="text-xs uppercase tracking-[0.25em] text-stone/60">
              {approved.length}
            </span>
          </div>
          {approved.length ? (
            <div className="space-y-3">
              {approved.map((r) => (
                <article
                  key={r.id}
                  className="rounded-3xl border border-stone/15 bg-sand/30 p-4"
                >
                  <div className="text-xs uppercase tracking-[0.25em] text-stone/70">
                    {r.name} · {r.rating}/5
                    {r.created_at && (
                      <span className="text-stone/40">
                        {" "}
                        · {formatUkDate(r.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-stone/85">{r.text}</p>
                  <div className="mt-4">
                    <button
                      type="button"
                      disabled={actionId === r.id}
                      onClick={() => handleDelete(r.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone/70">No approved reviews yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

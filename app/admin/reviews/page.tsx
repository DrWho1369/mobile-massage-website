"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Trash2, Lock } from "lucide-react";
import { CursorHover } from "@/components/custom-cursor";

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
  is_approved: boolean;
};

function formatUkDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

async function api<T>(url: string, password: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "x-admin-password": password
    },
    cache: "no-store"
  });
  const json = (await res.json()) as any;
  if (!res.ok) throw new Error(json?.error || "Request failed");
  return json as T;
}

export default function AdminReviewsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("admin_reviews_pw");
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  const pending = useMemo(() => reviews.filter((r) => !r.is_approved), [reviews]);
  const approved = useMemo(() => reviews.filter((r) => r.is_approved), [reviews]);

  const refresh = async (pw: string) => {
    setError(null);
    setLoading(true);
    try {
      const json = await api<{ reviews: Review[] }>("/api/admin/reviews", pw);
      setReviews(json.reviews ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authed || !password) return;
    refresh(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const login = async () => {
    window.sessionStorage.setItem("admin_reviews_pw", password);
    setAuthed(true);
    await refresh(password);
  };

  const logout = () => {
    window.sessionStorage.removeItem("admin_reviews_pw");
    setAuthed(false);
    setReviews([]);
    setPassword("");
  };

  const approve = async (id: string) => {
    setError(null);
    try {
      await api<{ ok: true }>(`/api/admin/reviews/${id}`, password, { method: "PATCH" });
      await refresh(password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approve failed");
    }
  };

  const remove = async (id: string) => {
    setError(null);
    try {
      await api<{ ok: true }>(`/api/admin/reviews/${id}`, password, { method: "DELETE" });
      await refresh(password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-pearl px-4 pb-20 pt-28 text-stone">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="glass-panel bg-sand/40 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-stone/70">
                Admin
              </p>
              <h1 className="font-serifLux text-2xl sm:text-3xl">
                Review approvals
              </h1>
              <p className="text-sm text-stone/80">
                Approve thoughtful client reviews before they appear publicly.
              </p>
            </div>
            {authed ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => refresh(password)}
                  className="rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
                >
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {!authed ? (
          <div className="glass-panel bg-pearl/70 p-6">
            <div className="flex items-center gap-2 text-stone/70">
              <Lock className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.25em]">
                Password required
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <label className="text-xs text-stone/80">
                Admin password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-full border border-stone/20 bg-pearl/80 px-4 py-3 text-xs outline-none placeholder:text-stone/40 focus:border-sage/70"
                  placeholder="Enter password"
                />
              </label>
              <CursorHover>
                <motion.button
                  type="button"
                  className="btn-primary w-full bg-sage text-pearl text-xs uppercase tracking-[0.25em] shadow-peach-glow sm:w-auto"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={login}
                >
                  Unlock
                </motion.button>
              </CursorHover>
            </div>
            {error ? <p className="mt-3 text-sm text-peach">{error}</p> : null}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="glass-panel bg-pearl/70 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-serifLux text-xl">Pending</h2>
                <span className="text-xs uppercase tracking-[0.25em] text-stone/60">
                  {pending.length}
                </span>
              </div>

              {loading ? (
                <p className="text-sm text-stone/70">Loading…</p>
              ) : pending.length ? (
                <div className="space-y-4">
                  {pending.map((r) => (
                    <article key={r.id} className="rounded-3xl border border-stone/15 bg-sand/40 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.25em] text-stone/70">
                            {r.name} · {r.rating}/5 {r.created_at ? <span className="text-stone/40">· {formatUkDate(r.created_at)}</span> : null}
                          </div>
                          <p className="mt-2 text-sm text-stone/85">{r.text}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <CursorHover>
                          <motion.button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-pearl shadow-peach-glow"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => approve(r.id)}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </motion.button>
                        </CursorHover>
                        <button
                          type="button"
                          onClick={() => remove(r.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
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
                <h2 className="font-serifLux text-xl">Approved</h2>
                <span className="text-xs uppercase tracking-[0.25em] text-stone/60">
                  {approved.length}
                </span>
              </div>

              {loading ? (
                <p className="text-sm text-stone/70">Loading…</p>
              ) : approved.length ? (
                <div className="space-y-3">
                  {approved.map((r) => (
                    <article key={r.id} className="rounded-3xl border border-stone/15 bg-sand/30 p-4">
                      <div className="text-xs uppercase tracking-[0.25em] text-stone/70">
                        {r.name} · {r.rating}/5 {r.created_at ? <span className="text-stone/40">· {formatUkDate(r.created_at)}</span> : null}
                      </div>
                      <p className="mt-2 text-sm text-stone/85">{r.text}</p>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => remove(r.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
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
        )}

        {authed && error ? <p className="text-sm text-peach">{error}</p> : null}
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileEdit, LogOut, Pencil, RefreshCw, Sparkles } from "lucide-react";
import type { Post } from "@/app/admin/actions/blog";
import { getPosts } from "@/app/admin/actions/blog";
import { generateBlogDraft, regeneratePost } from "@/app/admin/actions/generate-blog";
import { logoutAdmin } from "@/app/admin/actions";
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

type Props = { initialPosts: Post[] };

export function JournalDashboard({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(() => new Set());

  const drafts = posts.filter((p) => !p.is_published);
  const published = posts.filter((p) => p.is_published);

  async function handleGenerateDraft() {
    setError(null);
    setGenerateLoading(true);
    try {
      const result = await generateBlogDraft();
      if (result.error) {
        setError(result.error);
        return;
      }
      const { posts: nextPosts } = await getPosts();
      setPosts(nextPosts);
    } finally {
      setGenerateLoading(false);
    }
  }

  async function handleRegenerate(post: Post) {
    if (
      !window.confirm(
        "This will overwrite the current live post and move it back to drafts for review. Continue?"
      )
    )
      return;
    const id = post.id;
    setError(null);
    setRegeneratingIds((prev) => new Set(prev).add(id));
    try {
      const result = await regeneratePost(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      const { posts: nextPosts } = await getPosts();
      setPosts(nextPosts);
    } finally {
      setRegeneratingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-serifLux text-2xl text-stone sm:text-3xl">
            Journal
          </h1>
          <p className="text-sm text-stone/80">
            Generate AI drafts, then review and publish to the public journal.
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

      <CursorHover>
        <motion.button
          type="button"
          disabled={generateLoading}
          onClick={handleGenerateDraft}
          className="inline-flex items-center gap-2 rounded-full bg-sage px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-pearl shadow-peach-glow disabled:opacity-60"
          whileHover={generateLoading ? undefined : { scale: 1.03 }}
          whileTap={generateLoading ? undefined : { scale: 0.97 }}
        >
          <Sparkles className="h-4 w-4" />
          {generateLoading ? "Generating…" : "Generate New Draft (AI)"}
        </motion.button>
      </CursorHover>

      {error && <p className="text-sm text-peach">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel bg-pearl/70 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-serifLux text-xl text-stone">Drafts</h2>
            <span className="text-xs uppercase tracking-[0.25em] text-stone/60">
              {drafts.length}
            </span>
          </div>
          {drafts.length ? (
            <div className="space-y-4">
              {drafts.map((p) => (
                <article
                  key={p.id}
                  className="rounded-3xl border border-stone/15 bg-sand/40 p-4"
                >
                  {p.image_url && (
                    <div className="relative mb-3 aspect-video overflow-hidden rounded-2xl bg-stone/10">
                      <Image
                        src={p.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 480px) 100vw, 240px"
                      />
                    </div>
                  )}
                  <h3 className="font-serifLux text-lg text-stone">{p.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone/60">
                    {formatUkDate(p.created_at)}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/admin/journal/${p.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
                    >
                      <FileEdit className="h-4 w-4" />
                      Review & Edit
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone/70">No drafts. Generate one above.</p>
          )}
        </section>

        <section className="glass-panel bg-pearl/70 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-serifLux text-xl text-stone">Published</h2>
            <span className="text-xs uppercase tracking-[0.25em] text-stone/60">
              {published.length}
            </span>
          </div>
          {published.length ? (
            <div className="space-y-4">
              {published.map((p) => (
                <article
                  key={p.id}
                  className="rounded-3xl border border-stone/15 bg-sand/30 p-4"
                >
                  {p.image_url && (
                    <div className="relative mb-3 aspect-video overflow-hidden rounded-2xl bg-stone/10">
                      <Image
                        src={p.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 480px) 100vw, 240px"
                      />
                    </div>
                  )}
                  <h3 className="font-serifLux text-lg text-stone">{p.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone/60">
                    {formatUkDate(p.created_at)}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/journal/${p.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={regeneratingIds.has(p.id)}
                      onClick={() => handleRegenerate(p)}
                      className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone disabled:opacity-60"
                    >
                      <RefreshCw className={`h-4 w-4 ${regeneratingIds.has(p.id) ? "animate-spin" : ""}`} />
                      {regeneratingIds.has(p.id) ? "Rewriting… (about 15 seconds)" : "Regenerate (AI)"}
                    </button>
                    <Link
                      href={`/journal/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/60 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
                    >
                      View on site
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone/70">No published posts yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

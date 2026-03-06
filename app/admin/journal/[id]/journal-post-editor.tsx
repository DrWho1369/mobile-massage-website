"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, Save } from "lucide-react";
import type { Post } from "@/app/admin/actions/blog";
import { updatePost, publishPost } from "@/app/admin/actions/blog";
import { CursorHover } from "@/components/custom-cursor";
import { motion } from "framer-motion";

type Props = { post: Post };

export function JournalPostEditor({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.image_url ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPublished = post.is_published;

  async function handleSaveChanges() {
    setError(null);
    setLoading(true);
    try {
      const result = await updatePost(post.id, {
        title,
        content,
        image_url: imageUrl.trim() || null
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    setError(null);
    setLoading(true);
    try {
      const result = await publishPost(post.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full font-serifLux text-2xl text-stone sm:text-3xl bg-transparent border-b border-stone/20 pb-2 focus:outline-none focus:border-stone/50"
          placeholder="Post title"
        />
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone/60">
          {isPublished ? "Published" : "Draft"} · {new Date(post.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </p>
      </header>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone/60">
          Image URL
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-xl border border-stone/20 bg-sand/30 px-4 py-2 text-stone focus:outline-none focus:border-stone/40"
          placeholder="https://..."
        />
        {(imageUrl || post.image_url) && (
          <div className="relative mt-3 aspect-video w-full max-w-md overflow-hidden rounded-2xl bg-stone/10">
            <Image
              src={imageUrl || post.image_url || ""}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone/60">
          Content (Markdown)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={18}
          className="w-full whitespace-pre-wrap rounded-2xl border border-stone/15 bg-sand/30 p-6 font-sansClean text-sm text-stone/90 focus:outline-none focus:border-stone/30"
          placeholder="Write your post in Markdown..."
        />
      </div>

      {error && <p className="text-sm text-peach">{error}</p>}

      <div className="flex gap-3 pt-4">
        {isPublished ? (
          <CursorHover>
            <motion.button
              type="button"
              disabled={loading}
              onClick={handleSaveChanges}
              className="inline-flex items-center gap-2 rounded-full bg-sage px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-pearl shadow-peach-glow disabled:opacity-60"
              whileHover={loading ? undefined : { scale: 1.03 }}
              whileTap={loading ? undefined : { scale: 0.97 }}
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving…" : "Save Changes"}
            </motion.button>
          </CursorHover>
        ) : (
          <CursorHover>
            <motion.button
              type="button"
              disabled={loading}
              onClick={handlePublish}
              className="inline-flex items-center gap-2 rounded-full bg-sage px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-pearl shadow-peach-glow disabled:opacity-60"
              whileHover={loading ? undefined : { scale: 1.03 }}
              whileTap={loading ? undefined : { scale: 0.97 }}
            >
              <Send className="h-4 w-4" />
              {loading ? "Publishing…" : "Publish"}
            </motion.button>
          </CursorHover>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { publishPost } from "@/app/admin/actions/blog";
import { CursorHover } from "@/components/custom-cursor";
import { motion } from "framer-motion";

type Props = { postId: string };

export function PublishPostButton({ postId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    setError(null);
    setLoading(true);
    try {
      const result = await publishPost(postId);
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
    <div className="space-y-2">
      {error && <p className="text-sm text-peach">{error}</p>}
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
    </div>
  );
}

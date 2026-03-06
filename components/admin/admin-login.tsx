"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { loginAdmin } from "@/app/admin/actions";
import { CursorHover } from "@/components/custom-cursor";
import { motion } from "framer-motion";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await loginAdmin(password);
      if (result.error) {
        setError(result.error);
        return;
      }
      // Success: server set cookie and revalidated; page will re-render with dashboard
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="glass-panel bg-pearl/70 p-6 max-w-md mx-auto">
      <div className="flex items-center gap-2 text-stone/70">
        <Lock className="h-4 w-4" />
        <p className="text-xs uppercase tracking-[0.25em]">Password required</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="text-xs text-stone/80 block">
          Admin password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-full border border-stone/20 bg-pearl/80 px-4 py-3 text-xs outline-none placeholder:text-stone/40 focus:border-sage/70"
            placeholder="Enter password"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-peach">{error}</p>}
        <CursorHover>
          <motion.button
            type="submit"
            disabled={pending}
            className="btn-primary w-full bg-sage text-pearl text-xs uppercase tracking-[0.25em] shadow-peach-glow disabled:opacity-60"
            whileHover={pending ? undefined : { scale: 1.03 }}
            whileTap={pending ? undefined : { scale: 0.97 }}
          >
            {pending ? "Checking…" : "Unlock"}
          </motion.button>
        </CursorHover>
      </form>
    </div>
  );
}

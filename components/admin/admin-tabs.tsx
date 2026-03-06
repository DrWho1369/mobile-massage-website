"use client";

import { useState } from "react";
import type { AdminReview } from "@/app/admin/actions";
import type { Post } from "@/app/admin/actions/blog";
import { ReviewsDashboard } from "@/components/admin/reviews-dashboard";
import { JournalDashboard } from "@/components/admin/journal-dashboard";

type Tab = "reviews" | "journal";

type Props = {
  initialReviews: AdminReview[];
  initialPosts: Post[];
  reviewError?: string;
};

export function AdminTabs({
  initialReviews,
  initialPosts,
  reviewError
}: Props) {
  const [tab, setTab] = useState<Tab>("reviews");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-stone/20 pb-4">
        <button
          type="button"
          onClick={() => setTab("reviews")}
          className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
            tab === "reviews"
              ? "bg-stone/15 text-stone"
              : "text-stone/70 hover:text-stone"
          }`}
        >
          Reviews
        </button>
        <button
          type="button"
          onClick={() => setTab("journal")}
          className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
            tab === "journal"
              ? "bg-stone/15 text-stone"
              : "text-stone/70 hover:text-stone"
          }`}
        >
          Journal
        </button>
      </div>

      {tab === "reviews" && (
        <>
          {reviewError && (
            <p className="text-sm text-peach">{reviewError}</p>
          )}
          <ReviewsDashboard initialReviews={initialReviews} />
        </>
      )}
      {tab === "journal" && (
        <JournalDashboard initialPosts={initialPosts} />
      )}
    </div>
  );
}

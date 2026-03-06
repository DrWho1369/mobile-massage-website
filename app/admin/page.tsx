import { isAdminAuthed } from "@/lib/admin-auth";
import { getReviews } from "@/app/admin/actions";
import { getPosts } from "@/app/admin/actions/blog";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminTabs } from "@/components/admin/admin-tabs";

export default async function AdminPage() {
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <div className="min-h-screen bg-pearl px-4 pb-20 pt-28 text-stone">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-stone/70">
              Admin
            </p>
            <h1 className="font-serifLux text-2xl text-stone sm:text-3xl">
              Review dashboard
            </h1>
          </div>
          <AdminLogin />
        </div>
      </div>
    );
  }

  const [{ reviews, error: reviewError }, { posts }] = await Promise.all([
    getReviews(),
    getPosts()
  ]);

  return (
    <div className="min-h-screen bg-pearl px-4 pb-20 pt-28 text-stone">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-stone/70">
            Admin
          </p>
        </div>
        <AdminTabs
          initialReviews={reviews}
          initialPosts={posts}
          reviewError={reviewError}
        />
      </div>
    </div>
  );
}

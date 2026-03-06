import { isAdminAuthed } from "@/lib/admin-auth";
import { getReviews } from "@/app/admin/actions";
import { AdminLogin } from "@/components/admin/admin-login";
import { ReviewsDashboard } from "@/components/admin/reviews-dashboard";

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

  const { reviews, error } = await getReviews();

  return (
    <div className="min-h-screen bg-pearl px-4 pb-20 pt-28 text-stone">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-stone/70">
            Admin
          </p>
        </div>
        {error && (
          <p className="mb-4 text-sm text-peach">{error}</p>
        )}
        <ReviewsDashboard initialReviews={reviews} />
      </div>
    </div>
  );
}

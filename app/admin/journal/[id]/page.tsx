import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getPostById } from "@/app/admin/actions/blog";
import { JournalPostEditor } from "./journal-post-editor";

type Props = { params: Promise<{ id: string }> };

export default async function AdminJournalPostPage({ params }: Props) {
  const authed = await isAdminAuthed();
  if (!authed) notFound();

  const { id } = await params;
  const { post, error } = await getPostById(id);
  if (error || !post) notFound();

  return (
    <div className="min-h-screen bg-pearl px-4 pb-20 pt-28 text-stone">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            href="/admin"
            className="text-xs uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
          >
            ← Admin
          </Link>
        </div>
        <article>
          <JournalPostEditor post={post} />
        </article>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getPostById } from "@/app/admin/actions/blog";
import { PublishPostButton } from "./publish-post-button";

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
        <article className="space-y-6">
          <header>
            <h1 className="font-serifLux text-2xl text-stone sm:text-3xl">
              {post.title}
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone/60">
              Draft · {new Date(post.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </p>
          </header>
          {post.image_url && (
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-stone/10">
              <Image
                src={post.image_url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          )}
          <div className="prose prose-stone max-w-none font-sansClean text-stone/90">
            <pre className="whitespace-pre-wrap rounded-2xl border border-stone/15 bg-sand/30 p-6 text-sm">
              {post.content}
            </pre>
          </div>
          <div className="pt-4">
            <PublishPostButton postId={post.id} />
          </div>
        </article>
      </div>
    </div>
  );
}

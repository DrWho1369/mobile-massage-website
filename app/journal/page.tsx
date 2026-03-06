import Image from "next/image";
import Link from "next/link";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";

function excerpt(content: string, maxLen = 120): string {
  const plain = content.replace(/#{1,6}\s?|\*{1,2}|_|`/g, "").trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).trim() + "…";
}

export default async function JournalPage() {
  const supabase = createSupabaseAnonServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id,title,slug,content,image_url,created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const list = posts ?? [];

  return (
    <div className="min-h-screen bg-pearl px-4 pb-20 pt-28 text-stone">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-stone/70">
            Journal
          </p>
          <h1 className="font-serifLux text-2xl text-stone sm:text-3xl">
            Wellness &amp; ritual
          </h1>
          <p className="mt-2 max-w-xl text-sm text-stone/80">
            Thoughts on massage, recovery, and mindful movement.
          </p>
        </header>

        {list.length === 0 ? (
          <p className="text-stone/70">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="glass-panel overflow-hidden rounded-3xl bg-pearl/70 transition-shadow hover:shadow-lg"
              >
                {post.image_url && (
                  <div className="relative aspect-video w-full overflow-hidden bg-stone/10">
                    <Image
                      src={post.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="font-serifLux text-lg text-stone">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone/60">
                    {new Date(post.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                  <p className="mt-3 font-sansClean text-sm text-stone/80 line-clamp-3">
                    {excerpt(post.content)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

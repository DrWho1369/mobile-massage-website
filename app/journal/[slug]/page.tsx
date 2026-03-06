import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createSupabaseAnonServerClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("id,title,slug,content,image_url,created_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !post) notFound();

  return (
    <div className="min-h-screen bg-pearl px-4 pb-20 pt-28 text-stone">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/journal"
            className="text-xs uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
          >
            ← Journal
          </Link>
        </div>
        <article className="space-y-8">
          <header>
            <h1 className="font-serifLux text-2xl text-stone sm:text-3xl md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone/60">
              {new Date(post.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
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
                priority
              />
            </div>
          )}
          <div className="journal-prose font-sansClean text-stone/90">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="font-serifLux text-2xl text-stone mt-8 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="font-serifLux text-xl text-stone mt-8 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-serifLux text-lg text-stone mt-6 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 list-disc pl-6 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 list-decimal pl-6 space-y-1">{children}</ol>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sage underline hover:no-underline"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-stone">{children}</strong>
                )
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { NavBar } from "@/components/nav-bar";
import { Hero } from "@/components/hero";
import { ExperienceTiles } from "@/components/experience-tiles";
import { ServiceScroller } from "@/components/service-scroller";
import { Testimonials } from "@/components/testimonials";
import { AboutTherapist } from "@/components/about-therapist";
import { AreasServed } from "@/components/areas-served";
import { BookingJourney } from "@/components/booking-journey";
import { Footer } from "@/components/footer";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";

function excerpt(content: string, maxLen = 100): string {
  const plain = content.replace(/#{1,6}\s?|\*{1,2}|_|`/g, "").trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).trim() + "…";
}

export default async function HomePage() {
  const supabase = createSupabaseAnonServerClient();
  const { data: latestPosts } = await supabase
    .from("posts")
    .select("id,title,slug,content,image_url,created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);
  const journalPosts = latestPosts ?? [];

  return (
    <>
      <NavBar />
      <main className="flex flex-col gap-4">
        <Hero />
        <ExperienceTiles />
        <ServiceScroller />
        <Testimonials />
        <AboutTherapist />
        <section
          id="journal-cta"
          className="bg-sand/30 px-4 py-16 text-stone md:py-20"
        >
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-stone/70">
              The Maison Rituals Journal
            </p>
            <h2 className="mt-2 font-serifLux text-2xl text-stone sm:text-3xl">
              Thoughts on Wellness
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-stone/80">
              Where physiology meets zen modernism—explore recovery, mindful
              movement, and the art of restorative touch.
            </p>
            {journalPosts.length > 0 && (
              <div className="mt-10 flex flex-wrap justify-center gap-6">
                {journalPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/journal/${post.slug}`}
                    className="glass-panel w-[280px] overflow-hidden rounded-2xl bg-pearl/70 transition-shadow hover:shadow-lg"
                  >
                    {post.image_url && (
                      <div className="relative aspect-video w-full overflow-hidden bg-stone/10">
                        <Image
                          src={post.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="280px"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-serifLux text-base text-stone line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-xs text-stone/60">
                        {excerpt(post.content)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link
              href="/journal"
              className="btn-ghost mt-8 inline-flex border-stone/30 text-stone/80 hover:border-stone/50 hover:text-stone"
            >
              Explore the Journal
            </Link>
          </div>
        </section>
        <AreasServed />
        <BookingJourney />
      </main>
      <Footer />
    </>
  );
}


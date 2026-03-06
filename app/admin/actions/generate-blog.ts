"use server";

import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import slugify from "slugify";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type GenerateResult = { postId?: string; error?: string };

export async function generateBlogDraft(): Promise<GenerateResult> {
  try {
    const authed = await isAdminAuthed();
    if (!authed) return { error: "Unauthorized" };

    const supabase = getSupabaseAdmin();

    // Step A: fetch last 20 post titles
    const { data: existingPosts, error: fetchError } = await supabase
      .from("posts")
      .select("title")
      .order("created_at", { ascending: false })
      .limit(20);

    if (fetchError) return { error: `Supabase: ${fetchError.message}` };
    const previousTitles = (existingPosts ?? []).map((p) => p.title);

    // Step B: OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return { error: "OPENAI_API_KEY is not set" };

    const openai = new OpenAI({ apiKey });
    const systemPrompt = `You are an elite wellness copywriter for Maison Rituals, a luxury mobile massage service in Surrey, UK. Your voice is zen modernism with grounding in physiology and anatomy. Use British English. Output only valid JSON.`;
    const userPrompt = `Write one new, SEO-optimised blog post on a fresh topic suitable for a luxury mobile massage / wellness audience. Avoid topics already covered in these recent titles: ${previousTitles.length ? previousTitles.join("; ") : "(none yet)"}. Return JSON with exactly: "title" (string), "content_markdown" (string, full post in Markdown), "image_search_term" (string, 1–2 words for a stock photo search, e.g. "spa relaxation" or "massage stones").`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return { error: "OpenAI returned no content" };

    let parsed: { title?: string; content_markdown?: string; image_search_term?: string };
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      return { error: "OpenAI response was not valid JSON" };
    }

    const title = parsed.title?.trim();
    const contentMarkdown = parsed.content_markdown?.trim();
    const imageSearchTerm = (parsed.image_search_term ?? "wellness spa").trim().split(/\s+/).slice(0, 2).join(" ");

    if (!title || !contentMarkdown) return { error: "OpenAI response missing title or content_markdown" };

    // Step C: Unsplash
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    let imageUrl: string | null = null;
    if (unsplashKey) {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imageSearchTerm)}&per_page=1`,
          { headers: { Authorization: `Client-ID ${unsplashKey}` } }
        );
        if (res.ok) {
          const json = (await res.json()) as { results?: Array<{ urls?: { regular?: string; full?: string } }> };
          const first = json.results?.[0];
          imageUrl = first?.urls?.regular ?? first?.urls?.full ?? null;
        }
      } catch {
        // non-fatal; continue without image
      }
    }

    // Step D: unique slug and insert
    let baseSlug = slugify(title, { lower: true, strict: true }) || "post";
    let slug = baseSlug;
    let suffix = 2;
    while (true) {
      const { data: existing } = await supabase.from("posts").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("posts")
      .insert({
        title,
        slug,
        content: contentMarkdown,
        image_url: imageUrl,
        is_published: false
      })
      .select("id")
      .single();

    if (insertError) return { error: `Insert failed: ${insertError.message}` };
    if (!inserted?.id) return { error: "Insert did not return id" };

    revalidatePath("/admin");
    revalidatePath("/journal");
    return { postId: inserted.id };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to generate draft"
    };
  }
}

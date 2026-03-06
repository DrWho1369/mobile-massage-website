"use server";

import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import slugify from "slugify";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type GenerateResult = { postId?: string; error?: string };

const MAISON_SYSTEM_PROMPT = `You are the elite, in-house wellness copywriter and Lead Massage Therapist for 'Maison Rituals', a highly exclusive luxury mobile massage service operating in Epsom, Surrey, and the surrounding home counties.

Your writing style is 'Zen Modernism meets Clinical Anatomy'.
- You do NOT sound like a generic spa brochure. You avoid cliché words like 'pamper', 'spoil yourself', or 'rub'.
- Instead, you use grounded, sophisticated, and slightly poetic language (e.g., 'nervous system regulation', 'myofascial release', 'intentional stillness', 'restorative space').
- You blend real physiological education (explaining how muscles, fascia, and the parasympathetic nervous system work) with a deeply calming, luxurious tone.

Strict Guidelines:
1. ALWAYS use British English spelling and grammar (e.g., categorise, fibre, wellbeing, tailored).
2. Subtly weave in the location (e.g., 'the quiet corners of Surrey', 'returning from a commute to Epsom', 'Surrey Hills') to build local SEO, but do not force it awkwardly.
3. Emphasize the 'in-home' aspect—the luxury of not having to drive or navigate traffic after a deeply restorative treatment.
4. Structure the post beautifully in Markdown. Use an engaging hook, clear H2 and H3 subheadings, short breathable paragraphs, and a subtle, elegant call-to-action at the very end inviting them to book a Maison Rituals experience.
5. Return your response ONLY as a JSON object with three keys: "title" (a captivating, SEO-friendly headline), "content_markdown" (the full article), and "image_search_term" (1-2 highly aesthetic, minimalist words for Unsplash, e.g., 'eucalyptus', 'minimalist shadow', 'linen texture').`;

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
    const userPrompt = `Write one new, SEO-optimised blog post on a fresh topic suitable for a luxury mobile massage / wellness audience. Avoid topics already covered in these recent titles: ${previousTitles.length ? previousTitles.join("; ") : "(none yet)"}. Return JSON with exactly: "title" (string), "content_markdown" (string, full post in Markdown), "image_search_term" (string, 1–2 words for a stock photo search, e.g. "spa relaxation" or "massage stones").`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: MAISON_SYSTEM_PROMPT },
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
          { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
        );
        const data = (await res.json()) as { results?: Array<{ urls?: { regular?: string; full?: string } }> };
        console.log("Unsplash Response:", data);
        if (res.ok) {
          imageUrl = data.results?.[0]?.urls?.regular || null;
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
    revalidatePath("/");
    return { postId: inserted.id };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to generate draft"
    };
  }
}

export type RegenerateResult = { error?: string };

export async function regeneratePost(id: string): Promise<RegenerateResult> {
  try {
    const authed = await isAdminAuthed();
    if (!authed) return { error: "Unauthorized" };

    const supabase = getSupabaseAdmin();
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("id,title")
      .eq("id", id)
      .single();

    if (fetchError || !post) return { error: "Post not found" };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return { error: "OPENAI_API_KEY is not set" };

    const openai = new OpenAI({ apiKey });
    const userPrompt = `Please completely rewrite and elevate the following blog post topic: '${post.title}'. Generate a new, captivating title, new markdown content, and a new Unsplash search term. Return your response ONLY as a JSON object with three keys: "title", "content_markdown", and "image_search_term" (1-2 highly aesthetic, minimalist words for Unsplash).`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: MAISON_SYSTEM_PROMPT },
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

    let imageUrl: string | null = null;
    if (process.env.UNSPLASH_ACCESS_KEY) {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imageSearchTerm)}&per_page=1`,
          { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
        );
        const data = (await res.json()) as { results?: Array<{ urls?: { regular?: string } }> };
        if (res.ok) imageUrl = data.results?.[0]?.urls?.regular || null;
      } catch {
        // non-fatal
      }
    }

    let baseSlug = slugify(title, { lower: true, strict: true }) || "post";
    let slug = baseSlug;
    let suffix = 2;
    while (true) {
      const { data: existing } = await supabase.from("posts").select("id").eq("slug", slug).maybeSingle();
      if (!existing || existing.id === id) break;
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        title,
        slug,
        content: contentMarkdown,
        image_url: imageUrl,
        is_published: false
      })
      .eq("id", id);

    if (updateError) return { error: updateError.message };
    revalidatePath("/admin");
    revalidatePath("/journal");
    revalidatePath("/journal/[slug]");
    revalidatePath("/");
    return {};
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to regenerate post"
    };
  }
}

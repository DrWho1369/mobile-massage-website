"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
};

export async function getPosts(): Promise<{ posts: Post[]; error?: string }> {
  try {
    const authed = await isAdminAuthed();
    if (!authed) return { posts: [], error: "Unauthorized" };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,slug,content,image_url,is_published,created_at")
      .order("created_at", { ascending: false });

    if (error) return { posts: [], error: error.message };
    return { posts: (data ?? []) as Post[] };
  } catch (e) {
    return {
      posts: [],
      error: e instanceof Error ? e.message : "Failed to load posts"
    };
  }
}

export async function publishPost(id: string): Promise<{ error?: string }> {
  try {
    const authed = await isAdminAuthed();
    if (!authed) return { error: "Unauthorized" };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("posts")
      .update({ is_published: true })
      .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin");
    revalidatePath("/journal");
    revalidatePath("/journal/[slug]");
    return {};
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to publish"
    };
  }
}

export async function getPostById(id: string): Promise<{ post: Post | null; error?: string }> {
  try {
    const authed = await isAdminAuthed();
    if (!authed) return { post: null, error: "Unauthorized" };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,slug,content,image_url,is_published,created_at")
      .eq("id", id)
      .single();

    if (error) return { post: null, error: error.message };
    return { post: data as Post };
  } catch (e) {
    return {
      post: null,
      error: e instanceof Error ? e.message : "Failed to load post"
    };
  }
}

export async function updatePost(
  id: string,
  updates: { title?: string; content?: string; image_url?: string }
): Promise<{ error?: string }> {
  try {
    const authed = await isAdminAuthed();
    if (!authed) return { error: "Unauthorized" };

    const supabase = getSupabaseAdmin();
    const payload: Record<string, unknown> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.content !== undefined) payload.content = updates.content;
    if (updates.image_url !== undefined) payload.image_url = updates.image_url;
    if (Object.keys(payload).length === 0) return {};

    const { error } = await supabase.from("posts").update(payload).eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin");
    revalidatePath("/journal");
    revalidatePath("/journal/[slug]");
    return {};
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to update post"
    };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  isAdminAuthed,
  setAdminCookie,
  clearAdminCookie,
  validateAdminPassword
} from "@/lib/admin-auth";

export type AdminReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
  is_approved: boolean;
};

export async function loginAdmin(password: string): Promise<{ error?: string }> {
  try {
    const ok = await validateAdminPassword(password);
    if (!ok) return { error: "Invalid password." };
    await setAdminCookie();
    revalidatePath("/admin");
    return {};
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Login failed."
    };
  }
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminCookie();
  revalidatePath("/admin");
}

export async function getReviews(): Promise<{
  reviews: AdminReview[];
  error?: string;
}> {
  try {
    const authed = await isAdminAuthed();
    if (!authed) return { reviews: [], error: "Unauthorized." };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("reviews")
      .select("id,name,rating,text,created_at,is_approved")
      .order("is_approved", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return { reviews: [], error: error.message };
    return { reviews: (data ?? []) as AdminReview[] };
  } catch (e) {
    return {
      reviews: [],
      error: e instanceof Error ? e.message : "Failed to load reviews."
    };
  }
}

export async function approveReview(id: string): Promise<{ error?: string }> {
  try {
    const authed = await isAdminAuthed();
    if (!authed) return { error: "Unauthorized." };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin");
    return {};
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to approve."
    };
  }
}

export async function deleteReview(id: string): Promise<{ error?: string }> {
  try {
    const authed = await isAdminAuthed();
    if (!authed) return { error: "Unauthorized." };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin");
    return {};
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to delete."
    };
  }
}

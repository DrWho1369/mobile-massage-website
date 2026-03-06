import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function requireAdminPassword() {
  const h = await headers();
  const provided = h.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_REVIEWS_PASSWORD ?? "";
  if (!expected) throw new Error("Missing ADMIN_REVIEWS_PASSWORD env var");
  if (provided !== expected) return false;
  return true;
}

export async function GET() {
  if (!(await requireAdminPassword())) return jsonError("Unauthorized", 401);

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id,name,rating,text,created_at,is_approved")
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ reviews: data ?? [] });
}


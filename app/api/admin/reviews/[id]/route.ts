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

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminPassword())) return jsonError("Unauthorized", 401);
  const { id } = await params;
  if (!id) return jsonError("Missing id", 400);

  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: true })
    .eq("id", id);

  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminPassword())) return jsonError("Unauthorized", 401);
  const { id } = await params;
  if (!id) return jsonError("Missing id", 400);

  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true });
}


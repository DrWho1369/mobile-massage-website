import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";

type ReviewRow = {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
  is_approved: boolean;
};

const cooldownByIp = new Map<string, number>();
const COOLDOWN_MS = 60_000;

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const supabase = createSupabaseAnonServerClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("id,name,rating,text,created_at,is_approved")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ reviews: (data ?? []) as ReviewRow[] });
}

export async function POST(req: Request) {
  const ip = await getClientIp();
  const now = Date.now();
  const last = cooldownByIp.get(ip) ?? 0;
  if (now - last < COOLDOWN_MS) {
    return jsonError("Please wait a minute before submitting another review.", 429);
  }

  const body = (await req.json().catch(() => null)) as
    | { name?: unknown; rating?: unknown; text?: unknown }
    | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const rating =
    typeof body?.rating === "number"
      ? body.rating
      : typeof body?.rating === "string"
        ? Number(body.rating)
        : NaN;

  if (!name || name.length > 80) return jsonError("Please enter your name (max 80 characters).");
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return jsonError("Rating must be between 1 and 5.");
  if (text.length < 10 || text.length > 1200) return jsonError("Review text must be 10–1200 characters.");

  const supabase = createSupabaseAnonServerClient();
  const { error } = await supabase.from("reviews").insert({
    name,
    rating,
    text,
    is_approved: false
  });

  if (error) return jsonError(error.message, 500);
  cooldownByIp.set(ip, now);

  return NextResponse.json({ ok: true });
}


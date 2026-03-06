import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const PAYLOAD = "admin_reviews_v1";

function getPassword(): string | undefined {
  return process.env.ADMIN_REVIEWS_PASSWORD;
}

function makeAdminSessionToken(): string {
  const secret = getPassword();
  if (!secret) throw new Error("ADMIN_REVIEWS_PASSWORD is not set.");
  return createHmac("sha256", secret).update(PAYLOAD).digest("hex");
}

function constantTimeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function setAdminCookie(): Promise<void> {
  const token = makeAdminSessionToken();
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export async function clearAdminCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function isAdminAuthed(): Promise<boolean> {
  const c = await cookies();
  const value = c.get(COOKIE_NAME)?.value;
  if (!value) return false;
  try {
    const expected = makeAdminSessionToken();
    return constantTimeCompare(value, expected);
  } catch {
    return false;
  }
}

export async function validateAdminPassword(password: string): Promise<boolean> {
  const expected = getPassword();
  if (!expected) return false;
  return constantTimeCompare(password, expected);
}

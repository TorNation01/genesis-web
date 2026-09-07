// lib/auth.js — local cookie-session auth backed by the same Postgres
import { cookies } from "next/headers";
import { createServerDb } from "./db";
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "genesis-local-dev-secret-change-me";
const COOKIE = "genesis_session";

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function createSession(userId) {
  const cookieStore = await cookies();
  const token = `${userId}.${sign(userId)}`;
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  const [userId, sig] = token.split(".");
  if (!userId || !sig || sig !== sign(userId)) return null;

  const db = createServerDb();
  const { data } = await db.from("users").select("*").eq("id", userId).maybeSingle();
  return data || null;
}

export async function getOrCreateUser(displayName, email) {
  const db = createServerDb();
  const id = crypto.randomUUID();
  const { data, error } = await db
    .from("users")
    .insert({ id, display_name: displayName || "Traveller", email: email || null })
    .select("id, display_name, email")
    .single();
  if (error) throw error;
  return data;
}

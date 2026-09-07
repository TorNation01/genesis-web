import { NextResponse } from "next/server";

const SECRET = process.env.AUTH_SECRET || "genesis-local-dev-secret-change-me";
const COOKIE = "genesis_session";

// Web Crypto (Edge-compatible) HMAC-SHA256, hex-encoded.
async function sign(value) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function validSession(request) {
  const token = request.cookies.get(COOKIE)?.value;
  if (!token) return false;
  const [userId, sig] = token.split(".");
  if (!userId || !sig) return false;
  const expected = await sign(userId);
  return sig === expected;
}

export async function middleware(request) {
  const isProtected =
    request.nextUrl.pathname.startsWith("/world") ||
    request.nextUrl.pathname.startsWith("/interface") ||
    request.nextUrl.pathname.startsWith("/play") ||
    request.nextUrl.pathname.startsWith("/character");

  if (isProtected && !(await validSession(request))) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

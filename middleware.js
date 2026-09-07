import { NextResponse } from "next/server";
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "genesis-local-dev-secret-change-me";
const COOKIE = "genesis_session";

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

function validSession(request) {
  const token = request.cookies.get(COOKIE)?.value;
  if (!token) return false;
  const [userId, sig] = token.split(".");
  if (!userId || !sig) return false;
  return sig === sign(userId);
}

export async function middleware(request) {
  const isProtected =
    request.nextUrl.pathname.startsWith("/world") ||
    request.nextUrl.pathname.startsWith("/interface") ||
    request.nextUrl.pathname.startsWith("/play") ||
    request.nextUrl.pathname.startsWith("/character");

  if (isProtected && !validSession(request)) {
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

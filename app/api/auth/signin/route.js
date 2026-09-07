// app/api/auth/signin/route.js — local sign-in (name + optional email)
import { NextResponse } from "next/server";
import { getOrCreateUser, createSession } from "@/lib/auth";

export async function POST(request) {
  try {
    const { displayName, email } = await request.json();
    if (!displayName || !displayName.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const user = await getOrCreateUser(displayName.trim(), email?.trim() || null);
    await createSession(user.id);
    return NextResponse.json({ user });
  } catch (err) {
    console.error("Sign-in error:", err);
    return NextResponse.json({ error: "Could not sign in" }, { status: 500 });
  }
}

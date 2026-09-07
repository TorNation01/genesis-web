// app/api/auth/me/route.js — return current session user
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user });
}

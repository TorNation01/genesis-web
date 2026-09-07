import { NextResponse } from "next/server";
import { createServerDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { campaignId } = await request.json();
    if (!campaignId) return NextResponse.json({ error: "Missing campaignId" }, { status: 400 });

    const db = createServerDb();
    await db
      .from("campaigns")
      .update({
        web_user_id: user.id,
        pending_link: true,
      })
      .eq("id", campaignId)
      .eq("user_id", user.id);

    return NextResponse.json({ ok: true, campaignId });
  } catch (err) {
    console.error("Link campaign error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

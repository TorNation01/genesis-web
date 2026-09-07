import { NextResponse } from "next/server";
import { createServerDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("id");
    if (!campaignId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const db = createServerDb();
    const { data: campaign } = await db
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: messages } = await db
      .from("messages")
      .select("id, role, content, created_at")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: true })
      .limit(60);

    const { data: state } = await db
      .from("campaign_state")
      .select("spark, scene_mood, tension_meter")
      .eq("campaign_id", campaignId)
      .maybeSingle();

    return NextResponse.json({ campaign, messages: messages || [], state });
  } catch (err) {
    console.error("Campaign load error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createServerDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { campaignId, message } = await request.json();
    if (!campaignId || !message) {
      return NextResponse.json(
        { error: "Missing campaignId or message" },
        { status: 400 },
      );
    }

    const db = createServerDb();
    const { data: campaign, error: campError } = await db
      .from("campaigns")
      .select("id, primary_genre, secondary_genre, time_period, status")
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (campError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const { error: insertError } = await db.from("messages").insert({
      campaign_id: campaignId,
      role: "user",
      content: message,
    });

    if (insertError) {
      console.error("messages insert:", insertError);
      return NextResponse.json({ error: "Could not save message" }, { status: 500 });
    }

    const { error: updateError } = await db
      .from("campaigns")
      .update({ last_played: new Date().toISOString() })
      .eq("id", campaignId);

    if (updateError) {
      console.error("campaigns update:", updateError);
    }

    const botUrl = process.env.BOT_WEBHOOK_URL;
    if (botUrl) {
      fetch(`${botUrl}/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, message, userId: user.id }),
      }).catch((err) => console.error("Bot webhook error:", err));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Play message error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

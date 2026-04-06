import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              /* Route handlers may not always be able to set cookies */
            }
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
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

    const { data: campaign, error: campError } = await supabase
      .from("campaigns")
      .select("id, primary_genre, secondary_genre, time_period, status")
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (campError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const { error: insertError } = await supabase.from("messages").insert({
      campaign_id: campaignId,
      role: "user",
      content: message,
    });

    if (insertError) {
      console.error("messages insert:", insertError);
      return NextResponse.json({ error: "Could not save message" }, { status: 500 });
    }

    const { error: updateError } = await supabase
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

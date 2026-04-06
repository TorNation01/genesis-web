import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("id");
    if (!campaignId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

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

    const { data: campaign } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: messages } = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: true })
      .limit(60);

    const { data: state } = await supabase
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

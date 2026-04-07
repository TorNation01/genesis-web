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
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { campaignId } = await request.json();
    if (!campaignId) return NextResponse.json({ error: "Missing campaignId" }, { status: 400 });

    // Mark this campaign as pending telegram link
    // Store the web user_id so the bot can match it
    await supabase
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

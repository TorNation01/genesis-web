import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import PlayInterface from "@/components/PlayInterface";

export default async function PlayPage({ params }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { campaignId } = await params;

  return <PlayInterface campaignId={campaignId} userId={user.id} />;
}

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LevelUpPage from "@/components/LevelUpPage";

export default async function LevelUp({ params }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { id } = await params;

  const { data: character } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!character) redirect("/");

  const { data: levelLog } = await supabase
    .from("level_up_log")
    .select("level_reached, feat_chosen, path_choice, skill_advanced")
    .eq("character_id", id)
    .order("triggered_at", { ascending: false });

  const { data: existingCards } = await supabase
    .from("character_cards")
    .select("card_id")
    .eq("character_id", id);

  return (
    <LevelUpPage
      character={character}
      levelLog={levelLog || []}
      existingCards={existingCards || []}
      userId={user.id}
    />
  );
}

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CharacterSheet from "@/components/CharacterSheet";

export default async function CharacterPage({ params }) {
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

  const { data: inventory } = await supabase
    .from("character_inventory")
    .select("*")
    .eq("character_id", id)
    .order("is_equipped", { ascending: false });

  const { data: cards } = await supabase
    .from("character_cards")
    .select("*")
    .eq("character_id", id)
    .eq("used", false)
    .order("created_at", { ascending: true });

  const { data: sparkLog } = await supabase
    .from("spark_log")
    .select("*")
    .eq("character_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: levelLog } = await supabase
    .from("level_up_log")
    .select("*")
    .eq("character_id", id)
    .order("triggered_at", { ascending: false })
    .limit(5);

  return (
    <CharacterSheet
      character={character}
      inventory={inventory || []}
      cards={cards || []}
      sparkLog={sparkLog || []}
      levelLog={levelLog || []}
      userId={user.id}
    />
  );
}

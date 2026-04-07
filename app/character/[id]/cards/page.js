import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CardsPage from "@/components/CardsPage";

export default async function Cards({ params }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { id } = await params;

  const { data: character } = await supabase
    .from("characters")
    .select("id, name, level, class, spark, spark_max")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!character) redirect("/");

  const { data: availableCards } = await supabase
    .from("character_cards")
    .select("*")
    .eq("character_id", id)
    .eq("used", false)
    .order("created_at", { ascending: true });

  const { data: usedCards } = await supabase
    .from("character_cards")
    .select("*")
    .eq("character_id", id)
    .eq("used", true)
    .order("used_at", { ascending: false });

  return (
    <CardsPage character={character} availableCards={availableCards || []} usedCards={usedCards || []} />
  );
}

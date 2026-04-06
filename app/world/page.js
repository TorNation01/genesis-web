import { redirect } from "next/navigation";
import Image from "next/image";
import WorldBuilder from "@/components/WorldBuilder";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function WorldPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--void)", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Image
          src="/genesis-bg-rift-tinted.png"
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(7,8,15,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(7,8,15,0.7) 0%, transparent 15%, transparent 80%, rgba(7,8,15,0.8) 100%)",
          }}
        />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <WorldBuilder userId={user.id} />
      </div>
    </div>
  );
}

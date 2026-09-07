// lib/supabase-server.js — server shim: local Postgres + cookie auth
import { createServerDb } from "./db";
import { getSessionUser } from "./auth";

export async function createSupabaseServerClient() {
  const db = createServerDb();
  const user = await getSessionUser();
  return {
    from(table) { return db.from(table); },
    auth: {
      async getUser() {
        return { data: { user }, error: null };
      },
      async getSession() {
        return { data: { session: user ? { user } : null }, error: null };
      },
    },
  };
}

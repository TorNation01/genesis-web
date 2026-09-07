// lib/supabase.js — browser shim: proxies all queries to /api/db (local Postgres)
// Drop-in for createSupabaseBrowserClient() with the same chainable surface.

class BrowserQueryBuilder {
  constructor(table) {
    this.table = table;
    this.selectCols = "*";
    this.conds = [];
    this.orderBy = null;
    this.limitVal = null;
    this.mode = "select";
    this.insertData = null;
    this.updateData = null;
    this.upsertData = null;
    this.upsertOn = null;
    this._single = false;
    this._maybeSingle = false;
  }

  select(cols) { this.selectCols = cols; return this; }
  eq(col, val) { this.conds.push([col, "eq", val]); return this; }
  neq(col, val) { this.conds.push([col, "neq", val]); return this; }
  gt(col, val) { this.conds.push([col, "gt", val]); return this; }
  gte(col, val) { this.conds.push([col, "gte", val]); return this; }
  lt(col, val) { this.conds.push([col, "lt", val]); return this; }
  lte(col, val) { this.conds.push([col, "lte", val]); return this; }
  is(col, val) { this.conds.push([col, "is", val]); return this; }
  in(col, val) { this.conds.push([col, "in", val]); return this; }
  match(obj) { for (const [k, v] of Object.entries(obj || {})) this.conds.push([k, "eq", v]); return this; }
  order(col, opts = {}) { this.orderBy = { col, ascending: opts.ascending !== false }; return this; }
  limit(n) { this.limitVal = n; return this; }
  single() { this._single = true; return this; }
  maybeSingle() { this._maybeSingle = true; return this; }
  insert(data) { this.mode = "insert"; this.insertData = data; return this; }
  update(data) { this.mode = "update"; this.updateData = data; return this; }
  upsert(data, opts = {}) { this.mode = "upsert"; this.upsertData = data; this.upsertOn = opts.onConflict; return this; }
  delete() { this.mode = "delete"; return this; }

  async then(resolve, reject) {
    try { resolve(await this._exec()); }
    catch (e) { reject(e); }
  }

  async _exec() {
    const res = await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table: this.table,
        mode: this.mode,
        selectCols: this.selectCols,
        conds: this.conds,
        orderBy: this.orderBy,
        limitVal: this.limitVal,
        insertData: this.insertData,
        updateData: this.updateData,
        upsertData: this.upsertData,
        upsertOn: this.upsertOn,
        single: this._single,
        maybeSingle: this._maybeSingle,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { data: null, error: new Error(body.error || "DB proxy error") };
    }
    return res.json();
  }
}

export function createSupabaseBrowserClient() {
  return {
    from(table) { return new BrowserQueryBuilder(table); },
    auth: {
      async getUser() {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return { data: { user: null }, error: null };
        const body = await res.json();
        return { data: { user: body.user }, error: null };
      },
      async getSession() {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return { data: { session: null }, error: null };
        const body = await res.json();
        return { data: { session: body.user ? { user: body.user } : null }, error: null };
      },
      async signInWithOAuth() {
        // Local auth: no OAuth — redirect to the local sign-in flow
        window.location.href = "/signin";
        return { data: null, error: null };
      },
      async signOut() {
        await fetch("/api/auth/signout", { method: "POST" });
        return { data: null, error: null };
      },
    },
    channel() {
      // Realtime replaced by polling in PlayInterface — no-op channel
      return {
        on() { return this; },
        subscribe() { return this; },
      };
    },
    removeChannel() {},
  };
}

// lib/db.js — local Postgres pool + Supabase-compatible query builder (server-side)
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.GENESIS_DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

const q = (s) => `"${String(s).replace(/"/g, '""')}"`;

function bindVal(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "object") return JSON.stringify(v);
  return v;
}

function buildWhere(conds, params) {
  if (!conds.length) return "";
  const parts = conds.map(([col, op, val]) => {
    if (op === "is" && val === null) return `${q(col)} IS NULL`;
    if (op === "is") return `${q(col)} IS NOT NULL`;
    if (op === "in") {
      const arr = Array.isArray(val) ? val : [val];
      if (!arr.length) return "1=0";
      const phs = arr.map((x) => {
        params.push(bindVal(x));
        return `$${params.length}`;
      }).join(",");
      return `${q(col)} IN (${phs})`;
    }
    const ph = `$${params.length + 1}`;
    params.push(bindVal(val));
    const ops = { eq: "=", neq: "<>", gt: ">", gte: ">=", lt: "<", lte: "<=" };
    return `${q(col)} ${ops[op] || op} ${ph}`;
  });
  return " WHERE " + parts.join(" AND ");
}

export class QueryBuilder {
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

  select(cols) {
    if (typeof cols === "string") this.selectCols = cols;
    else if (Array.isArray(cols)) this.selectCols = cols.map(q).join(", ");
    else this.selectCols = "*";
    return this;
  }
  eq(col, val) { this.conds.push([col, "eq", val]); return this; }
  neq(col, val) { this.conds.push([col, "neq", val]); return this; }
  gt(col, val) { this.conds.push([col, "gt", val]); return this; }
  gte(col, val) { this.conds.push([col, "gte", val]); return this; }
  lt(col, val) { this.conds.push([col, "lt", val]); return this; }
  lte(col, val) { this.conds.push([col, "lte", val]); return this; }
  is(col, val) { this.conds.push([col, "is", val]); return this; }
  in(col, val) { this.conds.push([col, "in", val]); return this; }
  match(obj) { for (const [k, v] of Object.entries(obj || {})) this.conds.push([k, "eq", v]); return this; }
  order(col, opts = {}) {
    const dir = opts.ascending === false ? "DESC" : "ASC";
    this.orderBy = ` ORDER BY ${q(col)} ${dir}`;
    return this;
  }
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
    const params = [];
    let sql = "";

    if (this.mode === "select") {
      sql = `SELECT ${this.selectCols} FROM ${q(this.table)}`;
      sql += buildWhere(this.conds, params);
      if (this.orderBy) sql += this.orderBy;
      if (this.limitVal) sql += ` LIMIT ${this.limitVal}`;
    } else if (this.mode === "insert") {
      const rows = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const cols = Object.keys(rows[0] || {});
      const colSql = cols.map(q).join(", ");
      const valSql = rows.map((r) => {
        const phs = cols.map((c) => { params.push(bindVal(r[c])); return `$${params.length}`; });
        return `(${phs.join(", ")})`;
      }).join(", ");
      sql = `INSERT INTO ${q(this.table)} (${colSql}) VALUES ${valSql}`;
      sql += this.selectCols !== "*" ? ` RETURNING ${this.selectCols}` : " RETURNING *";
    } else if (this.mode === "update") {
      const entries = Object.entries(this.updateData || {});
      if (!entries.length) {
        sql = `SELECT ${this.selectCols} FROM ${q(this.table)}`;
        sql += buildWhere(this.conds, params);
        if (this.orderBy) sql += this.orderBy;
        if (this.limitVal) sql += ` LIMIT ${this.limitVal}`;
      } else {
        const sets = entries.map(([c, v]) => { params.push(bindVal(v)); return `${q(c)} = $${params.length}`; }).join(", ");
        sql = `UPDATE ${q(this.table)} SET ${sets}`;
        sql += buildWhere(this.conds, params);
        sql += this.selectCols !== "*" ? ` RETURNING ${this.selectCols}` : " RETURNING *";
      }
    } else if (this.mode === "upsert") {
      const rows = Array.isArray(this.upsertData) ? this.upsertData : [this.upsertData];
      const cols = Object.keys(rows[0] || {});
      const colSql = cols.map(q).join(", ");
      const valSql = rows.map((r) => {
        const phs = cols.map((c) => { params.push(bindVal(r[c])); return `$${params.length}`; });
        return `(${phs.join(", ")})`;
      }).join(", ");
      sql = `INSERT INTO ${q(this.table)} (${colSql}) VALUES ${valSql}`;
      if (this.upsertOn) {
        const onCols = Array.isArray(this.upsertOn) ? this.upsertOn : [this.upsertOn];
        const conflictCols = onCols.map(q).join(", ");
        const updates = cols.filter((c) => !onCols.includes(c)).map((c) => `${q(c)} = EXCLUDED.${q(c)}`).join(", ");
        sql += ` ON CONFLICT (${conflictCols}) DO UPDATE SET ${updates}`;
      } else {
        sql += " ON CONFLICT DO NOTHING";
      }
      sql += this.selectCols !== "*" ? ` RETURNING ${this.selectCols}` : " RETURNING *";
    } else if (this.mode === "delete") {
      sql = `DELETE FROM ${q(this.table)}`;
      sql += buildWhere(this.conds, params);
      sql += this.selectCols !== "*" ? ` RETURNING ${this.selectCols}` : " RETURNING *";
    }

    try {
      const res = await pool.query(sql, params);
      let data = res.rows;
      if (this._single || this._maybeSingle) data = data[0] || null;
      return { data, error: null };
    } catch (err) {
      console.error("[db] SQL error:", err.message, "| SQL:", sql);
      return { data: null, error: err };
    }
  }
}

export function createServerDb() {
  return {
    from(table) { return new QueryBuilder(table); },
  };
}

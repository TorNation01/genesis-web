// app/api/db/route.js — proxy for browser-side queries to local Postgres
import { NextResponse } from "next/server";
import { createServerDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();
    const { table, mode, selectCols, conds, orderBy, limitVal, insertData, updateData, upsertData, upsertOn, single, maybeSingle } = body;

    const db = createServerDb();
    let qb = db.from(table);

    if (mode === "select") {
      qb = qb.select(selectCols || "*");
      for (const [col, op, val] of conds || []) {
        if (op === "eq") qb = qb.eq(col, val);
        else if (op === "neq") qb = qb.neq(col, val);
        else if (op === "gt") qb = qb.gt(col, val);
        else if (op === "gte") qb = qb.gte(col, val);
        else if (op === "lt") qb = qb.lt(col, val);
        else if (op === "lte") qb = qb.lte(col, val);
        else if (op === "is") qb = qb.is(col, val);
        else if (op === "in") qb = qb.in(col, val);
      }
      if (orderBy) qb = qb.order(orderBy.col, { ascending: orderBy.ascending });
      if (limitVal) qb = qb.limit(limitVal);
      if (single) qb = qb.single();
      if (maybeSingle) qb = qb.maybeSingle();
    } else if (mode === "insert") {
      qb = qb.insert(insertData);
      if (selectCols && selectCols !== "*") qb = qb.select(selectCols);
      if (single) qb = qb.single();
    } else if (mode === "update") {
      qb = qb.update(updateData);
      for (const [col, op, val] of conds || []) {
        if (op === "eq") qb = qb.eq(col, val);
        else if (op === "neq") qb = qb.neq(col, val);
        else if (op === "in") qb = qb.in(col, val);
      }
      if (selectCols && selectCols !== "*") qb = qb.select(selectCols);
      if (single) qb = qb.single();
    } else if (mode === "upsert") {
      qb = qb.upsert(upsertData, { onConflict: upsertOn });
      if (selectCols && selectCols !== "*") qb = qb.select(selectCols);
      if (single) qb = qb.single();
    } else if (mode === "delete") {
      qb = qb.delete();
      for (const [col, op, val] of conds || []) {
        if (op === "eq") qb = qb.eq(col, val);
      }
    }

    const result = await qb;
    return NextResponse.json(result);
  } catch (err) {
    console.error("DB proxy error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

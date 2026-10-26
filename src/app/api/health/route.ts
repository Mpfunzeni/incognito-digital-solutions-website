import { NextResponse } from "next/server";
import { databaseUrl, query } from "@/lib/hosting/db";
import { emailDeliveryEnabled } from "@/lib/smtp";

export const dynamic = "force-dynamic";

/**
 * Set-up check for the hosting system: whether a database connection string
 * was found and whether the database answers. Reveals no names or values.
 */
export async function GET() {
  const found = Boolean(databaseUrl());
  let connected = false;
  if (found) {
    try {
      await query("SELECT 1");
      connected = true;
    } catch (err) {
      console.error("[health] database connection failed", err);
    }
  }
  return NextResponse.json(
    { database: { found, connected }, payments: Boolean(process.env.PAYFAST_MODE), email: emailDeliveryEnabled() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

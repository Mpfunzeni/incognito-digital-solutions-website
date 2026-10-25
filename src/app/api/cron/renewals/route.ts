import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { isDatabaseConfigured } from "@/lib/hosting/db";
import { createRenewalInvoices } from "@/lib/hosting/store";

/**
 * Daily job (see vercel.json): creates renewal invoices 14 days before each
 * service's renewal date and emails them. Vercel Cron sends
 * "Authorization: Bearer <CRON_SECRET>".
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const given = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!secret || given.length !== expected.length || !timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const created = await createRenewalInvoices();
  return NextResponse.json({ ok: true, created });
}

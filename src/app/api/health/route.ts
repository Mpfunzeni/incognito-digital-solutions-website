import { NextResponse, type NextRequest } from "next/server";
import { databaseUrl, query } from "@/lib/hosting/db";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkSmtp, emailDeliveryEnabled } from "@/lib/smtp";

export const dynamic = "force-dynamic";

const emailCheckLimiter = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

/**
 * Set-up check for the hosting system: whether a database connection string
 * was found and whether the database answers. Reveals no names or values.
 * `?check=email` also logs in to the mail server (without sending) and says
 * why it fails.
 */
export async function GET(request: NextRequest) {
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
  const body: Record<string, unknown> = {
    database: { found, connected },
    payments: Boolean(process.env.PAYFAST_MODE),
    email: emailDeliveryEnabled(),
  };
  if (request.nextUrl.searchParams.get("check") === "email") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    body.emailCheck = emailCheckLimiter(ip).allowed ? await checkSmtp() : { ok: false, problem: "Too many checks, try again in 15 minutes." };
  }
  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}

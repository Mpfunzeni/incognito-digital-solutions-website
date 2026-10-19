import { NextResponse, type NextRequest } from "next/server";
import { MIN_FILL_TIME_MS, quoteSchema, toFieldErrors } from "@/lib/quote-schema";
import { createRateLimiter } from "@/lib/rate-limit";
import { deliverQuote } from "@/lib/email";
import { site } from "@/content/site";

const limiter = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  const rate = limiter(clientIp(req));
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later, or contact us directly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > 20_000) {
    return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    // Honeypot or timing failures are bots: reject without detail.
    if (fieldErrors.website || fieldErrors.startedAt) {
      return NextResponse.json({ ok: false, error: "Your submission could not be processed." }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Please correct the highlighted fields.", fieldErrors }, { status: 422 });
  }

  if (Date.now() - parsed.data.startedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: false, error: "Your submission could not be processed." }, { status: 400 });
  }

  const result = await deliverQuote(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `We could not send your request right now. Please email ${site.contact.email} or call ${site.contact.phoneDisplay}.`,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}

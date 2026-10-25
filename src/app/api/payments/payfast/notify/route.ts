import { NextResponse, type NextRequest } from "next/server";
import { confirmWithPayfast, parseItn, payfastConfig, verifyItnSignature } from "@/lib/hosting/payfast";
import { getInvoiceById, markInvoicePaid } from "@/lib/hosting/store";

/**
 * PayFast Instant Transaction Notification. PayFast calls this after every
 * payment. Checks, in order: signature, merchant ID, server-to-server
 * confirmation with PayFast, and the amount against our invoice. Only then is
 * the invoice marked paid. Always answers 200 so PayFast does not retry
 * notifications we have deliberately rejected.
 */
export async function POST(req: NextRequest) {
  const cfg = payfastConfig();
  if (!cfg) return new NextResponse(null, { status: 503 });

  const raw = await req.text();
  if (raw.length > 10_000) return new NextResponse(null, { status: 413 });
  const fields = parseItn(raw);
  const data = Object.fromEntries(fields);

  if (!verifyItnSignature(fields, cfg.passphrase)) {
    console.warn("[payfast] ITN rejected: bad signature");
    return new NextResponse(null, { status: 200 });
  }
  if (data.merchant_id !== cfg.merchantId) {
    console.warn("[payfast] ITN rejected: merchant mismatch");
    return new NextResponse(null, { status: 200 });
  }
  if (!(await confirmWithPayfast(cfg, raw).catch(() => false))) {
    console.warn("[payfast] ITN rejected: PayFast did not confirm");
    return new NextResponse(null, { status: 200 });
  }

  const invoice = data.m_payment_id ? await getInvoiceById(data.m_payment_id) : null;
  if (!invoice) {
    console.warn("[payfast] ITN for unknown invoice", data.m_payment_id);
    return new NextResponse(null, { status: 200 });
  }
  const grossCents = Math.round(Number(data.amount_gross) * 100);
  if (grossCents !== invoice.total_cents) {
    console.warn(`[payfast] ITN amount mismatch for ${invoice.id}: ${grossCents} vs ${invoice.total_cents}`);
    return new NextResponse(null, { status: 200 });
  }
  if (data.payment_status === "COMPLETE") {
    await markInvoicePaid(invoice.id, "payfast", data.pf_payment_id ?? "");
  }
  return new NextResponse(null, { status: 200 });
}

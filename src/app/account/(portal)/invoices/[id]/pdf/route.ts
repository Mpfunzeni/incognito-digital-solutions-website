import { NextResponse, type NextRequest } from "next/server";
import { getCurrentCustomer, isAdmin } from "@/lib/hosting/session";
import { getInvoiceForPdf, invoicePdf } from "@/lib/hosting/store";

export const dynamic = "force-dynamic";

/** Downloads an invoice as a PDF, for its customer or an admin. */
export async function GET(request: NextRequest, { params }: RouteContext<"/account/invoices/[id]/pdf">) {
  const { id } = await params;
  const customer = await getCurrentCustomer();
  if (!customer) {
    const login = new URL("/account/login", request.url);
    login.searchParams.set("next", `/account/invoices/${id}`);
    return NextResponse.redirect(login);
  }
  const invoice = /^[0-9a-f-]{36}$/i.test(id) ? await getInvoiceForPdf(id) : null;
  if (!invoice || (invoice.customer_id !== customer.id && !isAdmin(customer))) {
    return new NextResponse("Invoice not found", { status: 404 });
  }
  const pdf = await invoicePdf(invoice, invoice);
  return new NextResponse(Buffer.from(pdf.content), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${request.nextUrl.searchParams.has("view") ? "inline" : "attachment"}; filename="${pdf.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

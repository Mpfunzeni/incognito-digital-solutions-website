import { beforeAll, describe, expect, it, vi } from "vitest";
import { query } from "@/lib/hosting/db";
import {
  addCycle,
  cancelInvoice,
  createCustomer,
  buildInvoiceEmail,
  createRenewalInvoices,
  emailInvoice,
  getInvoiceForPdf,
  invoicePdf,
  findCustomerByEmail,
  listInvoices,
  listServices,
  markInvoicePaid,
  placeOrder,
} from "@/lib/hosting/store";

const run = Date.now();

// Runs against PGlite (in-process Postgres), the same SQL as production.
beforeAll(async () => {
  vi.spyOn(console, "info").mockImplementation(() => {});
  await query("SELECT 1"); // starting PGlite takes a few seconds
}, 60_000);

async function newCustomer(email: string) {
  const c = await createCustomer({ email, passwordHash: "x", fullName: "Test Customer", phone: "", company: "" });
  if (!c) throw new Error("customer not created");
  return c;
}

describe("billing dates", () => {
  it("adds months without overflowing short months", () => {
    expect(addCycle(new Date("2026-01-31"), "monthly").toISOString().slice(0, 10)).toBe("2026-02-28");
    expect(addCycle(new Date("2026-10-25"), "monthly").toISOString().slice(0, 10)).toBe("2026-11-25");
    expect(addCycle(new Date("2026-10-25"), "annually").toISOString().slice(0, 10)).toBe("2027-10-25");
  });
});

describe("hosting store", () => {
  it("rejects duplicate emails, case-insensitively", async () => {
    await newCustomer(`dup${run}@example.com`);
    expect(await createCustomer({ email: `DUP${run}@example.com`, passwordHash: "x", fullName: "B", phone: "", company: "" })).toBeNull();
    expect((await findCustomerByEmail(`Dup${run}@Example.com`))?.email).toBe(`dup${run}@example.com`);
  });

  it("places an order, takes payment once and starts set-up", async () => {
    const c = await newCustomer(`order${run}@example.com`);
    const invoice = await placeOrder(c, { planId: "business", cycle: "annually", domainAction: "register", domain: "orderbiz.co.za" });
    expect(invoice.status).toBe("unpaid");
    expect(invoice.total_cents).toBe(214000);
    expect(Array.isArray(invoice.lines)).toBe(true);
    expect(invoice.lines.map((l) => l.amount)).toEqual([1990, 150]);
    expect(Number(invoice.number)).toBeGreaterThanOrEqual(1001);
    expect((await listServices(c.id))[0].status).toBe("pending");

    expect(await markInvoicePaid(invoice.id, "payfast", "PF1")).toBe(true);
    expect(await markInvoicePaid(invoice.id, "payfast", "PF1")).toBe(false);

    const [service] = await listServices(c.id);
    expect(service.status).toBe("provisioning");
    const due = new Date(service.next_due_date as string);
    expect(due.getUTCFullYear()).toBe(new Date().getUTCFullYear() + 1);
    const [inv] = await listInvoices(c.id);
    expect(inv.status).toBe("paid");
    expect(inv.payment_reference).toBe("PF1");
  });

  it("builds and sends an itemised invoice email", async () => {
    const c = await newCustomer(`mail${run}@example.com`);
    const invoice = await placeOrder(c, { planId: "starter", cycle: "monthly", domainAction: "register", domain: "mail<b>biz.co.za".replace("<b>", "") });
    const mail = buildInvoiceEmail(invoice, { ...c, company: "A & B <Ltd>" }, "Thanks.");
    expect(mail.subject).toContain(`INV-${invoice.number}`);
    expect(mail.text).toContain("Total due: R 249.00");
    expect(mail.text).toContain(`/account/invoices/${invoice.id}`);
    expect(mail.html).toContain("A &amp; B &lt;Ltd&gt;");
    expect(await emailInvoice(invoice.id)).toBe(true);
    expect(await emailInvoice("missing")).toBe(false);
  });

  it("builds a one-page invoice PDF, even with characters the PDF font lacks", async () => {
    const { PDFDocument } = await import("pdf-lib");
    const c = await newCustomer(`pdf${run}@example.com`);
    const invoice = await placeOrder(c, { planId: "pro", cycle: "annually", domainAction: "transfer", domain: "pdfbiz.com" });
    const row = await getInvoiceForPdf(invoice.id);
    expect(row?.email).toBe(`pdf${run}@example.com`);
    const pdf = await invoicePdf(row!, { ...row!, full_name: "Ŋozi Dlamini 😀", company: "Ndlovu & Sons (Pty) Ltd" });
    expect(pdf.filename).toBe(`Invoice-INV-${invoice.number}.pdf`);
    expect(Buffer.from(pdf.content.slice(0, 5)).toString()).toBe("%PDF-");
    expect((await PDFDocument.load(pdf.content)).getPageCount()).toBe(1);
  });

  it("cancelling an unpaid new order cancels the service", async () => {
    const c = await newCustomer(`cancel${run}@example.com`);
    const invoice = await placeOrder(c, { planId: "starter", cycle: "monthly", domainAction: "existing", domain: "cancelme.com" });
    expect(await cancelInvoice(invoice.id)).toBe(true);
    expect(await listServices(c.id)).toHaveLength(0);
  });

  it("creates one renewal invoice for services due soon and extends from the due date when paid", async () => {
    const c = await newCustomer(`renew${run}@example.com`);
    const first = await placeOrder(c, { planId: "starter", cycle: "monthly", domainAction: "existing", domain: "renewme.com" });
    await markInvoicePaid(first.id, "eft", "ref");
    const [service] = await listServices(c.id);
    await query("UPDATE services SET status = 'active', next_due_date = current_date + 5 WHERE id = $1", [service.id]);

    expect(await createRenewalInvoices()).toBeGreaterThanOrEqual(1);
    const before = (await listInvoices(c.id)).filter((i) => i.kind === "renewal");
    expect(before).toHaveLength(1);
    expect(before[0].total_cents).toBe(9900);
    await createRenewalInvoices();
    expect((await listInvoices(c.id)).filter((i) => i.kind === "renewal")).toHaveLength(1);

    const oldDue = new Date((await listServices(c.id))[0].next_due_date as string);
    await markInvoicePaid(before[0].id, "eft", "ref2");
    const newDue = new Date((await listServices(c.id))[0].next_due_date as string);
    expect(newDue.toISOString().slice(0, 10)).toBe(addCycle(oldDue, "monthly").toISOString().slice(0, 10));
    expect((await listServices(c.id))[0].status).toBe("active");
  });
});

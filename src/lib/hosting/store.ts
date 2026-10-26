import "server-only";
import { randomUUID } from "node:crypto";
import { eftDetails, getPlan, priceOrder, type BillingCycle, type DomainAction } from "@/content/hosting";
import { site } from "@/content/site";
import { query, queryOne } from "./db";
import { adminEmail, appUrl, sendMail } from "./mailer";
import { createHostingAccount, provisioningMode } from "./provisioning";
import type { Customer, Invoice, Service, ServiceStatus } from "./types";

/** Business logic for customers, hosting services and invoices. */

export function invoiceNumber(n: string | number) {
  return `INV-${n}`;
}

export function toDate(value: string | Date | null) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

/** Adds one billing period to a date (UTC, date-only). */
export function addCycle(from: Date, cycle: BillingCycle) {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  if (cycle === "annually") d.setUTCFullYear(d.getUTCFullYear() + 1);
  else {
    const day = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + 1);
    const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(day, lastDay));
  }
  return d;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// --- Invoice emails ---------------------------------------------------------------

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const rand = (n: number) => `R ${n.toFixed(2)}`;

/** An itemised invoice email with a pay-online link and EFT details. */
export function buildInvoiceEmail(invoice: Invoice, customer: Pick<Customer, "full_name" | "company" | "email">, intro: string) {
  const number = invoiceNumber(invoice.number);
  const link = appUrl(`/account/invoices/${invoice.id}`);
  const total = invoice.total_cents / 100;
  const due = isoDate(toDate(invoice.due_date) ?? new Date());
  const eft = eftDetails.accountNumber
    ? [
        ["Bank", eftDetails.bank],
        ["Account name", eftDetails.accountName],
        ["Account number", eftDetails.accountNumber],
        ["Branch code", eftDetails.branchCode],
        ["Reference", number],
      ]
    : null;

  const text = [
    `Hi ${customer.full_name},`,
    "",
    intro,
    "",
    `Invoice ${number}  ·  Due ${due}`,
    ...invoice.lines.map((l) => `${l.description}: ${rand(l.amount)}`),
    `Total due: ${rand(total)}`,
    "",
    `Pay online (card or Instant EFT) or view your invoice: ${link}`,
    ...(eft ? ["", "Or pay by EFT:", ...eft.map(([k, v]) => `${k}: ${v}`)] : []),
    "",
    `${site.name}`,
    `${site.contact.phoneDisplay} · ${site.contact.email}`,
  ].join("\n");

  const cell = "padding:8px 0;border-bottom:1px solid #e3e9ef";
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0f1f2e;max-width:560px;margin:0 auto">
<h2 style="margin:0 0 4px">${escapeHtml(site.name)}</h2>
<p>Hi ${escapeHtml(customer.full_name)},</p>
<p>${escapeHtml(intro)}</p>
<p style="margin:24px 0 8px"><strong>Invoice ${number}</strong> &middot; Due ${due}${customer.company ? `<br>Billed to ${escapeHtml(customer.company)}` : ""}</p>
<table style="width:100%;border-collapse:collapse;font-size:15px">${invoice.lines
    .map((l) => `<tr><td style="${cell}">${escapeHtml(l.description)}</td><td style="${cell};text-align:right;white-space:nowrap">${rand(l.amount)}</td></tr>`)
    .join("")}<tr><td style="padding:12px 0"><strong>Total due</strong></td><td style="padding:12px 0;text-align:right;font-size:18px"><strong>${rand(total)}</strong></td></tr></table>
<p style="margin:24px 0"><a href="${link}" style="background:#1eddd6;color:#0b1622;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">View and pay invoice</a></p>
${eft ? `<p style="font-size:14px"><strong>Or pay by EFT</strong><br>${eft.map(([k, v]) => `${k}: ${escapeHtml(v)}`).join("<br>")}</p>` : ""}
<p style="font-size:13px;color:#4a5b6b">${escapeHtml(site.name)} · ${site.contact.phoneDisplay} · ${site.contact.email}</p>
</div>`;

  const subject = `${invoice.kind === "renewal" ? "Renewal invoice" : "Invoice"} ${number} from ${site.name}`;
  return { subject, text, html };
}

/** Emails an invoice to its customer (used on order, renewal and from the admin area). */
export async function emailInvoice(invoiceId: string, intro = "Here is your invoice.") {
  const row = await queryOne<Invoice & { email: string; full_name: string; company: string }>(
    "SELECT i.*, c.email, c.full_name, c.company FROM invoices i JOIN customers c ON c.id = i.customer_id WHERE i.id = $1",
    [invoiceId],
  );
  if (!row) return false;
  return sendMail({ to: row.email, ...buildInvoiceEmail(row, row, intro) });
}

// --- Customers ---------------------------------------------------------------

export async function findCustomerByEmail(email: string) {
  return queryOne<Customer>("SELECT * FROM customers WHERE email = $1", [email.toLowerCase()]);
}

export async function createCustomer(input: { email: string; passwordHash: string; fullName: string; phone: string; company: string }) {
  const id = randomUUID();
  const rows = await query<Customer>(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, company)
     VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING RETURNING *`,
    [id, input.email.toLowerCase(), input.passwordHash, input.fullName, input.phone, input.company],
  );
  return rows[0] ?? null;
}

export async function updateProfile(
  customerId: string,
  p: {
    fullName: string;
    phone: string;
    company: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    province: string;
    postalCode: string;
    vatNumber: string;
    marketingOptIn: boolean;
  },
) {
  await query(
    `UPDATE customers SET full_name = $2, phone = $3, company = $4, address_line1 = $5, address_line2 = $6,
       city = $7, province = $8, postal_code = $9, vat_number = $10, marketing_opt_in = $11, updated_at = now()
     WHERE id = $1`,
    [customerId, p.fullName, p.phone, p.company, p.addressLine1, p.addressLine2, p.city, p.province, p.postalCode, p.vatNumber, p.marketingOptIn],
  );
}

export async function setPasswordHash(customerId: string, passwordHash: string) {
  await query("UPDATE customers SET password_hash = $2, updated_at = now() WHERE id = $1", [customerId, passwordHash]);
}

// --- Orders --------------------------------------------------------------------

/**
 * Places an order: creates a pending hosting service and its first invoice.
 * Prices always come from src/content/hosting.ts, never from the browser.
 */
export async function placeOrder(
  customer: Customer,
  input: { planId: string; cycle: BillingCycle; domainAction: DomainAction; domain: string },
) {
  const { plan, lines, total } = priceOrder(input);
  const serviceId = randomUUID();
  const invoiceId = randomUUID();
  await query(
    `INSERT INTO services (id, customer_id, plan_id, billing_cycle, domain, domain_action, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
    [serviceId, customer.id, plan.id, input.cycle, input.domain, input.domainAction],
  );
  const invoice = await queryOne<Invoice>(
    `INSERT INTO invoices (id, customer_id, service_id, kind, lines, total_cents, status, due_date)
     VALUES ($1, $2, $3, 'new', $4::text::jsonb, $5, 'unpaid', $6) RETURNING *`,
    [invoiceId, customer.id, serviceId, JSON.stringify(lines), Math.round(total * 100), isoDate(new Date())],
  );
  if (!invoice) throw new Error("Could not create invoice");

  await sendMail({
    to: customer.email,
    ...buildInvoiceEmail(
      invoice,
      customer,
      `Thank you for your order: ${plan.name} hosting for ${input.domain}. We set up your hosting as soon as payment is received.`,
    ),
  });
  await sendMail({
    to: adminEmail(),
    subject: `New hosting order ${invoiceNumber(invoice.number)}: ${plan.name} for ${input.domain}`,
    text: `Customer: ${customer.full_name} <${customer.email}> ${customer.phone}\nPlan: ${plan.name} (${input.cycle})\nDomain: ${input.domain} (${input.domainAction})\nTotal: R${total.toFixed(2)}\nAdmin: ${appUrl("/account/admin")}`,
  });
  return invoice;
}

// --- Reads -----------------------------------------------------------------------

export async function listServices(customerId: string) {
  return query<Service>("SELECT * FROM services WHERE customer_id = $1 AND status <> 'cancelled' ORDER BY created_at DESC", [customerId]);
}

export async function getService(customerId: string, id: string) {
  return queryOne<Service>("SELECT * FROM services WHERE id = $1 AND customer_id = $2", [id, customerId]);
}

export async function listInvoices(customerId: string) {
  return query<Invoice>("SELECT * FROM invoices WHERE customer_id = $1 ORDER BY created_at DESC", [customerId]);
}

export async function getInvoice(customerId: string, id: string) {
  return queryOne<Invoice>("SELECT * FROM invoices WHERE id = $1 AND customer_id = $2", [id, customerId]);
}

export async function getInvoiceById(id: string) {
  return queryOne<Invoice>("SELECT * FROM invoices WHERE id = $1", [id]);
}

// --- Payments and provisioning ----------------------------------------------------

/**
 * Marks an invoice paid and moves the service on. Safe to call twice: only
 * the first call for an unpaid invoice has any effect.
 */
export async function markInvoicePaid(invoiceId: string, method: string, reference: string) {
  const invoice = await queryOne<Invoice>(
    `UPDATE invoices SET status = 'paid', paid_at = now(), payment_method = $2, payment_reference = $3
     WHERE id = $1 AND status = 'unpaid' RETURNING *`,
    [invoiceId, method, reference],
  );
  if (!invoice) return false;
  const service = await queryOne<Service>("SELECT * FROM services WHERE id = $1", [invoice.service_id]);
  const customer = await queryOne<Customer>("SELECT * FROM customers WHERE id = $1", [invoice.customer_id]);
  if (!service || !customer) return true;

  const currentDue = toDate(service.next_due_date);
  const base = invoice.kind === "renewal" && currentDue ? currentDue : new Date();
  await query("UPDATE services SET next_due_date = $2, updated_at = now() WHERE id = $1", [
    service.id,
    isoDate(addCycle(base, service.billing_cycle)),
  ]);

  await sendMail({
    to: customer.email,
    subject: `Payment received for ${invoiceNumber(invoice.number)}`,
    text: `Hi ${customer.full_name},\n\nWe have received your payment of R${(invoice.total_cents / 100).toFixed(2)} for ${invoiceNumber(invoice.number)}. Thank you.\n\n${
      invoice.kind === "new" ? "We are setting up your hosting now and will let you know when it is ready.\n\n" : ""
    }Your account: ${appUrl("/account")}\n\n${site.name}`,
  });

  if (invoice.kind === "new" && service.status === "pending") await provision(service, customer);
  return true;
}

async function provision(service: Service, customer: Customer) {
  await setServiceStatus(service.id, "provisioning");
  const plan = getPlan(service.plan_id);
  const adminNote = `Customer: ${customer.full_name} <${customer.email}>\nPlan: ${plan?.name ?? service.plan_id} (${service.billing_cycle})\nDomain: ${service.domain} (${service.domain_action})\nAdmin: ${appUrl("/account/admin")}`;

  if (provisioningMode() !== "whm" || !plan) {
    await sendMail({
      to: adminEmail(),
      subject: `Set up hosting for ${service.domain} (paid)`,
      text: `A hosting order has been paid and needs to be set up manually.\n\n${adminNote}\n\nWhen the cPanel account exists, mark the service active in the admin area.`,
    });
    return;
  }
  try {
    const { username } = await createHostingAccount({ domain: service.domain, whmPackage: plan.whmPackage, contactEmail: customer.email });
    await query("UPDATE services SET status = 'active', username = $2, server_note = '', updated_at = now() WHERE id = $1", [service.id, username]);
    await sendMail({
      to: customer.email,
      subject: `Your hosting for ${service.domain} is ready`,
      text: `Hi ${customer.full_name},\n\nYour ${plan.name} hosting for ${service.domain} is ready. Open cPanel from your account dashboard: ${appUrl("/account")}\n\n${
        service.domain_action === "existing"
          ? "Point your domain's nameservers to ours to make it live. The details are in your dashboard.\n\n"
          : "We are registering or transferring your domain and will confirm once it is active.\n\n"
      }${site.name}`,
    });
    if (service.domain_action !== "existing") {
      await sendMail({ to: adminEmail(), subject: `Domain ${service.domain_action} needed: ${service.domain}`, text: adminNote });
    }
  } catch (err) {
    console.error("[hosting] provisioning failed", err);
    await query("UPDATE services SET server_note = $2, updated_at = now() WHERE id = $1", [service.id, String(err).slice(0, 500)]);
    await sendMail({ to: adminEmail(), subject: `Automatic set-up failed for ${service.domain}`, text: `${String(err)}\n\n${adminNote}` });
  }
}

export async function setServiceStatus(serviceId: string, status: ServiceStatus, username?: string) {
  if (username !== undefined) {
    await query("UPDATE services SET status = $2, username = $3, updated_at = now() WHERE id = $1", [serviceId, status, username]);
  } else {
    await query("UPDATE services SET status = $2, updated_at = now() WHERE id = $1", [serviceId, status]);
  }
}

export async function cancelInvoice(invoiceId: string) {
  const inv = await queryOne<Invoice>("UPDATE invoices SET status = 'cancelled' WHERE id = $1 AND status = 'unpaid' RETURNING *", [invoiceId]);
  if (inv?.kind === "new") {
    await query("UPDATE services SET status = 'cancelled', updated_at = now() WHERE id = $1 AND status = 'pending'", [inv.service_id]);
  }
  return Boolean(inv);
}

// --- Renewals --------------------------------------------------------------------

/**
 * Creates renewal invoices for active services due within `daysAhead` days
 * that do not already have an unpaid invoice. Run daily (see vercel.json).
 */
export async function createRenewalInvoices(daysAhead = 14) {
  const due = await query<Service & { email: string; full_name: string }>(
    `SELECT s.*, c.email, c.full_name FROM services s JOIN customers c ON c.id = s.customer_id
     WHERE s.status IN ('active', 'suspended') AND s.next_due_date IS NOT NULL
       AND s.next_due_date <= (current_date + $1::int)
       AND NOT EXISTS (SELECT 1 FROM invoices i WHERE i.service_id = s.id AND i.status = 'unpaid')`,
    [daysAhead],
  );
  let created = 0;
  for (const s of due) {
    const plan = getPlan(s.plan_id);
    if (!plan) continue;
    const amount = s.billing_cycle === "annually" ? plan.annually : plan.monthly;
    const dueDate = toDate(s.next_due_date)!;
    const lines = [{ description: `${plan.name} hosting renewal: ${s.domain} (${s.billing_cycle === "annually" ? "12 months" : "1 month"})`, amount }];
    const inv = await queryOne<Invoice>(
      `INSERT INTO invoices (id, customer_id, service_id, kind, lines, total_cents, status, due_date)
       VALUES ($1, $2, $3, 'renewal', $4::text::jsonb, $5, 'unpaid', $6) RETURNING *`,
      [randomUUID(), s.customer_id, s.id, JSON.stringify(lines), amount * 100, isoDate(dueDate)],
    );
    if (!inv) continue;
    created++;
    await sendMail({
      to: s.email,
      ...buildInvoiceEmail(inv, { full_name: s.full_name, company: "", email: s.email }, `Your ${plan.name} hosting for ${s.domain} renews on ${isoDate(dueDate)}.`),
    });
  }
  return created;
}

// --- Admin -----------------------------------------------------------------------

export async function adminOverview() {
  const [customers, services, invoices] = await Promise.all([
    query<Customer & { service_count: number }>(
      `SELECT c.*, (SELECT count(*)::int FROM services s WHERE s.customer_id = c.id AND s.status <> 'cancelled') AS service_count
       FROM customers c ORDER BY c.created_at DESC LIMIT 200`,
    ),
    query<Service & { email: string; full_name: string }>(
      `SELECT s.*, c.email, c.full_name FROM services s JOIN customers c ON c.id = s.customer_id
       ORDER BY CASE s.status WHEN 'provisioning' THEN 0 WHEN 'pending' THEN 1 ELSE 2 END, s.created_at DESC LIMIT 200`,
    ),
    query<Invoice & { email: string; full_name: string }>(
      `SELECT i.*, c.email, c.full_name FROM invoices i JOIN customers c ON c.id = i.customer_id
       ORDER BY CASE i.status WHEN 'unpaid' THEN 0 ELSE 1 END, i.created_at DESC LIMIT 200`,
    ),
  ]);
  return { customers, services, invoices };
}

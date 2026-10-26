import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import { eftDetails } from "@/content/hosting";
import { site } from "@/content/site";
import { replyToAddress } from "./mailer";
import type { Customer, Invoice } from "./types";

/**
 * Builds an A4 PDF of an invoice: attached to invoice emails and downloadable
 * from the client area. Uses the built-in Helvetica fonts, so it needs no font
 * files and runs anywhere Node does.
 */

export type InvoicePdfCustomer = Pick<
  Customer,
  "full_name" | "company" | "email" | "address_line1" | "address_line2" | "city" | "province" | "postal_code" | "vat_number"
>;

const NAVY = rgb(26 / 255, 52 / 255, 74 / 255);
const TEAL = rgb(30 / 255, 221 / 255, 214 / 255);
const MUTED = rgb(74 / 255, 91 / 255, 107 / 255);
const LINE = rgb(227 / 255, 233 / 255, 239 / 255);
const GREEN = rgb(22 / 255, 128 / 255, 61 / 255);

let logo: Promise<Uint8Array | null> | null = null;
function logoBytes() {
  logo ??= readFile(path.join(process.cwd(), "public/brand/invoice-logo.png")).catch(() => null);
  return logo;
}

function isoDate(value: string | Date | null) {
  if (!value) return "";
  return (value instanceof Date ? value : new Date(value)).toISOString().slice(0, 10);
}

const money = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/ /g, " ")}`;

/** Standard PDF fonts only cover Western European characters; replace the rest. */
function safe(font: PDFFont, text: string) {
  let out = "";
  for (const ch of text.normalize("NFC").replace(/[  ]/g, " ")) {
    try {
      font.encodeText(ch);
      out += ch;
    } catch {
      const plain = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
      out += plain && plain !== ch ? safe(font, plain) : "?";
    }
  }
  return out;
}

function wrap(font: PDFFont, text: string, size: number, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= width || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildInvoicePdf(invoice: Invoice, customer: InvoicePdfCustomer, options: { payUrl?: string } = {}) {
  const doc = await PDFDocument.create();
  const number = `INV-${invoice.number}`;
  doc.setTitle(`Invoice ${number}`);
  doc.setAuthor(site.name);
  doc.setCreator(site.name);

  const page: PDFPage = doc.addPage([595.28, 841.89]);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const left = 50;
  const right = width - 50;
  // The address customers can actually reach (info@ needs a mail host first).
  const contactEmail = replyToAddress();

  const text = (value: string, x: number, y: number, opts: { size?: number; font?: PDFFont; color?: typeof NAVY; align?: "left" | "right" | "center" } = {}) => {
    const font = opts.font ?? regular;
    const size = opts.size ?? 10;
    const s = safe(font, value);
    const w = font.widthOfTextAtSize(s, size);
    const drawX = opts.align === "right" ? x - w : opts.align === "center" ? x - w / 2 : x;
    page.drawText(s, { x: drawX, y, size, font, color: opts.color ?? NAVY });
  };

  // Header: logo, business details, invoice title.
  page.drawRectangle({ x: 0, y: height - 8, width, height: 8, color: TEAL });
  let y = height - 50;
  const png = await logoBytes();
  if (png) {
    const img = await doc.embedPng(png);
    const h = 70;
    page.drawImage(img, { x: left, y: y - h + 10, width: (img.width / img.height) * h, height: h });
  } else {
    text(site.name, left, y - 10, { size: 16, font: bold });
  }
  text("INVOICE", right, y - 6, { size: 24, font: bold, align: "right" });
  text(number, right, y - 26, { size: 12, align: "right", color: MUTED });
  if (invoice.status === "paid") text("PAID", right, y - 48, { size: 14, font: bold, align: "right", color: GREEN });
  if (invoice.status === "cancelled") text("CANCELLED", right, y - 48, { size: 14, font: bold, align: "right", color: MUTED });

  y -= 100;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 1, color: LINE });

  // From / billed to / dates.
  y -= 22;
  const col2 = left + 190;
  const col3 = right - 150;
  text("FROM", left, y, { size: 8, font: bold, color: MUTED });
  text("BILLED TO", col2, y, { size: 8, font: bold, color: MUTED });
  text("DETAILS", col3, y, { size: 8, font: bold, color: MUTED });
  const from = [site.name, site.contact.phoneDisplay, contactEmail];
  const billed = [
    customer.company || customer.full_name,
    customer.company ? customer.full_name : "",
    customer.address_line1,
    customer.address_line2,
    [customer.city, customer.postal_code].filter(Boolean).join(" "),
    customer.province,
    customer.email,
    customer.vat_number ? `VAT ${customer.vat_number}` : "",
  ].filter(Boolean);
  const details: [string, string][] = [
    ["Issued", isoDate(invoice.created_at)],
    ["Due", isoDate(invoice.due_date)],
    ...(invoice.paid_at ? ([["Paid", isoDate(invoice.paid_at)]] as [string, string][]) : []),
  ];
  let fy = y - 16;
  from.forEach((l, i) => {
    text(l, left, fy, { font: i === 0 ? bold : regular, size: i === 0 ? 10.5 : 9.5 });
    fy -= 14;
  });
  let by = y - 16;
  billed.forEach((l, i) => {
    for (const w of wrap(regular, safe(regular, l), 9.5, col3 - col2 - 15)) {
      text(w, col2, by, { font: i === 0 ? bold : regular, size: i === 0 ? 10.5 : 9.5 });
      by -= 14;
    }
  });
  let dy = y - 16;
  for (const [k, v] of details) {
    text(k, col3, dy, { size: 9.5, color: MUTED });
    text(v, right, dy, { size: 9.5, align: "right" });
    dy -= 14;
  }
  y = Math.min(fy, by, dy) - 20;

  // Line items.
  page.drawRectangle({ x: left, y: y - 6, width: right - left, height: 22, color: NAVY });
  text("Description", left + 10, y, { size: 9.5, font: bold, color: rgb(1, 1, 1) });
  text("Amount", right - 10, y, { size: 9.5, font: bold, color: rgb(1, 1, 1), align: "right" });
  y -= 28;
  for (const line of invoice.lines) {
    const rows = wrap(regular, safe(regular, line.description), 10, right - left - 130);
    rows.forEach((r, i) => {
      text(r, left + 10, y - i * 13, { size: 10 });
    });
    text(money(line.amount), right - 10, y, { size: 10, align: "right" });
    y -= rows.length * 13 + 8;
    page.drawLine({ start: { x: left, y: y + 2 }, end: { x: right, y: y + 2 }, thickness: 0.75, color: LINE });
    y -= 12;
  }
  y -= 4;
  text(invoice.status === "paid" ? "Total paid" : "Total due", right - 130, y, { size: 12, font: bold, align: "right" });
  text(money(invoice.total_cents / 100), right - 10, y, { size: 14, font: bold, align: "right" });
  y -= 16;
  text("All amounts in South African Rand (ZAR).", right - 10, y, { size: 8, color: MUTED, align: "right" });

  // How to pay.
  if (invoice.status === "unpaid") {
    y -= 36;
    text("HOW TO PAY", left, y, { size: 8, font: bold, color: MUTED });
    y -= 16;
    if (options.payUrl) {
      text("Pay online (card or Instant EFT):", left, y, { size: 9.5 });
      y -= 13;
      for (const w of wrap(regular, options.payUrl, 9, right - left)) {
        text(w, left, y, { size: 9, color: rgb(0.05, 0.45, 0.5) });
        y -= 12;
      }
      y -= 8;
    }
    if (eftDetails.accountNumber) {
      const eft: [string, string][] = [
        ["Bank", eftDetails.bank],
        ["Account name", eftDetails.accountName],
        ["Account number", eftDetails.accountNumber],
        ["Branch code", eftDetails.branchCode],
        ["Reference", number],
      ];
      text("Or pay by EFT:", left, y, { size: 9.5 });
      y -= 14;
      for (const [k, v] of eft) {
        text(k, left, y, { size: 9.5, color: MUTED });
        text(v, left + 100, y, { size: 9.5, font: k === "Reference" ? bold : regular });
        y -= 13;
      }
    }
  } else if (invoice.payment_method) {
    y -= 30;
    const via = invoice.payment_method === "payfast" ? "PayFast" : "EFT";
    text(`Paid by ${via}${invoice.payment_reference ? ` (reference ${invoice.payment_reference})` : ""}. Thank you.`, left, y, { size: 9.5 });
  }

  // Footer.
  page.drawLine({ start: { x: left, y: 60 }, end: { x: right, y: 60 }, thickness: 0.75, color: LINE });
  text(`${site.name}  ·  ${site.contact.phoneDisplay}  ·  ${contactEmail}`, width / 2, 44, { size: 8, color: MUTED, align: "center" });

  return doc.save();
}

export function invoicePdfFilename(invoice: Pick<Invoice, "number">) {
  return `Invoice-INV-${invoice.number}.pdf`;
}

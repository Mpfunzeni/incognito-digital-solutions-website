import type { BillingCycle, DomainAction, OrderLine } from "@/content/hosting";

export type Customer = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  company: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  province: string;
  postal_code: string;
  vat_number: string;
  marketing_opt_in: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

export type ServiceStatus = "pending" | "provisioning" | "active" | "suspended" | "cancelled";

export type Service = {
  id: string;
  customer_id: string;
  plan_id: string;
  billing_cycle: BillingCycle;
  domain: string;
  domain_action: DomainAction;
  status: ServiceStatus;
  username: string;
  server_note: string;
  next_due_date: string | Date | null;
  created_at: string | Date;
};

export type InvoiceStatus = "unpaid" | "paid" | "cancelled";

export type Invoice = {
  id: string;
  number: string | number;
  customer_id: string;
  service_id: string;
  kind: "new" | "renewal";
  lines: OrderLine[];
  total_cents: number;
  status: InvoiceStatus;
  due_date: string | Date;
  paid_at: string | Date | null;
  payment_method: string;
  payment_reference: string;
  created_at: string | Date;
};

export const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
] as const;

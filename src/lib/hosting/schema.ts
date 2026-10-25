/**
 * Database schema. Applied automatically (idempotently) on first connection,
 * so a fresh Postgres database needs no manual migration. Money is stored in
 * cents.
 */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS customers (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  company text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address_line1 text NOT NULL DEFAULT '',
  address_line2 text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  province text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  vat_number text NOT NULL DEFAULT '',
  marketing_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  customer_id text NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_customer_idx ON sessions(customer_id);

CREATE TABLE IF NOT EXISTS password_resets (
  token_hash text PRIMARY KEY,
  customer_id text NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz
);

CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  customer_id text NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  plan_id text NOT NULL,
  billing_cycle text NOT NULL,
  domain text NOT NULL,
  domain_action text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  username text NOT NULL DEFAULT '',
  server_note text NOT NULL DEFAULT '',
  next_due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS services_customer_idx ON services(customer_id);

CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1001;

CREATE TABLE IF NOT EXISTS invoices (
  id text PRIMARY KEY,
  number bigint NOT NULL UNIQUE DEFAULT nextval('invoice_number_seq'),
  customer_id text NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_id text NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'new',
  lines jsonb NOT NULL,
  total_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'unpaid',
  due_date date NOT NULL,
  paid_at timestamptz,
  payment_method text NOT NULL DEFAULT '',
  payment_reference text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS invoices_customer_idx ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS invoices_service_idx ON invoices(service_id);
`;

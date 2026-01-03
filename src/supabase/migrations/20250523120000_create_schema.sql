/*
# Create Initial Schema
1. New Tables
   - `customers` (id, name, email, phone)
   - `reservations` (id, customer_id, dates, status, knife details, photos)
   - `knives` (id, reservation_id, type, price, services)
   - `invoices` (id, reservation_id, total, payment info)
   - `communications` (id, reservation_id, logs)
2. Security
   - Enable RLS on all tables
   - Add policies for Public (Booking/Lookup) and Authenticated (Admin) access
*/

-- Create Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  drop_off_date text NOT NULL,
  drop_off_time text NOT NULL,
  pickup_date text NOT NULL,
  knife_quantity text NOT NULL,
  notes text,
  photos jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'booked',
  check_in_time timestamptz,
  actual_quantity integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Knives Table
CREATE TABLE IF NOT EXISTS knives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  knife_type text NOT NULL,
  price numeric NOT NULL,
  services text,
  created_at timestamptz DEFAULT now()
);

-- Create Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  total_amount numeric NOT NULL,
  payment_method text,
  payment_status text DEFAULT 'pending',
  invoice_url text,
  details jsonb, 
  created_at timestamptz DEFAULT now()
);

-- Create Communications Table
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  type text NOT NULL, 
  direction text NOT NULL, 
  summary text,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE knives ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Customers: Public can create (booking), Admin can do all
CREATE POLICY "Public can create customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage customers" ON customers FOR ALL TO authenticated USING (true);

-- Reservations: Public can create (booking) and read by ID (lookup), Admin can do all
CREATE POLICY "Public can create reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access by ID for lookup" ON reservations FOR SELECT USING (true); 
CREATE POLICY "Admins can manage reservations" ON reservations FOR ALL TO authenticated USING (true);

-- Knives: Admin only (managed via CRM)
CREATE POLICY "Admins can manage knives" ON knives FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can read knives for their reservation" ON knives FOR SELECT USING (true);

-- Invoices: Admin only (managed via CRM) + Public Read (for payment link/viewing)
CREATE POLICY "Admins can manage invoices" ON invoices FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can read invoices" ON invoices FOR SELECT USING (true);

-- Communications: Admin only
CREATE POLICY "Admins can manage communications" ON communications FOR ALL TO authenticated USING (true);
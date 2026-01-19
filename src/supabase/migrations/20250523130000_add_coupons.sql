/*
# Add Coupons Table
1. New Tables
   - `coupons`
     - `id` (uuid, primary key)
     - `code` (text, unique)
     - `discount_type` (text: 'percentage' or 'fixed')
     - `discount_value` (numeric)
     - `active` (boolean)
     - `created_at` (timestamp)
2. Security
   - Enable RLS on `coupons` table
   - Add policy for Public to read (validate) coupons
   - Add policy for Admins to manage coupons
*/

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check if a coupon is valid
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);

-- Allow authenticated admins to do everything
CREATE POLICY "Admins manage coupons" ON coupons FOR ALL TO authenticated USING (true);
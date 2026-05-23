-- Seed Data for Golden Hedge Demo

-- Create organization
INSERT INTO public.organizations (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Golden Hedge Demo')
ON CONFLICT DO NOTHING;

-- Since auth.users is managed by Supabase Auth, we can't seed users_profile with auth_ids easily here
-- unless we also insert into auth.users. 
-- In a real environment, users sign up via auth. For the seed script, we will insert placeholder profiles
-- by inserting into auth.users first if possible, but in Supabase `auth.users` is protected.
-- Instead, we will skip creating actual user logins here, or just create dummy users if allowed.
-- NOTE: In Supabase, inserting into auth.users from public schema is blocked by default. 
-- We will just seed roles, permissions, and basic reference data. 
-- We will create a backend service function later to create the demo user if needed, or use the UI.

-- Insert Roles
INSERT INTO public.roles (name, description) VALUES
('super_admin', 'System Administrator'),
('admin', 'Organization Administrator'),
('dealer', 'Trading Dealer'),
('broker', 'Broker User'),
('compliance_officer', 'Compliance Officer'),
('inventory_manager', 'Inventory Manager'),
('finance_manager', 'Finance Manager'),
('cashier_pos', 'POS Cashier'),
('viewer', 'Read-only Viewer')
ON CONFLICT (name) DO NOTHING;

-- Insert Metals
INSERT INTO public.metals (id, name, symbol) VALUES
('XAU', 'Gold', 'Au'),
('XAG', 'Silver', 'Ag')
ON CONFLICT (id) DO NOTHING;

-- Insert Purity Grades
INSERT INTO public.purity_grades (id, metal_id, purity, name) VALUES
('XAU_9999', 'XAU', 0.9999, '999.9'),
('XAU_995', 'XAU', 0.9950, '995'),
('XAU_916', 'XAU', 0.9160, '916'),
('XAU_875', 'XAU', 0.8750, '875'),
('XAU_750', 'XAU', 0.7500, '750'),
('XAG_999', 'XAG', 0.9990, '999')
ON CONFLICT (id) DO NOTHING;

-- Insert Product Categories
INSERT INTO public.product_categories (id, name) VALUES
('00000000-0000-0000-0000-000000000010', 'Kilobars'),
('00000000-0000-0000-0000-000000000011', 'TT Bars'),
('00000000-0000-0000-0000-000000000012', 'Cast Bars'),
('00000000-0000-0000-0000-000000000013', 'Coins')
ON CONFLICT DO NOTHING;

-- Insert Products
INSERT INTO public.products (category_id, metal_id, purity_grade_id, name, weight_grams) VALUES
('00000000-0000-0000-0000-000000000010', 'XAU', 'XAU_9999', 'Gold Kilobar 999.9', 1000),
('00000000-0000-0000-0000-000000000011', 'XAU', 'XAU_9999', 'Gold Ten Tola 999.9', 116.64),
('00000000-0000-0000-0000-000000000010', 'XAG', 'XAG_999', 'Silver Kilobar 999', 1000)
ON CONFLICT DO NOTHING;

-- Insert Vault
INSERT INTO public.vaults (id, organization_id, name, location) VALUES
('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', 'Main Vault', 'Dubai Gold Souq')
ON CONFLICT DO NOTHING;

INSERT INTO public.vault_locations (id, vault_id, name, description) VALUES
('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000020', 'Safe 1 - Gold', 'Primary gold storage'),
('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000020', 'Safe 2 - Silver', 'Primary silver storage')
ON CONFLICT DO NOTHING;

-- Insert Supplier
INSERT INTO public.suppliers (id, organization_id, name, contact_info) VALUES
('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000001', 'Global Bullion Refineries', 'contact@gbr.example.com')
ON CONFLICT DO NOTHING;

-- Insert Sample Broker
INSERT INTO public.brokers (id, organization_id, name, registration_number, country, status) VALUES
('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000001', 'Desert Gold Trading LLC', 'TRN-123456', 'UAE', 'clear')
ON CONFLICT DO NOTHING;

INSERT INTO public.broker_limits (broker_id, max_open_exposure_usd, max_quote_size_oz, requires_prefunding) VALUES
('00000000-0000-0000-0000-000000000040', 500000, 100, true)
ON CONFLICT DO NOTHING;

-- Insert Price Snapshot (Demo)
INSERT INTO public.price_snapshots (id, metal_id, price_per_gram) VALUES
('00000000-0000-0000-0000-000000000050', 'XAU', 85.50),
('00000000-0000-0000-0000-000000000051', 'XAG', 1.20)
ON CONFLICT DO NOTHING;

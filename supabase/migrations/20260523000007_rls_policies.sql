-- RLS Policies

-- Helper function to check if current user is staff and get their organization
CREATE OR REPLACE FUNCTION public.user_organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM public.users_profile WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_role()
RETURNS user_role_enum AS $$
    SELECT role FROM public.users_profile WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_broker_id()
RETURNS UUID AS $$
    SELECT broker_id FROM public.broker_users WHERE user_profile_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 1. Organizations: Staff can read their own org
CREATE POLICY "Staff read own organization" ON organizations
    FOR SELECT TO authenticated USING (id = public.user_organization_id());

-- 2. Users Profile: Users can read their own profile, Staff can read all profiles in their org
CREATE POLICY "Users read own profile" ON users_profile
    FOR SELECT TO authenticated USING (id = auth.uid() OR organization_id = public.user_organization_id());
CREATE POLICY "Super admin manage profiles" ON users_profile
    FOR ALL TO authenticated USING (public.user_role() IN ('super_admin', 'admin') AND organization_id = public.user_organization_id());

-- 3. Audit Logs: Read-only for admin/super_admin, Insert via triggers only (bypasses RLS)
CREATE POLICY "Admins read audit logs" ON audit_logs
    FOR SELECT TO authenticated USING (public.user_role() IN ('super_admin', 'admin') AND organization_id = public.user_organization_id());

-- 4. Brokers: Broker users read own broker, Staff read all brokers in org
CREATE POLICY "Broker users read own broker" ON brokers
    FOR SELECT TO authenticated USING (id = public.user_broker_id());
CREATE POLICY "Staff read brokers" ON brokers
    FOR SELECT TO authenticated USING (organization_id = public.user_organization_id());
CREATE POLICY "Admins manage brokers" ON brokers
    FOR ALL TO authenticated USING (public.user_role() IN ('super_admin', 'admin', 'compliance_officer') AND organization_id = public.user_organization_id());

-- 5. Inventory: Read all for staff, mutation only for inventory_manager, admin, super_admin
CREATE POLICY "Staff read inventory lots" ON inventory_lots
    FOR SELECT TO authenticated USING (organization_id = public.user_organization_id());
CREATE POLICY "Inventory staff manage lots" ON inventory_lots
    FOR ALL TO authenticated USING (public.user_role() IN ('super_admin', 'admin', 'inventory_manager') AND organization_id = public.user_organization_id());

CREATE POLICY "Staff read inventory bars" ON inventory_bars
    FOR SELECT TO authenticated USING (
        lot_id IN (SELECT id FROM inventory_lots WHERE organization_id = public.user_organization_id())
    );
CREATE POLICY "Inventory staff manage bars" ON inventory_bars
    FOR ALL TO authenticated USING (
        public.user_role() IN ('super_admin', 'admin', 'inventory_manager')
    );

-- 6. Quotes: Broker reads own, Staff read all
CREATE POLICY "Broker users read own quotes" ON quotes
    FOR SELECT TO authenticated USING (broker_id = public.user_broker_id());
CREATE POLICY "Broker users insert quotes" ON quotes
    FOR INSERT TO authenticated WITH CHECK (broker_id = public.user_broker_id());
CREATE POLICY "Staff read quotes" ON quotes
    FOR SELECT TO authenticated USING (organization_id = public.user_organization_id());
CREATE POLICY "Dealer manage quotes" ON quotes
    FOR UPDATE TO authenticated USING (public.user_role() IN ('super_admin', 'dealer') AND organization_id = public.user_organization_id());

-- 7. Orders: Broker reads own, Staff read all
CREATE POLICY "Broker users read own orders" ON orders
    FOR SELECT TO authenticated USING (broker_id = public.user_broker_id());
CREATE POLICY "Staff read orders" ON orders
    FOR SELECT TO authenticated USING (organization_id = public.user_organization_id());

-- 8. Trades: Broker reads own, Staff read all
CREATE POLICY "Broker users read own trades" ON trades
    FOR SELECT TO authenticated USING (broker_id = public.user_broker_id());
CREATE POLICY "Staff read trades" ON trades
    FOR SELECT TO authenticated USING (organization_id = public.user_organization_id());

-- 9. Finance (Invoices/Payments): Broker reads own, Finance/Admin read/manage all
CREATE POLICY "Broker users read own invoices" ON invoices
    FOR SELECT TO authenticated USING (broker_id = public.user_broker_id());
CREATE POLICY "Finance manage invoices" ON invoices
    FOR ALL TO authenticated USING (public.user_role() IN ('super_admin', 'admin', 'finance_manager') AND organization_id = public.user_organization_id());

CREATE POLICY "Broker users read own payments" ON payments
    FOR SELECT TO authenticated USING (broker_id = public.user_broker_id());
CREATE POLICY "Finance manage payments" ON payments
    FOR ALL TO authenticated USING (public.user_role() IN ('super_admin', 'admin', 'finance_manager') AND organization_id = public.user_organization_id());

-- 10. POS Sales: Cashiers create and read
CREATE POLICY "Staff read pos sales" ON pos_sales
    FOR SELECT TO authenticated USING (organization_id = public.user_organization_id());
CREATE POLICY "Cashier manage pos sales" ON pos_sales
    FOR ALL TO authenticated USING (public.user_role() IN ('super_admin', 'admin', 'cashier_pos') AND organization_id = public.user_organization_id());

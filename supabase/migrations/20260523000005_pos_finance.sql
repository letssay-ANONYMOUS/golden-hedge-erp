-- POS System and Finance

CREATE TABLE pos_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    cashier_id UUID REFERENCES users_profile(id),
    location_id UUID REFERENCES vault_locations(id),
    opened_at TIMESTAMPTZ DEFAULT now(),
    closed_at TIMESTAMPTZ,
    opening_cash NUMERIC(18, 4) DEFAULT 0,
    closing_cash NUMERIC(18, 4),
    expected_cash NUMERIC(18, 4),
    actual_cash NUMERIC(18, 4),
    variance NUMERIC(18, 4),
    session_notes TEXT,
    status TEXT DEFAULT 'open' -- 'open', 'closed', 'reconciled'
);

CREATE TABLE pos_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES pos_sessions(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id), -- Optional, for B2B POS
    customer_name TEXT, -- For retail placeholder
    status TEXT DEFAULT 'completed', -- 'completed', 'returned', 'voided'
    total_amount NUMERIC(18, 4) NOT NULL,
    discount NUMERIC(18, 4) DEFAULT 0,
    tax_amount NUMERIC(18, 4) DEFAULT 0,
    net_amount NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    created_by UUID REFERENCES users_profile(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pos_sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES pos_sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    inventory_bar_id UUID REFERENCES inventory_bars(id), -- If selling a specific bar
    custom_weight NUMERIC(18, 4), -- For custom weight sales
    metal_id TEXT REFERENCES metals(id),
    purity_grade_id TEXT REFERENCES purity_grades(id),
    price_per_gram NUMERIC(18, 4) NOT NULL,
    making_charge NUMERIC(18, 4) DEFAULT 0,
    total_price NUMERIC(18, 4) NOT NULL
);

CREATE TABLE pos_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES pos_sales(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL, -- 'cash', 'card', 'bank_transfer', 'mixed'
    amount NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    reference_number TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pos_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES pos_sales(id) ON DELETE CASCADE,
    receipt_number TEXT UNIQUE NOT NULL,
    document_id UUID REFERENCES document_files(id),
    generated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pos_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_sale_id UUID REFERENCES pos_sales(id),
    session_id UUID REFERENCES pos_sessions(id),
    return_amount NUMERIC(18, 4) NOT NULL,
    reason TEXT,
    approved_by UUID REFERENCES users_profile(id),
    created_at TIMESTAMPTZ DEFAULT now()
);


-- Finance / Settlement
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id),
    trade_id UUID REFERENCES trades(id),
    invoice_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'unpaid', -- 'unpaid', 'partial', 'paid', 'cancelled'
    total_amount NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    due_date DATE,
    document_id UUID REFERENCES document_files(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(18, 4) NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id),
    invoice_id UUID REFERENCES invoices(id),
    amount NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL,
    reference_number TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'rejected'
    confirmed_by UUID REFERENCES users_profile(id),
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Every payment confirmation must have finance user id and timestamp
CREATE OR REPLACE FUNCTION check_payment_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' THEN
        IF NEW.confirmed_by IS NULL OR NEW.confirmed_at IS NULL THEN
            RAISE EXCEPTION 'Payment confirmation must include confirmed_by and confirmed_at';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_payment_confirmation
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION check_payment_confirmation();

CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id),
    total_amount NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

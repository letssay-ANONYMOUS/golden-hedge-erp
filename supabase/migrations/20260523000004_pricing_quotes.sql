-- Pricing, Quotes, Orders, Trades

CREATE TABLE live_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metal_id TEXT REFERENCES metals(id),
    price_per_gram NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE price_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metal_id TEXT REFERENCES metals(id),
    price_per_gram NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    snapshot_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id),
    broker_user_id UUID REFERENCES users_profile(id),
    status quote_status DEFAULT 'draft',
    price_snapshot_id UUID REFERENCES price_snapshots(id),
    metal_id TEXT REFERENCES metals(id),
    purity_grade_id TEXT REFERENCES purity_grades(id),
    weight_grams NUMERIC(18, 4) NOT NULL,
    base_metal_value NUMERIC(18, 4),
    spread_applied NUMERIC(18, 4),
    premium_applied NUMERIC(18, 4),
    making_charge NUMERIC(18, 4),
    fee_applied NUMERIC(18, 4),
    tax_placeholder NUMERIC(18, 4),
    total_price NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    validity_seconds INTEGER DEFAULT 60,
    expiry_timestamp TIMESTAMPTZ,
    created_by UUID REFERENCES users_profile(id),
    approved_by UUID REFERENCES users_profile(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quote must become expired automatically after expiry timestamp.
-- We can enforce this via a frontend/backend check, or a database view.
-- Accepted quote must not be editable. We will enforce this via trigger.

CREATE OR REPLACE FUNCTION protect_accepted_quote()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'accepted' THEN
        RAISE EXCEPTION 'Cannot edit an accepted quote';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_accepted_quote_edit
BEFORE UPDATE ON quotes
FOR EACH ROW EXECUTE FUNCTION protect_accepted_quote();


CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id),
    quote_id UUID REFERENCES quotes(id),
    status order_status DEFAULT 'draft',
    total_amount NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    created_by UUID REFERENCES users_profile(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id),
    order_id UUID REFERENCES orders(id),
    status trade_status DEFAULT 'created',
    metal_id TEXT REFERENCES metals(id),
    weight_grams NUMERIC(18, 4) NOT NULL,
    total_price NUMERIC(18, 4) NOT NULL,
    currency TEXT DEFAULT 'USD',
    execution_time TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES users_profile(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE trade_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- e.g., 'status_change', 'payment_confirmed', 'inventory_allocated'
    old_status trade_status,
    new_status trade_status,
    user_id UUID REFERENCES users_profile(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Completed trade must not be editable
CREATE OR REPLACE FUNCTION protect_completed_trade()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'completed' THEN
        RAISE EXCEPTION 'Cannot edit a completed trade, only correction events are allowed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_completed_trade_edit
BEFORE UPDATE ON trades
FOR EACH ROW EXECUTE FUNCTION protect_completed_trade();

-- Every trade must have audit log events (handled by the global audit trigger, but we can also use trade_events)
CREATE TRIGGER log_trade_audit
AFTER INSERT OR UPDATE ON trades
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER log_quote_audit
AFTER INSERT OR UPDATE ON quotes
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER log_order_audit
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Broker management
CREATE TABLE brokers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name TEXT NOT NULL,
    registration_number TEXT,
    country TEXT,
    status compliance_status DEFAULT 'pending_review',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE broker_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
    user_profile_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (broker_id, user_profile_id)
);

CREATE TABLE broker_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE UNIQUE,
    max_open_exposure_usd NUMERIC(18, 4) DEFAULT 0,
    max_quote_size_oz NUMERIC(18, 4) DEFAULT 0,
    requires_prefunding BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE broker_commission_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
    metal_id TEXT, -- e.g., 'XAU', 'XAG'
    markup_per_oz NUMERIC(18, 4) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE broker_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
    document_id UUID REFERENCES document_files(id),
    document_type TEXT NOT NULL, -- e.g., 'trade_license', 'passport'
    expiry_date DATE,
    status compliance_status DEFAULT 'pending_review',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE broker_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
    old_status compliance_status,
    new_status compliance_status NOT NULL,
    changed_by UUID REFERENCES users_profile(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE broker_risk_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE UNIQUE,
    risk_level TEXT DEFAULT 'low', -- 'low', 'medium', 'high'
    last_review_date TIMESTAMPTZ,
    next_review_date TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users_profile(id),
    notes TEXT
);

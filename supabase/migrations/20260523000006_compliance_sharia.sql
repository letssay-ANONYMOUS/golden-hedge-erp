-- Compliance and Sharia Placeholders

CREATE TABLE aml_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id),
    entity_type TEXT NOT NULL, -- e.g., 'trade', 'payment', 'broker'
    entity_id UUID,
    rule_triggered TEXT NOT NULL,
    severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    status TEXT DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'false_positive'
    assigned_to UUID REFERENCES users_profile(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE compliance_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id),
    case_type TEXT NOT NULL, -- 'KYC', 'KYB', 'AML_INVESTIGATION'
    status TEXT DEFAULT 'open', -- 'open', 'pending_info', 'closed'
    assigned_to UUID REFERENCES users_profile(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE compliance_case_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES compliance_cases(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users_profile(id),
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE compliance_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    entity_type TEXT NOT NULL, -- 'trade', 'order', 'broker', 'payment'
    entity_id UUID NOT NULL,
    reason TEXT NOT NULL,
    placed_by UUID REFERENCES users_profile(id),
    placed_at TIMESTAMPTZ DEFAULT now(),
    released_by UUID REFERENCES users_profile(id),
    released_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active' -- 'active', 'released'
);

CREATE TABLE goaml_report_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    report_type TEXT NOT NULL, -- 'STR', 'SAR'
    subject_broker_id UUID REFERENCES brokers(id),
    suspicion_reason TEXT,
    narrative TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'reviewed', 'submitted'
    submitted_manually BOOLEAN DEFAULT false,
    submitted_date TIMESTAMPTZ,
    submitted_by UUID REFERENCES users_profile(id),
    reference_number TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sharia_trade_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
    physical_inventory_exists BOOLEAN DEFAULT false,
    price_snapshot_valid BOOLEAN DEFAULT false,
    payment_confirmed BOOLEAN DEFAULT false,
    custody_evidence_generated BOOLEAN DEFAULT false,
    no_margin_flag BOOLEAN DEFAULT true,
    no_derivative_flag BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'pending_review', -- 'passed', 'failed', 'pending_review', 'not_applicable'
    reviewed_by UUID REFERENCES users_profile(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE qabd_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
    document_id UUID REFERENCES document_files(id),
    evidence_type TEXT NOT NULL, -- 'custody_cert', 'delivery_receipt'
    verified_by UUID REFERENCES users_profile(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE frozen_parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    broker_id UUID REFERENCES brokers(id),
    reason TEXT NOT NULL,
    frozen_by UUID REFERENCES users_profile(id),
    frozen_at TIMESTAMPTZ DEFAULT now(),
    unfrozen_by UUID REFERENCES users_profile(id),
    unfrozen_at TIMESTAMPTZ,
    status TEXT DEFAULT 'frozen' -- 'frozen', 'unfrozen'
);

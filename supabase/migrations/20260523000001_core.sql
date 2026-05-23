-- Core schema
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Note: In Supabase, the users table is managed by auth.users. 
-- We will use a public profile table linked to auth.users.
CREATE TABLE users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role user_role_enum NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name user_role_enum UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_profile(id),
    organization_id UUID REFERENCES organizations(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    setting_key TEXT NOT NULL,
    setting_value JSONB,
    updated_by UUID REFERENCES users_profile(id),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (organization_id, setting_key)
);

CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    requested_action TEXT NOT NULL,
    requested_by UUID REFERENCES users_profile(id),
    required_role user_role_enum NOT NULL,
    status approval_status DEFAULT 'pending',
    approved_by UUID REFERENCES users_profile(id),
    rejected_by UUID REFERENCES users_profile(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE document_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    bucket_name TEXT NOT NULL,
    uploaded_by UUID REFERENCES users_profile(id),
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log trigger function
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (user_id, organization_id, action, entity_type, entity_id, details)
    VALUES (
        current_setting('request.jwt.claim.sub', true)::uuid,
        current_setting('request.jwt.claim.user_metadata', true)::jsonb->>'organization_id',
        TG_OP,
        TG_TABLE_NAME,
        NEW.id::text,
        row_to_json(NEW)::jsonb
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

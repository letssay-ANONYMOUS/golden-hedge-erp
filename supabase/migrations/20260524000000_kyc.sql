-- Add KYC fields to users_profile

-- Ensure we have an enum for KYC status if not already defined (or just use TEXT for simplicity, let's use TEXT for flexibility with third party providers)
ALTER TABLE users_profile 
ADD COLUMN kyc_status TEXT DEFAULT 'pending',
ADD COLUMN kyc_applicant_id TEXT,
ADD COLUMN kyc_verified_at TIMESTAMPTZ;

-- Create an edge function configuration or secret placeholder
-- We don't need table schema for edge functions, but we can store webhook logs if we want
CREATE TABLE kyc_webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id TEXT,
    event_type TEXT,
    payload JSONB,
    processed_at TIMESTAMPTZ DEFAULT now()
);

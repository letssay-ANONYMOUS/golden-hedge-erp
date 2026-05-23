-- Create custom enum types for various statuses across the platform

CREATE TYPE quote_status AS ENUM (
    'draft',
    'requested',
    'priced',
    'pending_dealer_approval',
    'sent_to_broker',
    'accepted',
    'expired',
    'rejected',
    'cancelled'
);

CREATE TYPE order_status AS ENUM (
    'draft',
    'pending_quote',
    'pending_approval',
    'pending_payment',
    'payment_confirmed',
    'pending_inventory_allocation',
    'completed',
    'cancelled',
    'rejected',
    'disputed'
);

CREATE TYPE trade_status AS ENUM (
    'created',
    'inventory_reserved',
    'payment_pending',
    'payment_confirmed',
    'inventory_allocated',
    'custody_issued',
    'completed',
    'reversed',
    'cancelled'
);

CREATE TYPE inventory_status AS ENUM (
    'available',
    'reserved',
    'allocated',
    'delivered',
    'damaged',
    'frozen',
    'under_review'
);

CREATE TYPE compliance_status AS ENUM (
    'clear',
    'pending_review',
    'enhanced_due_diligence',
    'held',
    'rejected',
    'frozen'
);

CREATE TYPE user_role_enum AS ENUM (
    'super_admin',
    'admin',
    'dealer',
    'broker',
    'compliance_officer',
    'inventory_manager',
    'finance_manager',
    'cashier_pos',
    'viewer'
);

CREATE TYPE movement_type AS ENUM (
    'received',
    'transferred',
    'reserved',
    'released',
    'allocated',
    'delivered',
    'adjusted',
    'frozen',
    'unfrozen',
    'returned'
);

CREATE TYPE approval_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);

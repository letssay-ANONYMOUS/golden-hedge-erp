-- Inventory / Vaults / Metals
CREATE TABLE metals (
    id TEXT PRIMARY KEY, -- e.g., 'XAU', 'XAG'
    name TEXT NOT NULL,
    symbol TEXT NOT NULL
);

CREATE TABLE purity_grades (
    id TEXT PRIMARY KEY,
    metal_id TEXT REFERENCES metals(id),
    purity NUMERIC(5, 4) NOT NULL, -- e.g., 0.9999
    name TEXT NOT NULL -- e.g., '999.9', '916'
);

CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES product_categories(id),
    metal_id TEXT REFERENCES metals(id),
    purity_grade_id TEXT REFERENCES purity_grades(id),
    name TEXT NOT NULL,
    weight_grams NUMERIC(18, 4),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE vaults (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name TEXT NOT NULL,
    location TEXT
);

CREATE TABLE vault_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'Shelf A', 'Safe 1'
    description TEXT
);

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name TEXT NOT NULL,
    contact_info TEXT
);

CREATE TABLE inventory_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    supplier_id UUID REFERENCES suppliers(id),
    metal_id TEXT REFERENCES metals(id),
    purity_grade_id TEXT REFERENCES purity_grades(id),
    gross_weight_grams NUMERIC(18, 4) NOT NULL,
    net_weight_grams NUMERIC(18, 4) NOT NULL,
    received_date DATE NOT NULL,
    vault_location_id UUID REFERENCES vault_locations(id),
    assay_certificate_id UUID REFERENCES document_files(id),
    status inventory_status DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inventory_bars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_id UUID REFERENCES inventory_lots(id) ON DELETE CASCADE,
    bar_serial_number TEXT,
    metal_id TEXT REFERENCES metals(id),
    purity_grade_id TEXT REFERENCES purity_grades(id),
    weight_grams NUMERIC(18, 4) NOT NULL,
    status inventory_status DEFAULT 'available',
    vault_location_id UUID REFERENCES vault_locations(id),
    ownership_broker_id UUID REFERENCES brokers(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Constraint: inventory_bars.bar_serial_number must be unique when present
CREATE UNIQUE INDEX unique_bar_serial_when_present ON inventory_bars(bar_serial_number) WHERE bar_serial_number IS NOT NULL;

CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    inventory_type TEXT NOT NULL, -- 'lot' or 'bar'
    lot_id UUID REFERENCES inventory_lots(id),
    bar_id UUID REFERENCES inventory_bars(id),
    movement_type movement_type NOT NULL,
    quantity NUMERIC(18, 4), -- count for bars, grams for lots
    source_location_id UUID REFERENCES vault_locations(id),
    destination_location_id UUID REFERENCES vault_locations(id),
    reference_entity_type TEXT, -- e.g., 'trade', 'order'
    reference_entity_id UUID,
    moved_by UUID REFERENCES users_profile(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inventory_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    inventory_type TEXT NOT NULL,
    lot_id UUID REFERENCES inventory_lots(id),
    bar_id UUID REFERENCES inventory_bars(id),
    quantity NUMERIC(18, 4),
    reference_entity_type TEXT,
    reference_entity_id UUID,
    reserved_by UUID REFERENCES users_profile(id),
    status TEXT DEFAULT 'active', -- 'active', 'released', 'consumed'
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ownership_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID REFERENCES brokers(id),
    inventory_type TEXT NOT NULL,
    lot_id UUID REFERENCES inventory_lots(id),
    bar_id UUID REFERENCES inventory_bars(id),
    quantity NUMERIC(18, 4),
    trade_id UUID,
    allocated_by UUID REFERENCES users_profile(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE custody_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID REFERENCES brokers(id),
    document_id UUID REFERENCES document_files(id),
    issued_date DATE NOT NULL,
    created_by UUID REFERENCES users_profile(id)
);

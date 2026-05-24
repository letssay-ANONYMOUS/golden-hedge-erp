-- Migration: Hedging Engine Schema

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Hedge Order Status Enum
CREATE TYPE hedge_order_status AS ENUM ('pending', 'partial_fill', 'filled', 'failed', 'cancelled');
CREATE TYPE hedge_direction AS ENUM ('short', 'long');

-- Hedge Orders Table
CREATE TABLE public.hedge_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metal_id TEXT NOT NULL REFERENCES public.metals(id),
  direction hedge_direction NOT NULL,
  quantity_grams NUMERIC(15,4) NOT NULL,
  quantity_oz NUMERIC(15,4) NOT NULL,
  trigger_price_usd NUMERIC(15,2) NOT NULL,
  executed_price_usd NUMERIC(15,2),
  slippage_pct NUMERIC(5,4),
  status hedge_order_status NOT NULL DEFAULT 'pending',
  broker_order_id TEXT,
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hedge Config Table (for the dynamic threshold triggers)
CREATE TABLE public.hedge_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metal_id TEXT NOT NULL REFERENCES public.metals(id) UNIQUE,
  auto_hedge_enabled BOOLEAN NOT NULL DEFAULT false,
  exposure_threshold_grams NUMERIC(15,4) NOT NULL,
  hedge_increment_grams NUMERIC(15,4) NOT NULL,
  max_slippage_pct NUMERIC(5,4) NOT NULL DEFAULT 0.005, -- 0.5%
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default configs (250g Gold, 5000g Silver thresholds as per PRD)
INSERT INTO public.hedge_config (metal_id, auto_hedge_enabled, exposure_threshold_grams, hedge_increment_grams)
VALUES 
  ('XAU', true, 250.0000, 250.0000),
  ('XAG', true, 5000.0000, 5000.0000);

-- Trigger for updated_at
CREATE TRIGGER set_timestamp_hedge_orders
BEFORE UPDATE ON public.hedge_orders
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_hedge_config
BEFORE UPDATE ON public.hedge_config
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE public.hedge_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hedge_config ENABLE ROW LEVEL SECURITY;

-- Admins/Treasury can do everything. Everyone else can't.
CREATE POLICY "Treasury can manage hedge_orders" ON public.hedge_orders
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users_profile WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

CREATE POLICY "Treasury can manage hedge_config" ON public.hedge_config
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users_profile WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- Expose a View for Net Exposure (Total Inventory - Total Short Hedges)
-- Inventory = sum of available/reserved bars + active POS sell invoices (reducing inventory) + POS buy invoices (increasing inventory). 
-- For simplicity in this demo, we'll calculate physical inventory via an aggregated view of inventory_bars.
CREATE OR REPLACE VIEW public.net_exposure AS
WITH physical AS (
  SELECT 
    metal_id,
    SUM(weight_grams) as physical_held_grams
  FROM public.inventory_bars
  WHERE status IN ('available', 'frozen')
  GROUP BY metal_id
),
hedges AS (
  SELECT
    metal_id,
    SUM(quantity_grams) as hedged_short_grams
  FROM public.hedge_orders
  WHERE status IN ('filled', 'partial_fill') AND direction = 'short'
  GROUP BY metal_id
)
SELECT 
  p.metal_id,
  COALESCE(p.physical_held_grams, 0) as physical_held_grams,
  COALESCE(h.hedged_short_grams, 0) as hedged_short_grams,
  COALESCE(p.physical_held_grams, 0) - COALESCE(h.hedged_short_grams, 0) as net_exposure_grams
FROM physical p
LEFT JOIN hedges h ON p.metal_id = h.metal_id;

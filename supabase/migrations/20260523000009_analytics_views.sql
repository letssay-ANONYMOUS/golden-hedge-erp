-- Analytics SQL Views

CREATE VIEW business_dashboard AS
SELECT 
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= date_trunc('day', now())) as sales_today,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= date_trunc('month', now())) as sales_this_month,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'pending') as pending_payment_amount;

CREATE VIEW inventory_dashboard AS
SELECT 
    metal_id,
    SUM(CASE WHEN status = 'available' THEN weight_grams ELSE 0 END) as total_available_grams,
    SUM(CASE WHEN status = 'reserved' THEN weight_grams ELSE 0 END) as total_reserved_grams,
    SUM(CASE WHEN status = 'allocated' THEN weight_grams ELSE 0 END) as total_allocated_grams
FROM inventory_bars
GROUP BY metal_id;

CREATE VIEW compliance_dashboard AS
SELECT
    (SELECT COUNT(*) FROM aml_alerts WHERE status = 'open') as open_aml_alerts,
    (SELECT COUNT(*) FROM compliance_cases WHERE status = 'open') as open_compliance_cases,
    (SELECT COUNT(*) FROM compliance_holds WHERE status = 'active') as active_holds;

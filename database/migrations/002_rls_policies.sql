-- =============================================================
-- FreshGuard AI — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql in Supabase SQL Editor.
--
-- These policies enable RLS and restrict direct browser access.
-- The backend uses the service-role key, which bypasses RLS.
-- =============================================================

-- Enable RLS on all tables exposed through the Supabase Data API.
-- With no permissive policies, direct browser access is denied.

ALTER TABLE stores                ENABLE ROW LEVEL SECURITY;
ALTER TABLE products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sales           ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory             ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE wastage_records       ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_issues       ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_approvals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_import_runs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_metrics         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_catalog_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE causal_relationships  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- READ-ONLY policies for authenticated users (when auth is set up).
-- Uncomment and adapt once Supabase Auth is configured.
-- ============================================================

-- CREATE POLICY "Authenticated users can read stores"
--     ON stores FOR SELECT
--     USING (auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can read products"
--     ON products FOR SELECT
--     USING (auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can read daily_sales"
--     ON daily_sales FOR SELECT
--     USING (auth.role() = 'authenticated');

-- For now, all write operations and sensitive reads go through
-- the backend using the service-role key, which bypasses RLS.

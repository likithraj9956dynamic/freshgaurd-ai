-- =============================================================
-- FreshGuard AI — Initial Schema Migration
-- Run this in Supabase SQL Editor or via psql.
-- This migration is additive — it does NOT drop existing tables.
-- =============================================================

-- A. stores
CREATE TABLE IF NOT EXISTS stores (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    location    TEXT,
    state       TEXT,
    country     TEXT DEFAULT 'US',
    store_format TEXT,
    status      TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','closed')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- B. products
CREATE TABLE IF NOT EXISTS products (
    id                  TEXT PRIMARY KEY,
    name                TEXT,
    category            TEXT,
    subcategory         TEXT,
    brand               TEXT,
    barcode             TEXT,
    unit_price          NUMERIC(12,2) CHECK (unit_price IS NULL OR unit_price >= 0),
    unit_cost           NUMERIC(12,2) CHECK (unit_cost IS NULL OR unit_cost >= 0),
    perishable          BOOLEAN DEFAULT FALSE,
    shelf_life_days     INTEGER CHECK (shelf_life_days IS NULL OR shelf_life_days >= 0),
    data_source         TEXT,
    external_product_id TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- C. daily_sales
CREATE TABLE IF NOT EXISTS daily_sales (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_id    TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sale_date   DATE NOT NULL,
    units_sold  INTEGER NOT NULL CHECK (units_sold >= 0),
    unit_price  NUMERIC(12,2) CHECK (unit_price IS NULL OR unit_price >= 0),
    revenue     NUMERIC(14,2) CHECK (revenue IS NULL OR revenue >= 0),
    data_source TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_daily_sales UNIQUE (store_id, product_id, sale_date)
);

-- D. inventory
CREATE TABLE IF NOT EXISTS inventory (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_id      TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id    TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    current_stock INTEGER NOT NULL CHECK (current_stock >= 0),
    reorder_level INTEGER NOT NULL CHECK (reorder_level >= 0),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    data_source   TEXT,
    CONSTRAINT uq_inventory UNIQUE (store_id, product_id)
);

-- E. purchase_orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    store_id          TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    supplier_name     TEXT NOT NULL,
    order_date        DATE NOT NULL,
    expected_delivery DATE,
    actual_delivery   DATE,
    status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','shipped','delivered','delayed','cancelled')),
    data_source       TEXT,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- F. purchase_order_items
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    purchase_order_id  TEXT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id         TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity_ordered   INTEGER NOT NULL CHECK (quantity_ordered >= 0),
    quantity_received  INTEGER CHECK (quantity_received IS NULL OR quantity_received >= 0)
);

-- G. wastage_records
CREATE TABLE IF NOT EXISTS wastage_records (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_id    TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    reason      TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    data_source TEXT
);

-- H. detected_issues
CREATE TABLE IF NOT EXISTS detected_issues (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    store_id    TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    issue_type  TEXT NOT NULL,
    severity    TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
    title       TEXT NOT NULL,
    description TEXT,
    evidence    JSONB DEFAULT '{}',
    confidence  NUMERIC(3,2) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
    status      TEXT DEFAULT 'open' CHECK (status IN ('open','investigating','resolved','dismissed')),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- I. actions
CREATE TABLE IF NOT EXISTS actions (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    issue_id         TEXT NOT NULL REFERENCES detected_issues(id) ON DELETE CASCADE,
    action_type      TEXT NOT NULL,
    proposal         JSONB DEFAULT '{}',
    estimated_impact JSONB DEFAULT '{}',
    status           TEXT DEFAULT 'proposed' CHECK (status IN (
        'proposed','pending_approval','approved','rejected',
        'executing','completed','failed','cancelled'
    )),
    created_by       TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    executed_at      TIMESTAMPTZ
);

-- J. action_approvals
CREATE TABLE IF NOT EXISTS action_approvals (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    action_id  TEXT NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
    decision   TEXT NOT NULL CHECK (decision IN ('approved','rejected')),
    approver   TEXT NOT NULL,
    reason     TEXT,
    decided_at TIMESTAMPTZ DEFAULT NOW()
);

-- K. store_tasks
CREATE TABLE IF NOT EXISTS store_tasks (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    store_id     TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    action_id    TEXT REFERENCES actions(id) ON DELETE SET NULL,
    title        TEXT NOT NULL,
    instructions TEXT,
    priority     TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
    status       TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
    assigned_to  TEXT,
    due_date     DATE,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- L. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    action_id  TEXT REFERENCES actions(id) ON DELETE SET NULL,
    actor      TEXT NOT NULL,
    event_type TEXT NOT NULL,
    details    JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- M. data_import_runs
CREATE TABLE IF NOT EXISTS data_import_runs (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dataset_name      TEXT NOT NULL,
    source            TEXT,
    started_at        TIMESTAMPTZ DEFAULT NOW(),
    completed_at      TIMESTAMPTZ,
    status            TEXT DEFAULT 'running' CHECK (status IN ('running','completed','failed')),
    records_read      INTEGER DEFAULT 0,
    records_inserted  INTEGER DEFAULT 0,
    records_updated   INTEGER DEFAULT 0,
    records_rejected  INTEGER DEFAULT 0,
    error_summary     TEXT
);

-- N. store_metrics
CREATE TABLE IF NOT EXISTS store_metrics (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_id      TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    metric_name   TEXT NOT NULL,
    metric_value  NUMERIC(16,4),
    metric_unit   TEXT,
    period_start  DATE,
    period_end    DATE,
    data_source   TEXT,
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- O. product_catalog_imports
CREATE TABLE IF NOT EXISTS product_catalog_imports (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id          TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    source              TEXT NOT NULL,
    external_product_id TEXT,
    imported_at         TIMESTAMPTZ DEFAULT NOW(),
    source_metadata     JSONB DEFAULT '{}'
);

-- P. causal_relationships (for the causal graph)
CREATE TABLE IF NOT EXISTS causal_relationships (
    id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    store_id            TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    source_issue_id     TEXT REFERENCES detected_issues(id) ON DELETE SET NULL,
    source_entity_type  TEXT NOT NULL,
    source_entity_id    TEXT NOT NULL,
    target_entity_type  TEXT NOT NULL,
    target_entity_id    TEXT NOT NULL,
    relationship_type   TEXT NOT NULL CHECK (relationship_type IN (
        'observed','contributes_to','potentially_causes','affects','mitigates'
    )),
    evidence            JSONB DEFAULT '{}',
    confidence          NUMERIC(3,2) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- INDEXES
-- =============================================================

-- Sales queries by store and date
CREATE INDEX IF NOT EXISTS idx_daily_sales_store_date ON daily_sales(store_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_daily_sales_product_date ON daily_sales(product_id, sale_date);

-- Inventory lookups
CREATE INDEX IF NOT EXISTS idx_inventory_store ON inventory(store_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);

-- Open issues
CREATE INDEX IF NOT EXISTS idx_detected_issues_store ON detected_issues(store_id);
CREATE INDEX IF NOT EXISTS idx_detected_issues_status ON detected_issues(status);

-- Pending actions
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_issue ON actions(issue_id);

-- Outstanding tasks
CREATE INDEX IF NOT EXISTS idx_store_tasks_store ON store_tasks(store_id);
CREATE INDEX IF NOT EXISTS idx_store_tasks_status ON store_tasks(status);

-- Purchase orders
CREATE INDEX IF NOT EXISTS idx_purchase_orders_store ON purchase_orders(store_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);

-- Audit log
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Store metrics
CREATE INDEX IF NOT EXISTS idx_store_metrics_store ON store_metrics(store_id);
CREATE INDEX IF NOT EXISTS idx_store_metrics_name ON store_metrics(metric_name);

-- Wastage
CREATE INDEX IF NOT EXISTS idx_wastage_store ON wastage_records(store_id);
CREATE INDEX IF NOT EXISTS idx_wastage_product ON wastage_records(product_id);

-- Causal relationships
CREATE INDEX IF NOT EXISTS idx_causal_store ON causal_relationships(store_id);
CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_relationships(source_entity_type, source_entity_id);

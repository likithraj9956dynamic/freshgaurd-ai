-- =============================================================
-- FreshGuard AI — Migration 003: Access Requests, Roles, & Audit
-- Safe, additive migration — does NOT drop existing tables or data.
-- Run in Supabase SQL Editor or via psql.
-- =============================================================

-- 1. Alter users table to support status, verification, phone, and role attributes
ALTER TABLE IF EXISTS users
    ADD COLUMN IF NOT EXISTS phone_number TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'APPROVED',
    ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS assigned_store_id TEXT,
    ADD COLUMN IF NOT EXISTS assigned_store_name TEXT,
    ADD COLUMN IF NOT EXISTS supplier_id TEXT,
    ADD COLUMN IF NOT EXISTS supplier_name TEXT;

-- 2. Access Requests table
CREATE TABLE IF NOT EXISTS access_requests (
    id                   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    applicant_id         TEXT REFERENCES users(id) ON DELETE SET NULL,
    requested_role       TEXT NOT NULL CHECK (requested_role IN ('main_manager', 'store_manager', 'supplier')),
    full_name            TEXT NOT NULL,
    email                TEXT NOT NULL,
    phone_number         TEXT NOT NULL,
    password_hash        TEXT NOT NULL,
    status               TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUIRED')),
    submission_date      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Store Manager details
    store_name           TEXT,
    store_type           TEXT,
    store_address        TEXT,
    city                 TEXT,
    state                TEXT,
    employee_id          TEXT,
    
    -- Supplier details
    supplier_name        TEXT,
    supplier_type        TEXT,
    products_supplied    TEXT,
    gstin                TEXT,
    
    -- Review info
    additional_info      TEXT,
    reviewed_by_id       TEXT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at          TIMESTAMPTZ,
    decision_reason      TEXT,
    manager_instructions TEXT,
    
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for access_requests
CREATE INDEX IF NOT EXISTS idx_access_requests_email ON access_requests(email);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_role ON access_requests(requested_role);
CREATE INDEX IF NOT EXISTS idx_access_requests_created ON access_requests(created_at);

-- 3. Approval decisions table
CREATE TABLE IF NOT EXISTS approval_decisions (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    request_id  TEXT NOT NULL REFERENCES access_requests(id) ON DELETE CASCADE,
    decider_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action      TEXT NOT NULL CHECK (action IN ('APPROVE', 'REJECT', 'REQUEST_MORE_INFO')),
    reason      TEXT,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_decisions_request ON approval_decisions(request_id);
CREATE INDEX IF NOT EXISTS idx_approval_decisions_decider ON approval_decisions(decider_id);

-- 4. Manager invitations table
CREATE TABLE IF NOT EXISTS manager_invitations (
    id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    email            TEXT UNIQUE NOT NULL,
    invitation_token TEXT UNIQUE NOT NULL,
    invited_by_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status           TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED')),
    expires_at       TIMESTAMPTZ NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manager_invitations_token ON manager_invitations(invitation_token);

-- 5. Email Logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    recipient_email TEXT NOT NULL,
    subject         TEXT NOT NULL,
    template_type   TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'SENT', 'FAILED', 'SIMULATED')),
    error_message   TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

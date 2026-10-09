# Database Migrations

## How to Apply

### Option 1: Supabase SQL Editor (Recommended for beginners)

1. Open your Supabase project at https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy-paste the contents of `migrations/001_initial_schema.sql` and click **Run**
5. Create another new query, paste `migrations/002_rls_policies.sql`, and click **Run**

### Option 2: psql

```bash
psql "postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres" \
  -f migrations/001_initial_schema.sql

psql "postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres" \
  -f migrations/002_rls_policies.sql
```

## Migration Files

| File | Purpose |
|------|---------|
| `001_initial_schema.sql` | Creates 16 tables with constraints, FKs, and indexes |
| `002_rls_policies.sql` | Enables Row Level Security on all tables |

## Verification

After running both migrations, verify in SQL Editor:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
```

Expected: 16 tables from `action_approvals` through `wastage_records`.

## Notes

- Migrations are **additive** — they use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`
- They will **not** drop or overwrite existing tables
- Safe to run multiple times (idempotent)
- No secrets or passwords are included in migration files

# FreshGuard AI — Database & Data Pipeline

AI-powered grocery-retail operations intelligence platform.

> **This README covers the database layer and data pipeline only.**
> Frontend, backend API, and AI features are documented separately.

---

## Data Source Transparency

| Source | Label | Description |
|--------|-------|-------------|
| M5 Forecasting Dataset | `m5_walmart_historical` | Real historical sales data from Kaggle |
| Open Food Facts | `open_food_facts` | Public product catalog enrichment |
| Demo Seeder | `simulated_demo` | Clearly labelled simulated operational data |

- **Real historical sales** come from the M5 dataset and are labelled `m5_walmart_historical`
- **Product catalog data** from Open Food Facts is labelled `open_food_facts`
- **Simulated operational data** (inventory, POs, wastage) is labelled `simulated_demo`
- **STORE_17** is a fictional demo store, not an actual retail location
- Calculated metrics are derived from stored data using transparent formulas
- AI-generated hypotheses (future feature) will be clearly distinguished from facts

---

## Project Structure

```
Market_manager/
├── database/
│   └── migrations/
│       ├── 001_initial_schema.sql    # 16 tables, FKs, constraints, indexes
│       └── 002_rls_policies.sql      # Row Level Security
├── data_pipeline/
│   ├── __init__.py
│   ├── __main__.py                   # CLI entry point
│   ├── db.py                         # Database connection utilities
│   ├── validate.py                   # M5 file validation
│   ├── transform.py                  # M5 wide→long transformation
│   ├── import_data.py                # CSV→Supabase import
│   ├── seed_demo.py                  # Demo data generation
│   ├── enrich.py                     # Open Food Facts enrichment
│   └── report.py                     # Import report generator
├── data/
│   ├── raw/                          # Place M5 CSVs here (git-ignored)
│   ├── processed/                    # Generated CSVs (git-ignored)
│   └── reports/                      # Import reports (git-ignored)
├── tests/
│   └── test_data_pipeline.py         # Comprehensive test suite
├── .env.example                      # Environment variable template
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Setup Instructions

### 1. Prerequisites

- Python 3.10+
- A Supabase project (free tier works)

### 2. Install Python Dependencies

```bash
cd Market_manager
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

| Variable | Where to find it |
|----------|-----------------|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role key |
| `SUPABASE_DB_HOST` | Supabase Dashboard → Settings → Database → Host |
| `SUPABASE_DB_PORT` | Usually `5432` (or `6543` for pooler) |
| `SUPABASE_DB_NAME` | `postgres` |
| `SUPABASE_DB_USER` | `postgres` |
| `SUPABASE_DB_PASSWORD` | The password you set when creating the project |

> ⚠️ **Security**: Never commit `.env` to Git. Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.

### 4. Apply Database Migrations

**Option A — Supabase SQL Editor (recommended for beginners):**

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `database/migrations/001_initial_schema.sql` and run it
5. Copy the contents of `database/migrations/002_rls_policies.sql` and run it
6. Verify tables in **Table Editor** — you should see 16 tables

**Option B — psql command line:**

```bash
psql "postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres" -f database/migrations/001_initial_schema.sql
psql "postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres" -f database/migrations/002_rls_policies.sql
```

### 5. Verify Schema

In Supabase SQL Editor, run:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
```

You should see all 16 tables listed.

---

## Data Pipeline Commands

### Seed Demo Data (no M5 dataset needed)

```bash
python -m data_pipeline seed-demo
```

This creates:
- **STORE_17** — a demo store (not a real location)
- 10 demo products with realistic names
- 30 days of simulated sales history
- Inventory records (5 products deliberately below reorder level)
- 2 purchase orders (1 delayed, 1 delivered)
- Wastage records for perishable products
- A detected issue for the low-stock scenario

All records are labelled `simulated_demo`.

### M5 Dataset Pipeline (requires Kaggle download)

**Step 1**: Download the M5 dataset from [Kaggle](https://www.kaggle.com/competitions/m5-forecasting-accuracy/data)

**Step 2**: Place these files in `data/raw/`:
- `sales_train_validation.csv`
- `calendar.csv`
- `sell_prices.csv`

**Step 3**: Validate:
```bash
python -m data_pipeline validate
```

**Step 4**: Transform (wide → long format):
```bash
python -m data_pipeline transform
```

Options:
```bash
python -m data_pipeline transform --stores CA_1,CA_2,CA_3 --products-per-store 50 --history-days 90
```

**Step 5**: Import into Supabase:
```bash
python -m data_pipeline import-csv
```

**Step 6**: (Optional) Enrich products via Open Food Facts:
```bash
python -m data_pipeline enrich
```
> Note: M5 products don't have barcodes, so enrichment only works for products where you've manually added a barcode.

### Generate Import Report

```bash
python -m data_pipeline report
```

---

## Running Tests

```bash
pytest tests/ -v
```

Tests use synthetic fixtures and do **not** require:
- A Supabase connection
- The M5 dataset
- Any API keys

---

## Database Tables

| Table | Purpose | Key Constraints |
|-------|---------|----------------|
| `stores` | Store information | PK: `id` |
| `products` | Product catalog | PK: `id`, nonneg prices |
| `daily_sales` | Historical sales | Unique on `(store_id, product_id, sale_date)` |
| `inventory` | Current stock levels | Unique on `(store_id, product_id)`, nonneg stock |
| `purchase_orders` | Supplier orders | FK to stores, status enum |
| `purchase_order_items` | PO line items | FK to POs and products |
| `wastage_records` | Product waste | Quantity > 0 |
| `detected_issues` | Operational issues | Severity/status enums, confidence 0–1 |
| `actions` | Corrective actions | 8-state status workflow |
| `action_approvals` | Human decisions | Only approved/rejected |
| `store_tasks` | Manager tasks | Priority/status enums |
| `audit_logs` | Event history | JSONB details |
| `data_import_runs` | Import tracking | Read/inserted/rejected counts |
| `store_metrics` | Calculated metrics | FK to stores |
| `product_catalog_imports` | Enrichment tracking | FK to products |
| `causal_relationships` | Evidence graph | Typed relationships |

---

## Security

- **Row Level Security** is enabled on all tables
- No unrestricted public policies are created
- All imports use the **service-role key** (server-side only)
- `.env` is git-ignored
- No secrets appear in migration files
- The frontend (when built) will use only the publishable/anon key

"""
FreshGuard AI — Tests for the Data Pipeline

These tests use small synthetic fixtures and do NOT require:
- A live Supabase connection
- The actual M5 dataset
- Any API keys
"""
import os
import sys
import tempfile
import json

import pytest
import pandas as pd

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# ============================================================
# Fixtures: small synthetic M5 data
# ============================================================

@pytest.fixture
def temp_data_dir(tmp_path):
    """Create a temp directory with small synthetic M5 files."""
    # calendar.csv — 10 days
    calendar_rows = []
    import datetime
    base_date = datetime.date(2016, 4, 25)
    for i in range(1, 11):
        d = base_date + datetime.timedelta(days=i - 1)
        calendar_rows.append({
            "date": d.isoformat(),
            "wm_yr_wk": 11501 + (i - 1) // 7,
            "weekday": d.strftime("%A"),
            "wday": d.isoweekday(),
            "month": d.month,
            "year": d.year,
            "d": f"d_{i}",
            "event_name_1": "",
            "event_type_1": "",
            "event_name_2": "",
            "event_type_2": "",
            "snap_CA": 1,
            "snap_TX": 0,
            "snap_WI": 0,
        })
    pd.DataFrame(calendar_rows).to_csv(tmp_path / "calendar.csv", index=False)

    # sell_prices.csv — 2 stores × 3 items × 2 weeks
    price_rows = []
    for store in ["CA_1", "CA_2"]:
        for item in ["FOODS_1_001", "FOODS_1_002", "HOUSEHOLD_1_001"]:
            for wk in [11501, 11502]:
                price_rows.append({
                    "store_id": store,
                    "item_id": item,
                    "wm_yr_wk": wk,
                    "sell_price": 3.99 if "FOODS" in item else 7.49,
                })
    pd.DataFrame(price_rows).to_csv(tmp_path / "sell_prices.csv", index=False)

    # sales_train_validation.csv — 2 stores × 3 items, 10 day columns
    sales_rows = []
    for store in ["CA_1", "CA_2"]:
        for item_idx, item in enumerate(["FOODS_1_001", "FOODS_1_002", "HOUSEHOLD_1_001"]):
            row = {
                "id": f"{item}_{store}_validation",
                "item_id": item,
                "dept_id": item.rsplit("_", 1)[0],
                "cat_id": item.split("_")[0],
                "store_id": store,
                "state_id": store.split("_")[0],
            }
            for d in range(1, 11):
                row[f"d_{d}"] = (item_idx + 1) * d  # Deterministic sales
            sales_rows.append(row)
    pd.DataFrame(sales_rows).to_csv(tmp_path / "sales_train_validation.csv", index=False)

    return str(tmp_path)


# ============================================================
# Test: Validation
# ============================================================

class TestValidation:
    def test_validate_success(self, temp_data_dir):
        from data_pipeline.validate import run_validate
        results = run_validate(temp_data_dir)
        for filename, info in results.items():
            assert info["exists"], f"{filename} should exist"
            assert info["columns_ok"], f"{filename} columns should be valid"

    def test_validate_missing_file(self, tmp_path):
        from data_pipeline.validate import run_validate
        with pytest.raises(SystemExit):
            run_validate(str(tmp_path))  # Empty dir

    def test_validate_missing_columns(self, tmp_path):
        # Create a calendar.csv missing required columns
        pd.DataFrame({"wrong_col": [1]}).to_csv(tmp_path / "calendar.csv", index=False)
        pd.DataFrame({"id": [1], "item_id": ["x"], "dept_id": ["y"], "cat_id": ["z"], "store_id": ["s"], "state_id": ["t"]}).to_csv(
            tmp_path / "sales_train_validation.csv", index=False)
        pd.DataFrame({"store_id": ["s"], "item_id": ["i"], "wm_yr_wk": [1], "sell_price": [1.0]}).to_csv(
            tmp_path / "sell_prices.csv", index=False)
        with pytest.raises(SystemExit):
            from data_pipeline.validate import run_validate
            run_validate(str(tmp_path))


# ============================================================
# Test: Transformation
# ============================================================

class TestTransformation:
    def test_transform_produces_csvs(self, temp_data_dir, tmp_path):
        output_dir = str(tmp_path / "output")
        from data_pipeline.transform import run_transform
        report = run_transform(
            data_dir=temp_data_dir,
            output_dir=output_dir,
            store_ids=["CA_1", "CA_2"],
            products_per_store=3,
            history_days=10,
        )

        assert os.path.isfile(os.path.join(output_dir, "stores.csv"))
        assert os.path.isfile(os.path.join(output_dir, "products.csv"))
        assert os.path.isfile(os.path.join(output_dir, "daily_sales.csv"))

        # Verify stores
        stores = pd.read_csv(os.path.join(output_dir, "stores.csv"))
        assert len(stores) == 2
        assert set(stores["id"]) == {"CA_1", "CA_2"}

        # Verify products
        products = pd.read_csv(os.path.join(output_dir, "products.csv"))
        assert len(products) <= 6  # Up to 3 per store, 2 stores, with overlap
        assert all(products["data_source"] == "m5_walmart_historical")

        # Verify daily sales — long format
        daily = pd.read_csv(os.path.join(output_dir, "daily_sales.csv"))
        assert len(daily) > 0
        assert "store_id" in daily.columns
        assert "product_id" in daily.columns
        assert "sale_date" in daily.columns
        assert "units_sold" in daily.columns
        assert all(daily["data_source"] == "m5_walmart_historical")

    def test_transform_preserves_original_ids(self, temp_data_dir, tmp_path):
        output_dir = str(tmp_path / "output2")
        from data_pipeline.transform import run_transform
        run_transform(
            data_dir=temp_data_dir,
            output_dir=output_dir,
            store_ids=["CA_1"],
            products_per_store=3,
            history_days=10,
        )
        products = pd.read_csv(os.path.join(output_dir, "products.csv"))
        # IDs should be original M5 identifiers
        for pid in products["id"]:
            assert pid.startswith("FOODS_") or pid.startswith("HOUSEHOLD_") or pid.startswith("HOBBIES_")

    def test_date_mapping(self, temp_data_dir, tmp_path):
        output_dir = str(tmp_path / "output3")
        from data_pipeline.transform import run_transform
        run_transform(
            data_dir=temp_data_dir,
            output_dir=output_dir,
            store_ids=["CA_1"],
            products_per_store=3,
            history_days=10,
        )
        daily = pd.read_csv(os.path.join(output_dir, "daily_sales.csv"))
        dates = pd.to_datetime(daily["sale_date"])
        assert dates.min() >= pd.Timestamp("2016-04-25")
        assert dates.max() <= pd.Timestamp("2016-05-04")

    def test_price_join(self, temp_data_dir, tmp_path):
        output_dir = str(tmp_path / "output4")
        from data_pipeline.transform import run_transform
        run_transform(
            data_dir=temp_data_dir,
            output_dir=output_dir,
            store_ids=["CA_1"],
            products_per_store=3,
            history_days=10,
        )
        daily = pd.read_csv(os.path.join(output_dir, "daily_sales.csv"))
        # At least some rows should have prices (from our fixture)
        has_price = daily["unit_price"].notna()
        assert has_price.sum() > 0, "Should have at least some prices matched"

    def test_revenue_only_with_price(self, temp_data_dir, tmp_path):
        output_dir = str(tmp_path / "output5")
        from data_pipeline.transform import run_transform
        run_transform(
            data_dir=temp_data_dir,
            output_dir=output_dir,
            store_ids=["CA_1"],
            products_per_store=3,
            history_days=10,
        )
        daily = pd.read_csv(os.path.join(output_dir, "daily_sales.csv"))
        # Revenue should only exist where price exists
        for _, row in daily.iterrows():
            if pd.isna(row["unit_price"]):
                assert pd.isna(row["revenue"]), "Revenue should be null when price is missing"

    def test_nonnegative_units(self, temp_data_dir, tmp_path):
        output_dir = str(tmp_path / "output6")
        from data_pipeline.transform import run_transform
        run_transform(
            data_dir=temp_data_dir,
            output_dir=output_dir,
            store_ids=["CA_1"],
            products_per_store=3,
            history_days=10,
        )
        daily = pd.read_csv(os.path.join(output_dir, "daily_sales.csv"))
        assert (daily["units_sold"] >= 0).all(), "Units sold should be nonnegative"


# ============================================================
# Test: Schema SQL validity (static checks)
# ============================================================

class TestSchemaSql:
    def test_migration_file_exists(self):
        path = os.path.join("database", "migrations", "001_initial_schema.sql")
        assert os.path.isfile(path), f"Migration file should exist at {path}"

    def test_migration_contains_all_tables(self):
        path = os.path.join("database", "migrations", "001_initial_schema.sql")
        with open(path, "r") as f:
            sql = f.read()

        expected_tables = [
            "stores", "products", "daily_sales", "inventory",
            "purchase_orders", "purchase_order_items", "wastage_records",
            "detected_issues", "actions", "action_approvals",
            "store_tasks", "audit_logs", "data_import_runs",
            "store_metrics", "product_catalog_imports", "causal_relationships",
        ]
        for table in expected_tables:
            assert f"CREATE TABLE IF NOT EXISTS {table}" in sql, f"Missing table: {table}"

    def test_migration_has_foreign_keys(self):
        path = os.path.join("database", "migrations", "001_initial_schema.sql")
        with open(path, "r") as f:
            sql = f.read()
        assert "REFERENCES stores(id)" in sql
        assert "REFERENCES products(id)" in sql
        assert "REFERENCES detected_issues(id)" in sql
        assert "REFERENCES actions(id)" in sql

    def test_migration_has_unique_constraints(self):
        path = os.path.join("database", "migrations", "001_initial_schema.sql")
        with open(path, "r") as f:
            sql = f.read()
        assert "uq_daily_sales" in sql
        assert "uq_inventory" in sql

    def test_migration_has_check_constraints(self):
        path = os.path.join("database", "migrations", "001_initial_schema.sql")
        with open(path, "r") as f:
            sql = f.read()
        assert "units_sold >= 0" in sql
        assert "confidence >= 0" in sql
        assert "quantity > 0" in sql  # wastage

    def test_migration_has_indexes(self):
        path = os.path.join("database", "migrations", "001_initial_schema.sql")
        with open(path, "r") as f:
            sql = f.read()
        assert "idx_daily_sales_store_date" in sql
        assert "idx_inventory_store" in sql
        assert "idx_detected_issues_status" in sql

    def test_rls_migration_exists(self):
        path = os.path.join("database", "migrations", "002_rls_policies.sql")
        assert os.path.isfile(path)
        with open(path, "r") as f:
            sql = f.read()
        assert "ENABLE ROW LEVEL SECURITY" in sql

    def test_action_approval_decision_constraint(self):
        path = os.path.join("database", "migrations", "001_initial_schema.sql")
        with open(path, "r") as f:
            sql = f.read()
        assert "'approved'" in sql
        assert "'rejected'" in sql


# ============================================================
# Test: Duplicate prevention logic
# ============================================================

class TestDuplicatePrevention:
    def test_daily_sales_unique_constraint_in_schema(self):
        path = os.path.join("database", "migrations", "001_initial_schema.sql")
        with open(path, "r") as f:
            sql = f.read()
        assert "UNIQUE (store_id, product_id, sale_date)" in sql

    def test_inventory_unique_constraint_in_schema(self):
        path = os.path.join("database", "migrations", "001_initial_schema.sql")
        with open(path, "r") as f:
            sql = f.read()
        assert "UNIQUE (store_id, product_id)" in sql

    def test_import_uses_on_conflict(self):
        import inspect
        from data_pipeline.import_data import _batch_upsert
        source = inspect.getsource(_batch_upsert)
        assert "ON CONFLICT" in source

    def test_seed_demo_uses_on_conflict(self):
        import inspect
        from data_pipeline.seed_demo import _seed_demo_sales
        source = inspect.getsource(_seed_demo_sales)
        assert "ON CONFLICT" in source


# ============================================================
# Test: Data source labels
# ============================================================

class TestDataSourceLabels:
    def test_transform_uses_correct_label(self):
        from data_pipeline.transform import DATA_SOURCE
        assert DATA_SOURCE == "m5_walmart_historical"

    def test_seed_uses_correct_label(self):
        from data_pipeline.seed_demo import DATA_SOURCE
        assert DATA_SOURCE == "simulated_demo"


# ============================================================
# Test: Report file generation
# ============================================================

class TestTransformReport:
    def test_transform_report_generated(self, temp_data_dir, tmp_path):
        output_dir = str(tmp_path / "output_rpt")
        from data_pipeline.transform import run_transform
        report = run_transform(
            data_dir=temp_data_dir,
            output_dir=output_dir,
            store_ids=["CA_1"],
            products_per_store=3,
            history_days=10,
        )
        assert "results" in report
        assert report["results"]["stores_count"] > 0
        assert report["results"]["products_count"] > 0
        assert report["results"]["daily_sales_count"] > 0

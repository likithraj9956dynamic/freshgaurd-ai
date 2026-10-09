"""
FreshGuard AI — M5 Dataset Validation

Validates that the required M5 CSV files exist and contain expected columns.
"""
import os
import sys

REQUIRED_FILES = {
    "sales_train_validation.csv": [
        "id", "item_id", "dept_id", "cat_id", "store_id", "state_id",
    ],
    "calendar.csv": [
        "date", "wm_yr_wk", "d",
    ],
    "sell_prices.csv": [
        "store_id", "item_id", "wm_yr_wk", "sell_price",
    ],
}


def run_validate(data_dir: str = "data/raw"):
    """Validate that M5 source files exist and have required columns."""
    import pandas as pd

    print(f"Validating M5 files in: {os.path.abspath(data_dir)}")
    all_ok = True
    results = {}

    for filename, required_cols in REQUIRED_FILES.items():
        filepath = os.path.join(data_dir, filename)
        if not os.path.isfile(filepath):
            print(f"  ✗ MISSING: {filename}")
            print(f"    Download from: https://www.kaggle.com/competitions/m5-forecasting-accuracy/data")
            print(f"    Place in: {os.path.abspath(data_dir)}/")
            all_ok = False
            results[filename] = {"exists": False, "columns_ok": False}
            continue

        # Read just the header
        try:
            df_head = pd.read_csv(filepath, nrows=0)
        except Exception as e:
            print(f"  ✗ ERROR reading {filename}: {e}")
            all_ok = False
            results[filename] = {"exists": True, "columns_ok": False, "error": str(e)}
            continue

        actual_cols = set(df_head.columns)
        missing_cols = [c for c in required_cols if c not in actual_cols]

        if missing_cols:
            print(f"  ✗ {filename}: missing columns {missing_cols}")
            all_ok = False
            results[filename] = {"exists": True, "columns_ok": False, "missing": missing_cols}
        else:
            # Count rows (cheap scan)
            row_count = sum(1 for _ in open(filepath, encoding="utf-8")) - 1
            print(f"  ✓ {filename}: OK ({row_count:,} rows, {len(actual_cols)} columns)")
            results[filename] = {"exists": True, "columns_ok": True, "rows": row_count}

    print()
    if all_ok:
        print("All M5 source files validated successfully.")
    else:
        print("Validation FAILED. See errors above.")
        print("Download the M5 dataset from Kaggle and place files in:", os.path.abspath(data_dir))
        sys.exit(1)

    return results

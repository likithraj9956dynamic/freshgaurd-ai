"""
FreshGuard AI — M5 Dataset Transformation

Converts M5 wide-format sales data to long-format CSVs ready for import.
Produces: stores.csv, products.csv, daily_sales.csv
"""
import os
import sys
import json
from datetime import datetime

import pandas as pd


DEFAULT_STORES = ["CA_1", "CA_2", "CA_3"]
DATA_SOURCE = "m5_walmart_historical"


def run_transform(
    data_dir: str = "data/raw",
    output_dir: str = "data/processed",
    store_ids: list = None,
    products_per_store: int = 50,
    history_days: int = 90,
):
    """Transform M5 wide-format data into normalized long-format CSVs."""

    if store_ids is None:
        store_ids = DEFAULT_STORES

    print(f"=== M5 Data Transformation ===")
    print(f"  Stores:             {store_ids}")
    print(f"  Products per store: {products_per_store}")
    print(f"  History days:       {history_days}")
    print()

    os.makedirs(output_dir, exist_ok=True)
    os.makedirs("data/reports", exist_ok=True)

    # --- Load calendar ---
    calendar_path = os.path.join(data_dir, "calendar.csv")
    print(f"Loading calendar from {calendar_path}...")
    calendar = pd.read_csv(calendar_path)
    calendar["date"] = pd.to_datetime(calendar["date"])

    # Build d_col -> date mapping
    d_to_date = dict(zip(calendar["d"], calendar["date"]))
    d_to_wk = dict(zip(calendar["d"], calendar["wm_yr_wk"]))

    # Determine the date range: last `history_days` available days
    all_d_cols = [c for c in sorted(d_to_date.keys(), key=lambda x: int(x.split("_")[1]))]
    recent_d_cols = all_d_cols[-history_days:]
    date_start = d_to_date[recent_d_cols[0]]
    date_end = d_to_date[recent_d_cols[-1]]
    print(f"  Date window: {date_start.date()} to {date_end.date()} ({len(recent_d_cols)} days)")

    # --- Load sell_prices ---
    prices_path = os.path.join(data_dir, "sell_prices.csv")
    print(f"Loading sell prices from {prices_path}...")
    prices = pd.read_csv(prices_path)

    # --- Load sales ---
    sales_path = os.path.join(data_dir, "sales_train_validation.csv")
    print(f"Loading sales from {sales_path}...")
    sales = pd.read_csv(sales_path)

    # Filter to selected stores
    sales = sales[sales["store_id"].isin(store_ids)]
    if sales.empty:
        print(f"ERROR: No rows found for stores {store_ids}")
        sys.exit(1)

    print(f"  Rows for selected stores: {len(sales):,}")

    # --- Build stores.csv ---
    store_rows = []
    for sid in sales["store_id"].unique():
        state = sid.split("_")[0]
        store_rows.append({
            "id": sid,
            "name": f"M5 Store {sid}",
            "location": None,
            "state": state,
            "country": "US",
            "store_format": "retail",
            "status": "active",
        })
    stores_df = pd.DataFrame(store_rows)
    stores_path = os.path.join(output_dir, "stores.csv")
    stores_df.to_csv(stores_path, index=False)
    print(f"  Wrote {len(stores_df)} stores to {stores_path}")

    # --- Select top products per store ---
    # For each store, pick the top N products by total units sold in the window
    selected_items = set()
    for sid in store_ids:
        store_sales = sales[sales["store_id"] == sid]
        # Sum sales over the recent window
        if recent_d_cols[0] not in store_sales.columns:
            print(f"  WARNING: day column {recent_d_cols[0]} not in sales data, skipping store {sid}")
            continue
        available_d_cols = [d for d in recent_d_cols if d in store_sales.columns]
        totals = store_sales[available_d_cols].sum(axis=1)
        store_sales = store_sales.assign(_total=totals)
        top = store_sales.nlargest(products_per_store, "_total")
        selected_items.update(top["item_id"].tolist())

    print(f"  Selected {len(selected_items)} unique products across all stores")

    # Filter sales to selected items
    sales = sales[sales["item_id"].isin(selected_items)]

    # --- Build products.csv ---
    product_rows = []
    for item_id in sorted(selected_items):
        row = sales[sales["item_id"] == item_id].iloc[0]
        product_rows.append({
            "id": item_id,
            "name": item_id,  # Preserve original M5 ID; no fake product names
            "category": row.get("cat_id", None),
            "subcategory": row.get("dept_id", None),
            "brand": None,
            "barcode": None,
            "unit_price": None,  # Set during sales join
            "unit_cost": None,
            "perishable": str(row.get("cat_id", "")).startswith("FOODS"),
            "shelf_life_days": None,
            "data_source": DATA_SOURCE,
            "external_product_id": item_id,
        })
    products_df = pd.DataFrame(product_rows)
    products_path = os.path.join(output_dir, "products.csv")
    products_df.to_csv(products_path, index=False)
    print(f"  Wrote {len(products_df)} products to {products_path}")

    # --- Build daily_sales.csv (long format) ---
    print("  Melting sales to long format...")
    available_d_cols = [d for d in recent_d_cols if d in sales.columns]

    id_cols = ["item_id", "store_id"]
    long = sales[id_cols + available_d_cols].melt(
        id_vars=id_cols,
        value_vars=available_d_cols,
        var_name="d",
        value_name="units_sold",
    )
    long["sale_date"] = long["d"].map(d_to_date)
    long["wm_yr_wk"] = long["d"].map(d_to_wk)

    # Join prices
    long = long.merge(
        prices,
        left_on=["store_id", "item_id", "wm_yr_wk"],
        right_on=["store_id", "item_id", "wm_yr_wk"],
        how="left",
    )

    # Track missing prices
    missing_price_count = long["sell_price"].isna().sum()
    total_rows = len(long)

    # Calculate revenue only where price exists
    long["revenue"] = None
    has_price = long["sell_price"].notna()
    long.loc[has_price, "revenue"] = (
        long.loc[has_price, "units_sold"] * long.loc[has_price, "sell_price"]
    )

    # Rename for DB schema
    daily_sales_df = long.rename(columns={
        "item_id": "product_id",
        "sell_price": "unit_price",
    })[["store_id", "product_id", "sale_date", "units_sold", "unit_price", "revenue"]]
    daily_sales_df["data_source"] = DATA_SOURCE
    daily_sales_df["sale_date"] = daily_sales_df["sale_date"].dt.strftime("%Y-%m-%d")

    daily_path = os.path.join(output_dir, "daily_sales.csv")
    daily_sales_df.to_csv(daily_path, index=False)
    print(f"  Wrote {len(daily_sales_df):,} daily sales rows to {daily_path}")
    print(f"  Missing prices: {missing_price_count:,} / {total_rows:,} ({100*missing_price_count/max(total_rows,1):.1f}%)")

    # --- Generate transform report ---
    report = {
        "timestamp": datetime.utcnow().isoformat(),
        "config": {
            "stores": store_ids,
            "products_per_store": products_per_store,
            "history_days": history_days,
            "date_start": str(date_start.date()),
            "date_end": str(date_end.date()),
        },
        "results": {
            "stores_count": len(stores_df),
            "products_count": len(products_df),
            "daily_sales_count": len(daily_sales_df),
            "missing_prices": int(missing_price_count),
            "total_sales_rows": int(total_rows),
        },
        "output_files": [stores_path, products_path, daily_path],
    }
    report_path = os.path.join("data/reports", "transform_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"\n  Transform report saved to {report_path}")
    print("=== Transformation Complete ===")
    return report

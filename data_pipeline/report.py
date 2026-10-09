"""
FreshGuard AI — Data Import Report Generator

Reads data_import_runs from the database and generates a summary report.
"""
import os
import sys
import json
from datetime import datetime

from data_pipeline.db import get_db_connection


def run_report():
    """Generate and display a data import summary report."""
    print("=== FreshGuard AI — Data Import Report ===\n")

    # Check for local transform report
    transform_report_path = os.path.join("data/reports", "transform_report.json")
    if os.path.isfile(transform_report_path):
        with open(transform_report_path, "r") as f:
            tr = json.load(f)
        print("--- Transform Report ---")
        print(f"  Timestamp:     {tr.get('timestamp', 'N/A')}")
        cfg = tr.get("config", {})
        print(f"  Stores:        {cfg.get('stores', 'N/A')}")
        print(f"  Date window:   {cfg.get('date_start', '?')} to {cfg.get('date_end', '?')}")
        res = tr.get("results", {})
        print(f"  Stores:        {res.get('stores_count', 0)}")
        print(f"  Products:      {res.get('products_count', 0)}")
        print(f"  Daily sales:   {res.get('daily_sales_count', 0):,}")
        print(f"  Missing prices:{res.get('missing_prices', 0):,} / {res.get('total_sales_rows', 0):,}")
        print()

    # Check for local import report
    import_report_path = os.path.join("data/reports", "import_report.json")
    if os.path.isfile(import_report_path):
        with open(import_report_path, "r") as f:
            ir = json.load(f)
        print("--- Import Report ---")
        print(f"  Timestamp: {ir.get('timestamp', 'N/A')}")
        for table, result in ir.get("results", {}).items():
            if result:
                print(f"  {table}: {result}")
        print()

    # Try to read from database
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT dataset_name, source, started_at, completed_at, status,
                   records_read, records_inserted, records_updated, records_rejected, error_summary
            FROM data_import_runs
            ORDER BY started_at DESC
            LIMIT 20
        """)
        rows = cur.fetchall()
        conn.close()

        if rows:
            print("--- Database Import Runs ---")
            for row in rows:
                name, src, started, completed, status, read, ins, upd, rej, err = row
                print(f"  [{status}] {name} (source: {src})")
                print(f"    Started:  {started}")
                print(f"    Finished: {completed or 'N/A'}")
                print(f"    Read: {read or 0}, Inserted: {ins or 0}, Updated: {upd or 0}, Rejected: {rej or 0}")
                if err:
                    print(f"    Error: {err}")
                print()
        else:
            print("  No import runs recorded in database yet.")

    except Exception as e:
        print(f"  Could not connect to database: {e}")
        print("  Showing local reports only.\n")

    # Store/product/sales counts from DB
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        for table in ["stores", "products", "daily_sales", "inventory", "purchase_orders", "wastage_records"]:
            cur.execute(f"SELECT COUNT(*) FROM {table}")
            count = cur.fetchone()[0]
            print(f"  {table}: {count:,} rows")
        conn.close()
    except Exception:
        pass

    print("\n=== Report Complete ===")

"""
FreshGuard AI — CSV Import to Supabase PostgreSQL

Imports processed CSVs (stores, products, daily_sales) into Supabase
using batch upserts via psycopg2. Idempotent — safe to run repeatedly.
"""
import os
import sys
import json
from datetime import datetime

import pandas as pd

from data_pipeline.db import get_db_connection


def _batch_upsert(conn, table, df, conflict_cols, batch_size=500):
    """Generic batch upsert using INSERT ... ON CONFLICT DO UPDATE."""
    if df.empty:
        return {"inserted": 0, "updated": 0}

    cols = list(df.columns)
    placeholders = ", ".join(["%s"] * len(cols))
    col_names = ", ".join(cols)
    conflict = ", ".join(conflict_cols)
    update_cols = [c for c in cols if c not in conflict_cols]
    update_clause = ", ".join([f"{c} = EXCLUDED.{c}" for c in update_cols])

    if update_clause:
        sql = f"""
            INSERT INTO {table} ({col_names})
            VALUES ({placeholders})
            ON CONFLICT ({conflict}) DO UPDATE SET {update_clause}
        """
    else:
        sql = f"""
            INSERT INTO {table} ({col_names})
            VALUES ({placeholders})
            ON CONFLICT ({conflict}) DO NOTHING
        """

    cur = conn.cursor()
    total = 0
    for start in range(0, len(df), batch_size):
        batch = df.iloc[start:start + batch_size]
        values = [tuple(row) for _, row in batch.iterrows()]
        from psycopg2.extras import execute_batch
        execute_batch(cur, sql, values, page_size=batch_size)
        total += len(batch)
        print(f"    {table}: upserted {total:,} / {len(df):,} rows", end="\r")

    conn.commit()
    print(f"    {table}: upserted {total:,} rows total          ")
    return {"upserted": total}


def _import_stores(conn, data_dir, batch_size):
    path = os.path.join(data_dir, "stores.csv")
    if not os.path.isfile(path):
        print(f"  ⚠ {path} not found, skipping stores import")
        return None
    df = pd.read_csv(path)
    # Fill NaN with None for SQL
    df = df.where(pd.notna(df), None)
    return _batch_upsert(conn, "stores", df, ["id"], batch_size)


def _import_products(conn, data_dir, batch_size):
    path = os.path.join(data_dir, "products.csv")
    if not os.path.isfile(path):
        print(f"  ⚠ {path} not found, skipping products import")
        return None
    df = pd.read_csv(path)
    df = df.where(pd.notna(df), None)
    return _batch_upsert(conn, "products", df, ["id"], batch_size)


def _import_daily_sales(conn, data_dir, batch_size):
    path = os.path.join(data_dir, "daily_sales.csv")
    if not os.path.isfile(path):
        print(f"  ⚠ {path} not found, skipping daily_sales import")
        return None
    df = pd.read_csv(path)
    df = df.where(pd.notna(df), None)

    # The DB has a unique constraint on (store_id, product_id, sale_date)
    return _batch_upsert(
        conn, "daily_sales",
        df[["store_id", "product_id", "sale_date", "units_sold", "unit_price", "revenue", "data_source"]],
        ["store_id", "product_id", "sale_date"],
        batch_size,
    )


def run_import(data_dir: str = "data/processed", batch_size: int = 500):
    """Import processed CSVs into Supabase PostgreSQL."""
    print("=== CSV Import to Supabase ===")

    try:
        conn = get_db_connection()
    except Exception as e:
        print(f"ERROR: Could not connect to database: {e}")
        print("Check your .env file and Supabase credentials.")
        sys.exit(1)

    started = datetime.utcnow()
    results = {}

    try:
        print("  Importing stores...")
        results["stores"] = _import_stores(conn, data_dir, batch_size)

        print("  Importing products...")
        results["products"] = _import_products(conn, data_dir, batch_size)

        print("  Importing daily sales...")
        results["daily_sales"] = _import_daily_sales(conn, data_dir, batch_size)

        # Record import run
        cur = conn.cursor()
        total_inserted = sum(
            (r or {}).get("upserted", 0) for r in results.values()
        )
        cur.execute("""
            INSERT INTO data_import_runs
                (dataset_name, source, started_at, completed_at, status,
                 records_read, records_inserted)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            "m5_csv_import", "m5_walmart_historical",
            started, datetime.utcnow(), "completed",
            total_inserted, total_inserted,
        ))
        conn.commit()

    except Exception as e:
        conn.rollback()
        print(f"ERROR during import: {e}")
        # Record failed import
        try:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO data_import_runs
                    (dataset_name, source, started_at, completed_at, status, error_summary)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                "m5_csv_import", "m5_walmart_historical",
                started, datetime.utcnow(), "failed", str(e),
            ))
            conn.commit()
        except Exception:
            pass
        raise
    finally:
        conn.close()

    # Save import report
    os.makedirs("data/reports", exist_ok=True)
    report_path = os.path.join("data/reports", "import_report.json")
    with open(report_path, "w") as f:
        json.dump({
            "timestamp": datetime.utcnow().isoformat(),
            "results": results,
        }, f, indent=2, default=str)
    print(f"\n  Import report saved to {report_path}")
    print("=== Import Complete ===")
    return results

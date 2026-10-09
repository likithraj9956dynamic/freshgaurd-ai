"""
FreshGuard AI — Demo Data Seeder

Generates clearly labelled simulated operational data for development.
All records use data_source = 'simulated_demo'.
Idempotent — safe to run multiple times without creating duplicates.
"""
import sys
import uuid
from datetime import datetime, timedelta, date

from data_pipeline.db import get_db_connection

DATA_SOURCE = "simulated_demo"


def _ensure_demo_store(cur, store_id):
    """Create the demo store if it doesn't exist."""
    cur.execute("SELECT id FROM stores WHERE id = %s", (store_id,))
    if cur.fetchone() is None:
        cur.execute("""
            INSERT INTO stores (id, name, location, state, country, store_format, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            store_id,
            f"Demo Store {store_id}",
            "Demo Location (not a real address)",
            "DEMO",
            "US",
            "demo",
            "active",
        ))
        print(f"  Created demo store: {store_id}")
    else:
        print(f"  Demo store {store_id} already exists")


def _ensure_demo_products(cur, store_id):
    """Create demo products if they don't exist. Returns list of product IDs."""
    demo_products = [
        ("DEMO_MILK_001", "Demo Whole Milk 1gal", "FOODS", "FOODS_3", True, 7),
        ("DEMO_BREAD_001", "Demo White Bread", "FOODS", "FOODS_3", True, 5),
        ("DEMO_EGGS_001", "Demo Large Eggs 12ct", "FOODS", "FOODS_3", True, 21),
        ("DEMO_BANANA_001", "Demo Bananas 1lb", "FOODS", "FOODS_3", True, 4),
        ("DEMO_CHICKEN_001", "Demo Chicken Breast 1lb", "FOODS", "FOODS_3", True, 3),
        ("DEMO_CHIPS_001", "Demo Potato Chips 10oz", "FOODS", "FOODS_1", False, 180),
        ("DEMO_SODA_001", "Demo Cola 12-pack", "FOODS", "FOODS_2", False, 365),
        ("DEMO_SOAP_001", "Demo Dish Soap 24oz", "HOUSEHOLD", "HOUSEHOLD_1", False, None),
        ("DEMO_PAPER_001", "Demo Paper Towels 6ct", "HOUSEHOLD", "HOUSEHOLD_1", False, None),
        ("DEMO_DETERG_001", "Demo Laundry Detergent 64oz", "HOUSEHOLD", "HOUSEHOLD_2", False, None),
    ]

    product_ids = []
    for pid, name, cat, subcat, perishable, shelf_life in demo_products:
        cur.execute("SELECT id FROM products WHERE id = %s", (pid,))
        if cur.fetchone() is None:
            cur.execute("""
                INSERT INTO products
                    (id, name, category, subcategory, perishable, shelf_life_days, data_source)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (pid, name, cat, subcat, perishable, shelf_life, DATA_SOURCE))
        product_ids.append(pid)

    print(f"  Ensured {len(product_ids)} demo products exist")
    return product_ids


def _seed_demo_sales(cur, store_id, product_ids):
    """Generate 30 days of demo sales history."""
    today = date.today()
    count = 0
    import random
    random.seed(42)  # Reproducible

    # Average daily demand per product (units)
    demands = {
        "DEMO_MILK_001": 25, "DEMO_BREAD_001": 30, "DEMO_EGGS_001": 18,
        "DEMO_BANANA_001": 40, "DEMO_CHICKEN_001": 15, "DEMO_CHIPS_001": 12,
        "DEMO_SODA_001": 20, "DEMO_SOAP_001": 5, "DEMO_PAPER_001": 8,
        "DEMO_DETERG_001": 4,
    }
    prices = {
        "DEMO_MILK_001": 3.99, "DEMO_BREAD_001": 2.49, "DEMO_EGGS_001": 4.29,
        "DEMO_BANANA_001": 0.59, "DEMO_CHICKEN_001": 5.99, "DEMO_CHIPS_001": 3.49,
        "DEMO_SODA_001": 5.99, "DEMO_SOAP_001": 3.29, "DEMO_PAPER_001": 8.99,
        "DEMO_DETERG_001": 11.99,
    }

    for day_offset in range(30):
        sale_date = today - timedelta(days=30 - day_offset)
        for pid in product_ids:
            avg = demands.get(pid, 10)
            units = max(0, int(random.gauss(avg, avg * 0.3)))
            price = prices.get(pid, 5.00)
            revenue = round(units * price, 2)

            cur.execute("""
                INSERT INTO daily_sales (store_id, product_id, sale_date, units_sold, unit_price, revenue, data_source)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (store_id, product_id, sale_date) DO UPDATE SET
                    units_sold = EXCLUDED.units_sold,
                    unit_price = EXCLUDED.unit_price,
                    revenue = EXCLUDED.revenue
            """, (store_id, pid, sale_date, units, price, revenue, DATA_SOURCE))
            count += 1

    print(f"  Seeded {count} demo daily sales records (30 days × {len(product_ids)} products)")


def _seed_inventory(cur, store_id, product_ids):
    """Seed inventory with some products critically low to demonstrate alerts."""
    import random
    random.seed(42)

    inventory_data = {
        # pid: (current_stock, reorder_level) — some deliberately below reorder
        "DEMO_MILK_001": (8, 20),     # LOW — triggers alert
        "DEMO_BREAD_001": (5, 25),    # LOW — triggers alert
        "DEMO_EGGS_001": (3, 15),     # CRITICAL — triggers alert
        "DEMO_BANANA_001": (12, 30),  # LOW — triggers alert
        "DEMO_CHICKEN_001": (2, 10),  # CRITICAL — triggers alert
        "DEMO_CHIPS_001": (45, 20),   # OK
        "DEMO_SODA_001": (60, 25),    # OK
        "DEMO_SOAP_001": (30, 10),    # OK
        "DEMO_PAPER_001": (22, 15),   # OK
        "DEMO_DETERG_001": (18, 8),   # OK
    }

    count = 0
    for pid in product_ids:
        stock, reorder = inventory_data.get(pid, (20, 10))
        cur.execute("""
            INSERT INTO inventory (store_id, product_id, current_stock, reorder_level, data_source)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (store_id, product_id) DO UPDATE SET
                current_stock = EXCLUDED.current_stock,
                reorder_level = EXCLUDED.reorder_level,
                updated_at = NOW()
        """, (store_id, pid, stock, reorder, DATA_SOURCE))
        count += 1

    print(f"  Seeded {count} inventory records (5 products below reorder level)")


def _seed_purchase_orders(cur, store_id, product_ids):
    """Seed purchase orders — including one delayed order for the demo scenario."""
    today = date.today()

    # Check if demo POs already exist
    cur.execute(
        "SELECT COUNT(*) FROM purchase_orders WHERE store_id = %s AND data_source = %s",
        (store_id, DATA_SOURCE)
    )
    existing = cur.fetchone()[0]
    if existing > 0:
        print(f"  Demo purchase orders already exist ({existing}), skipping")
        return

    # PO 1: Delayed order (key to the STORE_17 demo scenario)
    delayed_po_id = f"PO-DEMO-{store_id}-DELAYED"
    cur.execute("""
        INSERT INTO purchase_orders
            (id, store_id, supplier_name, order_date, expected_delivery, actual_delivery, status, data_source)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        delayed_po_id, store_id,
        "Demo Supplier A (simulated)",
        today - timedelta(days=7),
        today - timedelta(days=2),  # Expected 2 days ago
        None,                        # Not delivered yet
        "delayed",
        DATA_SOURCE,
    ))

    # Items in delayed PO — the low-stock perishables
    delayed_items = ["DEMO_MILK_001", "DEMO_BREAD_001", "DEMO_EGGS_001", "DEMO_BANANA_001", "DEMO_CHICKEN_001"]
    for pid in delayed_items:
        if pid in product_ids:
            cur.execute("""
                INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity_ordered, quantity_received)
                VALUES (%s, %s, %s, %s)
            """, (delayed_po_id, pid, 100, 0))

    # PO 2: Normal delivered order
    normal_po_id = f"PO-DEMO-{store_id}-NORMAL"
    cur.execute("""
        INSERT INTO purchase_orders
            (id, store_id, supplier_name, order_date, expected_delivery, actual_delivery, status, data_source)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        normal_po_id, store_id,
        "Demo Supplier B (simulated)",
        today - timedelta(days=14),
        today - timedelta(days=10),
        today - timedelta(days=10),
        "delivered",
        DATA_SOURCE,
    ))

    for pid in ["DEMO_CHIPS_001", "DEMO_SODA_001"]:
        if pid in product_ids:
            cur.execute("""
                INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity_ordered, quantity_received)
                VALUES (%s, %s, %s, %s)
            """, (normal_po_id, pid, 50, 50))

    print(f"  Seeded 2 purchase orders (1 delayed, 1 delivered) with items")


def _seed_wastage(cur, store_id, product_ids):
    """Seed wastage records for perishable products."""
    today = date.today()

    cur.execute(
        "SELECT COUNT(*) FROM wastage_records WHERE store_id = %s AND data_source = %s",
        (store_id, DATA_SOURCE)
    )
    if cur.fetchone()[0] > 0:
        print("  Demo wastage records already exist, skipping")
        return

    import random
    random.seed(42)
    wastage_reasons = ["expired", "damaged", "quality_issue", "overstock_spoilage"]
    perishable_ids = [p for p in product_ids if p.startswith("DEMO_") and p not in ("DEMO_SOAP_001", "DEMO_PAPER_001", "DEMO_DETERG_001")]

    count = 0
    for pid in perishable_ids:
        for day_offset in range(7):
            if random.random() < 0.6:  # 60% chance of wastage each day
                cur.execute("""
                    INSERT INTO wastage_records (store_id, product_id, quantity, reason, recorded_at, data_source)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    store_id, pid,
                    random.randint(1, 5),
                    random.choice(wastage_reasons),
                    datetime.combine(today - timedelta(days=day_offset), datetime.min.time()),
                    DATA_SOURCE,
                ))
                count += 1

    print(f"  Seeded {count} wastage records for perishable products")


def _seed_detected_issues(cur, store_id):
    """Seed a detected issue for the demo scenario."""
    import json

    cur.execute(
        "SELECT COUNT(*) FROM detected_issues WHERE store_id = %s AND issue_type = %s AND status = 'open'",
        (store_id, "low_stock_risk")
    )
    if cur.fetchone()[0] > 0:
        print("  Demo detected issues already exist, skipping")
        return

    issue_id = f"ISSUE-DEMO-{store_id}-001"
    cur.execute("""
        INSERT INTO detected_issues
            (id, store_id, issue_type, severity, title, description, evidence, confidence, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        issue_id, store_id,
        "low_stock_risk",
        "high",
        "Multiple perishable products below reorder level with delayed supplier delivery",
        "5 perishable products are below their configured reorder levels. "
        "A purchase order (PO-DEMO-STORE_17-DELAYED) expected 2 days ago has not been delivered. "
        "Based on recent average daily demand, estimated stockout for some products is within 1-2 days.",
        json.dumps({
            "low_stock_products": ["DEMO_MILK_001", "DEMO_BREAD_001", "DEMO_EGGS_001", "DEMO_BANANA_001", "DEMO_CHICKEN_001"],
            "delayed_po": "PO-DEMO-STORE_17-DELAYED",
            "detection_method": "deterministic_rule",
            "data_source": DATA_SOURCE,
        }),
        0.85,
        "open",
    ))
    print(f"  Created demo detected issue: {issue_id}")


def run_seed_demo(store_id: str = "STORE_17"):
    """Seed all demo operational data for the given store."""
    print(f"=== Seeding Demo Data for {store_id} ===")
    print(f"  All records labelled with data_source = '{DATA_SOURCE}'")

    try:
        conn = get_db_connection()
    except Exception as e:
        print(f"ERROR: Could not connect to database: {e}")
        print("Check your .env file and Supabase credentials.")
        sys.exit(1)

    try:
        cur = conn.cursor()

        _ensure_demo_store(cur, store_id)
        product_ids = _ensure_demo_products(cur, store_id)
        _seed_demo_sales(cur, store_id, product_ids)
        _seed_inventory(cur, store_id, product_ids)
        _seed_purchase_orders(cur, store_id, product_ids)
        _seed_wastage(cur, store_id, product_ids)
        _seed_detected_issues(cur, store_id)

        # Record the seed run
        cur.execute("""
            INSERT INTO data_import_runs
                (dataset_name, source, started_at, completed_at, status, records_read, records_inserted)
            VALUES (%s, %s, NOW(), NOW(), 'completed', %s, %s)
        """, ("demo_seed", DATA_SOURCE, len(product_ids) * 30, len(product_ids) * 30))

        conn.commit()
        print(f"\n=== Demo Data Seeding Complete ===")
        print(f"  Store: {store_id}")
        print(f"  Products: {len(product_ids)}")
        print(f"  All records marked as '{DATA_SOURCE}'")

    except Exception as e:
        conn.rollback()
        print(f"ERROR during seeding: {e}")
        raise
    finally:
        conn.close()

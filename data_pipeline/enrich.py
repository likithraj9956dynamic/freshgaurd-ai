"""
FreshGuard AI — Open Food Facts Product Enrichment

Optional integration to enrich product records with data from Open Food Facts.
Only matches products that have a valid barcode. Does not fabricate barcodes.
"""
import os
import sys
import json
import time
import hashlib

import requests

from data_pipeline.db import get_db_connection

OFF_API_BASE = "https://world.openfoodfacts.org/api/v2/product"
USER_AGENT = "FreshGuardAI/1.0 (data-pipeline; contact: dev@freshguard.example)"
CACHE_DIR = "data/off_cache"
RATE_LIMIT_SECONDS = 1.0  # Respect rate limits


def _get_cached(barcode: str) -> dict | None:
    """Return cached OFF response if available."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_file = os.path.join(CACHE_DIR, f"{barcode}.json")
    if os.path.isfile(cache_file):
        with open(cache_file, "r") as f:
            return json.load(f)
    return None


def _save_cache(barcode: str, data: dict):
    """Cache an OFF API response."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_file = os.path.join(CACHE_DIR, f"{barcode}.json")
    with open(cache_file, "w") as f:
        json.dump(data, f, indent=2)


def _fetch_product(barcode: str) -> dict | None:
    """Fetch product data from Open Food Facts API."""
    # Check cache first
    cached = _get_cached(barcode)
    if cached is not None:
        return cached

    url = f"{OFF_API_BASE}/{barcode}"
    headers = {"User-Agent": USER_AGENT}

    try:
        resp = requests.get(url, headers=headers, timeout=10)
        time.sleep(RATE_LIMIT_SECONDS)  # Rate limiting

        if resp.status_code == 200:
            data = resp.json()
            _save_cache(barcode, data)
            if data.get("status") == 1:
                return data
            else:
                return None
        elif resp.status_code == 404:
            _save_cache(barcode, {"status": 0, "barcode": barcode})
            return None
        else:
            print(f"    WARNING: OFF API returned {resp.status_code} for barcode {barcode}")
            return None

    except requests.RequestException as e:
        print(f"    WARNING: OFF API request failed for {barcode}: {e}")
        return None


def run_enrich(limit: int = 10):
    """
    Enrich products that have barcodes using Open Food Facts.
    Does NOT match M5 product IDs without reliable evidence.
    Only processes products that already have a barcode field set.
    """
    print("=== Open Food Facts Product Enrichment ===")

    try:
        conn = get_db_connection()
    except Exception as e:
        print(f"ERROR: Could not connect to database: {e}")
        sys.exit(1)

    try:
        cur = conn.cursor()

        # Only enrich products that have a barcode and haven't been enriched yet
        cur.execute("""
            SELECT p.id, p.barcode
            FROM products p
            WHERE p.barcode IS NOT NULL
              AND p.barcode != ''
              AND NOT EXISTS (
                  SELECT 1 FROM product_catalog_imports pci
                  WHERE pci.product_id = p.id AND pci.source = 'open_food_facts'
              )
            LIMIT %s
        """, (limit,))

        products = cur.fetchall()

        if not products:
            print("  No products with barcodes available for enrichment.")
            print("  Note: M5 dataset products do not have barcodes.")
            print("  Enrichment requires products with valid barcode fields.")
            return

        print(f"  Found {len(products)} products with barcodes to enrich")
        enriched = 0
        failed = 0

        for product_id, barcode in products:
            print(f"  Fetching OFF data for {barcode} (product: {product_id})...")
            data = _fetch_product(barcode)

            if data and data.get("status") == 1:
                product_data = data.get("product", {})
                off_name = product_data.get("product_name")
                off_brand = product_data.get("brands")
                off_categories = product_data.get("categories")

                # Update product with enriched data — do NOT overwrite prices
                updates = []
                params = []
                if off_name and off_name.strip():
                    updates.append("name = %s")
                    params.append(off_name.strip())
                if off_brand and off_brand.strip():
                    updates.append("brand = %s")
                    params.append(off_brand.strip())

                if updates:
                    params.append(product_id)
                    cur.execute(
                        f"UPDATE products SET {', '.join(updates)} WHERE id = %s",
                        params,
                    )

                # Record the enrichment
                cur.execute("""
                    INSERT INTO product_catalog_imports
                        (product_id, source, external_product_id, source_metadata)
                    VALUES (%s, %s, %s, %s)
                """, (
                    product_id,
                    "open_food_facts",
                    barcode,
                    json.dumps({
                        "product_name": off_name,
                        "brands": off_brand,
                        "categories": off_categories,
                    }),
                ))
                enriched += 1
                print(f"    ✓ Enriched: {off_name or '(no name)'}")
            else:
                # Record the attempted enrichment even if no match
                cur.execute("""
                    INSERT INTO product_catalog_imports
                        (product_id, source, external_product_id, source_metadata)
                    VALUES (%s, %s, %s, %s)
                """, (
                    product_id,
                    "open_food_facts",
                    barcode,
                    json.dumps({"status": "not_found"}),
                ))
                failed += 1
                print(f"    ✗ No match for barcode {barcode}")

        conn.commit()
        print(f"\n  Enriched: {enriched}, No match: {failed}")

    except Exception as e:
        conn.rollback()
        print(f"ERROR during enrichment: {e}")
        raise
    finally:
        conn.close()

    print("=== Enrichment Complete ===")

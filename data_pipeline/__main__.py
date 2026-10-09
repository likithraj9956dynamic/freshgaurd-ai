"""
FreshGuard AI Data Pipeline — CLI Entry Point

Usage:
    python -m data_pipeline validate
    python -m data_pipeline transform
    python -m data_pipeline import-csv
    python -m data_pipeline seed-demo
    python -m data_pipeline enrich
    python -m data_pipeline report
"""
import argparse
import sys


def main():
    parser = argparse.ArgumentParser(
        prog="data_pipeline",
        description="FreshGuard AI — Data Pipeline CLI",
    )
    subparsers = parser.add_subparsers(dest="command", help="Pipeline commands")

    # validate
    val_p = subparsers.add_parser("validate", help="Validate raw M5 CSV files")
    val_p.add_argument("--data-dir", default="data/raw", help="Directory containing M5 CSV files")

    # transform
    tr_p = subparsers.add_parser("transform", help="Transform M5 wide-format to long-format CSVs")
    tr_p.add_argument("--data-dir", default="data/raw", help="Directory containing M5 CSV files")
    tr_p.add_argument("--output-dir", default="data/processed", help="Output directory for processed CSVs")
    tr_p.add_argument("--stores", default=None, help="Comma-separated store IDs (e.g. CA_1,CA_2,CA_3)")
    tr_p.add_argument("--products-per-store", type=int, default=50, help="Max products per store")
    tr_p.add_argument("--history-days", type=int, default=90, help="Number of recent historical days")

    # import-csv
    imp_p = subparsers.add_parser("import-csv", help="Import processed CSVs into Supabase")
    imp_p.add_argument("--data-dir", default="data/processed", help="Directory with processed CSVs")
    imp_p.add_argument("--batch-size", type=int, default=500, help="Rows per batch insert")

    # seed-demo
    seed_p = subparsers.add_parser("seed-demo", help="Seed demo operational data (inventory, POs, wastage)")
    seed_p.add_argument("--store-id", default="STORE_17", help="Demo store ID")

    # enrich
    enrich_p = subparsers.add_parser("enrich", help="Enrich products via Open Food Facts API")
    enrich_p.add_argument("--limit", type=int, default=10, help="Max products to attempt enrichment")

    # report
    subparsers.add_parser("report", help="Generate data import report")

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
        sys.exit(1)

    if args.command == "validate":
        from data_pipeline.validate import run_validate
        run_validate(args.data_dir)

    elif args.command == "transform":
        from data_pipeline.transform import run_transform
        run_transform(
            data_dir=args.data_dir,
            output_dir=args.output_dir,
            store_ids=args.stores.split(",") if args.stores else None,
            products_per_store=args.products_per_store,
            history_days=args.history_days,
        )

    elif args.command == "import-csv":
        from data_pipeline.import_data import run_import
        run_import(data_dir=args.data_dir, batch_size=args.batch_size)

    elif args.command == "seed-demo":
        from data_pipeline.seed_demo import run_seed_demo
        run_seed_demo(store_id=args.store_id)

    elif args.command == "enrich":
        from data_pipeline.enrich import run_enrich
        run_enrich(limit=args.limit)

    elif args.command == "report":
        from data_pipeline.report import run_report
        run_report()


if __name__ == "__main__":
    main()

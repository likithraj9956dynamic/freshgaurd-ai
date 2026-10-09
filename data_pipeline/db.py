"""
Shared database connection utilities for the data pipeline.
Uses psycopg2 for direct PostgreSQL access (server-side only).
"""
import os
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    """Return a psycopg2 connection using environment variables."""
    import psycopg2
    return psycopg2.connect(
        host=os.getenv("SUPABASE_DB_HOST"),
        port=int(os.getenv("SUPABASE_DB_PORT", "5432")),
        dbname=os.getenv("SUPABASE_DB_NAME", "postgres"),
        user=os.getenv("SUPABASE_DB_USER", "postgres"),
        password=os.getenv("SUPABASE_DB_PASSWORD"),
        sslmode="require",
    )


def get_supabase_client():
    """Return a Supabase client for REST API operations."""
    from supabase import create_client
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise EnvironmentError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
        )
    return create_client(url, key)

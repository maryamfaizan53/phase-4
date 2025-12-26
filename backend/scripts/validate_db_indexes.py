#!/usr/bin/env python3
"""
Database Index Validation Script
Phase 9 T085

Validates that all required indexes exist in the database as specified in data-model.md.
Exits with code 0 if all indexes exist, 1 if any are missing.
"""

import os
import sys
from sqlmodel import create_engine, Session, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in environment")
    sys.exit(1)

# Create database engine
engine = create_engine(DATABASE_URL)

# Required indexes as specified in data-model.md
REQUIRED_INDEXES = {
    # Tasks indexes (Phase 9 T085 requirements)
    "idx_tasks_user_id": {
        "table": "tasks",
        "columns": "user_id",
        "sql": "CREATE INDEX idx_tasks_user_id ON tasks(user_id);"
    },
    "idx_tasks_status": {
        "table": "tasks",
        "columns": "status",
        "sql": "CREATE INDEX idx_tasks_status ON tasks(status);"
    },
    "idx_tasks_created_at": {
        "table": "tasks",
        "columns": "created_at DESC",
        "sql": "CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);"
    },
    "idx_tasks_user_status": {
        "table": "tasks",
        "columns": "user_id, status",
        "sql": "CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);"
    },

    # Conversations indexes (Phase 9 T085 requirements)
    "idx_conversations_user_id": {
        "table": "conversations",
        "columns": "user_id",
        "sql": "CREATE INDEX idx_conversations_user_id ON conversations(user_id);"
    },

    # Messages indexes (Phase 9 T085 requirements)
    "idx_messages_conversation_id": {
        "table": "messages",
        "columns": "conversation_id",
        "sql": "CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);"
    },
    "idx_messages_conversation_created": {
        "table": "messages",
        "columns": "conversation_id, created_at",
        "sql": "CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC);"
    },

    # Additional indexes from data-model.md (for completeness)
    "idx_users_created_at": {
        "table": "users",
        "columns": "created_at",
        "sql": "CREATE INDEX idx_users_created_at ON users(created_at);"
    },
    "idx_conversations_last_activity": {
        "table": "conversations",
        "columns": "last_activity_at DESC",
        "sql": "CREATE INDEX idx_conversations_last_activity ON conversations(last_activity_at DESC);"
    },
    "idx_conversations_user_active": {
        "table": "conversations",
        "columns": "user_id, is_active",
        "sql": "CREATE INDEX idx_conversations_user_active ON conversations(user_id, is_active);"
    },
    "idx_messages_user_id": {
        "table": "messages",
        "columns": "user_id",
        "sql": "CREATE INDEX idx_messages_user_id ON messages(user_id);"
    },
    "idx_messages_created_at": {
        "table": "messages",
        "columns": "created_at DESC",
        "sql": "CREATE INDEX idx_messages_created_at ON messages(created_at DESC);"
    },
}


def validate_indexes():
    """
    Validate that all required indexes exist in the database.

    Returns:
        int: 0 if all indexes exist, 1 if any are missing
    """
    print("=" * 70)
    print("Database Index Validation Report")
    print("=" * 70)
    print()

    try:
        with Session(engine) as session:
            # Query existing indexes from PostgreSQL system catalog
            result = session.exec(text("""
                SELECT indexname, tablename
                FROM pg_indexes
                WHERE schemaname = 'public'
                ORDER BY tablename, indexname
            """))

            # Build dictionary of existing indexes
            existing_indexes = {row[0]: row[1] for row in result}

            print(f"Found {len(existing_indexes)} indexes in database")
            print()

            # Check each required index
            missing_indexes = []
            present_indexes = []

            for idx_name, idx_info in REQUIRED_INDEXES.items():
                table_name = idx_info["table"]
                columns = idx_info["columns"]

                if idx_name in existing_indexes:
                    if existing_indexes[idx_name] == table_name:
                        present_indexes.append((idx_name, table_name, columns))
                        print(f"[OK] {idx_name:<40} ON {table_name}({columns})")
                    else:
                        # Index exists but on wrong table (shouldn't happen)
                        missing_indexes.append((idx_name, table_name, columns, idx_info["sql"]))
                        print(f"[FAIL] {idx_name:<40} WRONG TABLE (expected {table_name}, found {existing_indexes[idx_name]})")
                else:
                    missing_indexes.append((idx_name, table_name, columns, idx_info["sql"]))
                    print(f"[MISSING] {idx_name:<40} on {table_name}({columns})")

            # Report summary
            print()
            print("=" * 70)
            print("Summary")
            print("=" * 70)
            print(f"Total required indexes: {len(REQUIRED_INDEXES)}")
            print(f"Present: {len(present_indexes)}")
            print(f"Missing: {len(missing_indexes)}")
            print()

            # If there are missing indexes, provide SQL commands
            if missing_indexes:
                print("=" * 70)
                print("SQL Commands to Create Missing Indexes")
                print("=" * 70)
                print()
                for idx_name, table_name, columns, sql in missing_indexes:
                    print(f"-- {idx_name} on {table_name}({columns})")
                    print(sql)
                    print()

                print("=" * 70)
                print("VALIDATION FAILED: Some indexes are missing")
                print("=" * 70)
                return 1
            else:
                print("=" * 70)
                print("VALIDATION PASSED: All required indexes exist")
                print("=" * 70)
                return 0

    except Exception as e:
        print(f"Error connecting to database or querying indexes: {e}")
        print()
        print("Please ensure:")
        print("  1. DATABASE_URL is correctly set in .env")
        print("  2. Database is running and accessible")
        print("  3. You have SELECT permissions on pg_indexes")
        return 1


if __name__ == "__main__":
    exit_code = validate_indexes()
    sys.exit(exit_code)

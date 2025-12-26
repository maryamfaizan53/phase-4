# Backend Scripts

This directory contains utility scripts for database management and validation.

## validate_db_indexes.py

**Purpose**: Validates that all required database indexes exist as specified in `data-model.md`.

**Usage**:
```bash
python scripts/validate_db_indexes.py
```

**Requirements**:
- DATABASE_URL must be set in `.env` file
- Database must be accessible
- `sqlmodel` and `python-dotenv` packages must be installed

**Exit Codes**:
- `0`: All required indexes exist
- `1`: Some indexes are missing or error occurred

**Output**:
- Lists each required index with status ([OK] or [MISSING])
- Provides summary statistics
- If indexes are missing, displays SQL commands to create them

**Validated Indexes** (Phase 9 T085):

### Tasks Table
- `idx_tasks_user_id` - ON tasks(user_id)
- `idx_tasks_status` - ON tasks(status)
- `idx_tasks_created_at` - ON tasks(created_at DESC)
- `idx_tasks_user_status` - ON tasks(user_id, status)

### Conversations Table
- `idx_conversations_user_id` - ON conversations(user_id)
- `idx_conversations_last_activity` - ON conversations(last_activity_at DESC)
- `idx_conversations_user_active` - ON conversations(user_id, is_active)

### Messages Table
- `idx_messages_conversation_id` - ON messages(conversation_id)
- `idx_messages_conversation_created` - ON messages(conversation_id, created_at DESC)
- `idx_messages_user_id` - ON messages(user_id)
- `idx_messages_created_at` - ON messages(created_at DESC)

### Users Table
- `idx_users_created_at` - ON users(created_at)

**Example Output**:
```
======================================================================
Database Index Validation Report
======================================================================

Found 18 indexes in database

[OK] idx_tasks_user_id                        ON tasks(user_id)
[OK] idx_tasks_status                         ON tasks(status)
...

======================================================================
Summary
======================================================================
Total required indexes: 12
Present: 12
Missing: 0

======================================================================
VALIDATION PASSED: All required indexes exist
======================================================================
```

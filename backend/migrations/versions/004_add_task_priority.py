"""add task priority

Revision ID: 004
Revises: 003
Create Date: 2025-12-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '004'
down_revision: Union[str, None] = '003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add priority column to tasks table with CHECK constraint and index"""

    # Add priority column with default value
    # Using server_default to apply default at database level for existing rows
    op.add_column(
        'tasks',
        sa.Column(
            'priority',
            sa.String(length=20),
            nullable=True,
            server_default='medium'
        )
    )

    # Backfill existing tasks with 'medium' priority (explicit for clarity)
    # This ensures all existing tasks have the default value
    op.execute("""
        UPDATE tasks
        SET priority = 'medium'
        WHERE priority IS NULL
    """)

    # Make column non-nullable now that all rows have values
    # Remove server_default so new rows use application-level default
    op.alter_column(
        'tasks',
        'priority',
        nullable=False,
        server_default=None
    )

    # Add CHECK constraint to enforce valid priority values
    # Ensures data integrity at database level
    op.create_check_constraint(
        'chk_priority',
        'tasks',
        "priority IN ('low', 'medium', 'high', 'urgent')"
    )

    # Create index on priority column for query performance
    # Optimizes filtering queries: WHERE priority = ?
    # Expected to keep query time < 500ms with 10k tasks per user (SC-008)
    op.create_index(
        'idx_tasks_priority',
        'tasks',
        ['priority']
    )

    # Create composite index for user + priority filtering
    # Optimizes queries: WHERE user_id = ? AND priority = ?
    # Common pattern in dashboard priority filters
    op.create_index(
        'idx_tasks_user_priority',
        'tasks',
        ['user_id', 'priority']
    )


def downgrade() -> None:
    """Remove priority column and related indexes"""

    # Drop indexes first (dependent on column)
    op.drop_index('idx_tasks_user_priority', table_name='tasks')
    op.drop_index('idx_tasks_priority', table_name='tasks')

    # Drop CHECK constraint
    op.drop_constraint('chk_priority', 'tasks', type_='check')

    # Drop priority column
    op.drop_column('tasks', 'priority')

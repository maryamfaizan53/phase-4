"""add user auth fields

Revision ID: 002
Revises: 001
Create Date: 2025-12-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add email, password_hash, full_name, is_active, and updated_at to users table"""

    # Add new columns to users table
    op.add_column('users', sa.Column('email', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('password_hash', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('full_name', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=True, server_default='true'))
    op.add_column('users', sa.Column('updated_at', sa.DateTime(), nullable=True))

    # Create unique index on email
    op.create_index('idx_users_email', 'users', ['email'], unique=True)

    # For existing users, set default values
    op.execute("""
        UPDATE users
        SET
            email = user_id || '@placeholder.local',
            password_hash = 'placeholder',
            is_active = true,
            updated_at = created_at
        WHERE email IS NULL
    """)

    # Now make columns non-nullable (after setting defaults)
    op.alter_column('users', 'email', nullable=False)
    op.alter_column('users', 'password_hash', nullable=False)
    op.alter_column('users', 'is_active', nullable=False, server_default=None)
    op.alter_column('users', 'updated_at', nullable=False)


def downgrade() -> None:
    """Remove auth fields from users table"""

    op.drop_index('idx_users_email', table_name='users')
    op.drop_column('users', 'updated_at')
    op.drop_column('users', 'is_active')
    op.drop_column('users', 'full_name')
    op.drop_column('users', 'password_hash')
    op.drop_column('users', 'email')

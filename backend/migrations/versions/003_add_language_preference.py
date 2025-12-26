"""add language preference to users

Revision ID: 003
Revises: 002
Create Date: 2025-12-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '003'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add language_preference column to users table"""

    op.add_column('users', sa.Column('language_preference', sa.String(length=10), nullable=True, server_default='en'))
    
    # Set default for existing users
    op.execute("""
        UPDATE users
        SET language_preference = 'en'
        WHERE language_preference IS NULL
    """)
    
    # Make non-nullable
    op.alter_column('users', 'language_preference', nullable=False, server_default=None)


def downgrade() -> None:
    """Remove language_preference column from users table"""

    op.drop_column('users', 'language_preference')


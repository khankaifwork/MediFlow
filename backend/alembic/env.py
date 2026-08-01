from logging.config import fileConfig
import os

from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool

from alembic import context

# Load .env
load_dotenv()

# Alembic Config object
config = context.config

# Read database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Configure logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import Base and all models
from app.database.database import Base

from app.models.user import User
from app.models.medicine import Medicine
from app.models.customer import Customer
from app.models.supplier import Supplier
from app.models.purchase import Purchase
from app.models.sale import Sale
from app.models.sale_item import SaleItem

# Metadata for Alembic
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in offline mode."""

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in online mode."""

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
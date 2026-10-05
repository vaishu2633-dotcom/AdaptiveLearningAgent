import logging
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")

Base = declarative_base()


def get_engine():
    db_url = settings.DATABASE_URL

    if db_url and db_url.startswith("postgres"):
        try:
            # Attempt to initialize PostgreSQL engine with pool pre-ping
            engine = create_engine(db_url, pool_pre_ping=True)
            # Test connection
            with engine.connect() as conn:
                pass
            logger.info("Connected successfully to PostgreSQL database.")
            return engine
        except Exception as e:
            logger.warning(
                f"PostgreSQL connection to {db_url} failed ({e}). "
                "Falling back to local SQLite database for development/testing."
            )

    # SQLite fallback
    sqlite_url = "sqlite:///./adaptive_learning.db"
    return create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False},
    )


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a transactional database session per request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all database tables on startup if they do not exist."""
    import app.models.models  # Ensure models are registered with Base metadata
    Base.metadata.create_all(bind=engine)

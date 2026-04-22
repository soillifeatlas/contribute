from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from .config import get_settings
from .models import Base


_engine = None
_SessionLocal: async_sessionmaker[AsyncSession] | None = None


def get_engine():
    global _engine, _SessionLocal
    if _engine is None:
        settings = get_settings()
        url = f"sqlite+aiosqlite:///{settings.db_path}"
        _engine = create_async_engine(url, echo=False, future=True)
        _SessionLocal = async_sessionmaker(_engine, expire_on_commit=False, class_=AsyncSession)
    return _engine


async def init_db() -> None:
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@asynccontextmanager
async def session_scope() -> AsyncIterator[AsyncSession]:
    get_engine()
    assert _SessionLocal is not None
    async with _SessionLocal() as s:
        yield s


def reset_engine_cache() -> None:
    """Test helper: reset module-level engine so the next `get_engine` call re-reads settings."""
    global _engine, _SessionLocal
    if _engine is not None:
        pass  # async engines cannot be synchronously disposed; rely on process teardown in tests
    _engine = None
    _SessionLocal = None

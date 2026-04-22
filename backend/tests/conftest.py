import os
import tempfile

import pytest
from httpx import ASGITransport, AsyncClient


@pytest.fixture
def temp_db(monkeypatch):
    with tempfile.NamedTemporaryFile(suffix=".sqlite", delete=False) as f:
        path = f.name
    monkeypatch.setenv("DB_PATH", path)
    from app.config import get_settings
    get_settings.cache_clear()
    from app.db import reset_engine_cache
    reset_engine_cache()
    yield path
    try:
        os.unlink(path)
    except FileNotFoundError:
        pass


@pytest.fixture
async def client(temp_db):
    from app.main import create_app
    app = create_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        async with app.router.lifespan_context(app):
            yield c

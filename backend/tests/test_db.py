import pytest

from app.db import init_db, session_scope
from app.models import Submission


@pytest.mark.asyncio
async def test_init_and_insert(temp_db):
    await init_db()
    async with session_scope() as s:
        sub = Submission(
            id="SLA-contrib-2026-0001", year=2026, sequence=1,
            tier="T1", taxon_slug="bacteria", institution="Test U",
            payload_json={}
        )
        s.add(sub)
        await s.commit()
    async with session_scope() as s:
        from sqlalchemy import select
        out = (await s.execute(select(Submission))).scalars().all()
        assert len(out) == 1
        assert out[0].id == "SLA-contrib-2026-0001"

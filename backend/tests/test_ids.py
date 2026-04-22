import pytest
from datetime import datetime

from app.db import init_db, session_scope
from app.ids import next_submission_id
from app.models import Submission


@pytest.mark.asyncio
async def test_sequence_starts_at_1(temp_db):
    await init_db()
    async with session_scope() as s:
        sid, year, seq = await next_submission_id(s, now=datetime(2026, 1, 1))
    assert sid == "SLA-contrib-2026-0001"
    assert seq == 1


@pytest.mark.asyncio
async def test_sequence_increments(temp_db):
    await init_db()
    async with session_scope() as s:
        sid1, y1, sq1 = await next_submission_id(s, now=datetime(2026, 5, 1))
        s.add(Submission(id=sid1, year=y1, sequence=sq1, tier="T1", taxon_slug="bacteria", institution="U", payload_json={}))
        await s.commit()
        sid2, y2, sq2 = await next_submission_id(s, now=datetime(2026, 6, 1))
    assert sq2 == sq1 + 1


@pytest.mark.asyncio
async def test_year_rollover(temp_db):
    await init_db()
    async with session_scope() as s:
        sid1, y1, sq1 = await next_submission_id(s, now=datetime(2026, 12, 1))
        s.add(Submission(id=sid1, year=y1, sequence=sq1, tier="T1", taxon_slug="bacteria", institution="U", payload_json={}))
        await s.commit()
        sid2, y2, sq2 = await next_submission_id(s, now=datetime(2027, 1, 1))
    assert sq1 == 1
    assert sq2 == 1
    assert y2 == 2027

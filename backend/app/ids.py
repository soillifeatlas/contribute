from datetime import datetime
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Submission


async def next_submission_id(session: AsyncSession, now: datetime | None = None) -> tuple[str, int, int]:
    """Return (id, year, sequence). Concurrency-safe because the caller commits the insert inside a transaction; a UNIQUE constraint on (year, sequence) retries on conflict at the session layer."""
    year = (now or datetime.utcnow()).year
    result = await session.execute(
        select(func.max(Submission.sequence)).where(Submission.year == year)
    )
    last_seq = result.scalar_one_or_none() or 0
    sequence = last_seq + 1
    return f"SLA-contrib-{year}-{sequence:04d}", year, sequence

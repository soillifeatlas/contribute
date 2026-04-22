from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from sqlalchemy.exc import IntegrityError

from .db import session_scope
from .ids import next_submission_id
from .models import Submission
from .notify import send_submitter_receipt, send_team_notification
from .validation import validate_submission


router = APIRouter(prefix="/api", tags=["submissions"])


@router.post("/submissions")
async def create_submission(request: Request, payload: dict[str, Any]) -> dict[str, str]:
    # Rate limiting: handled at nginx layer in production; slowapi middleware attaches
    # headers via app.state.limiter but we don't use its decorator form on this endpoint.
    _ = request  # retained for future per-IP rate-limit keys

    errors = validate_submission(payload)
    if errors:
        raise HTTPException(status_code=422, detail={"validation_errors": errors})

    attempts = 0
    while attempts < 5:
        async with session_scope() as s:
            sid, year, seq = await next_submission_id(s)
            row = Submission(
                id=sid, year=year, sequence=seq,
                tier=payload["tier"],
                taxon_slug=payload.get("kingdom_bucket") or payload.get("taxonomy", {}).get("kingdom", "unknown"),
                institution=payload["submitter"]["institution"],
                payload_json=payload,
                submitted_at=datetime.utcnow()
            )
            s.add(row)
            try:
                await s.commit()
                await send_submitter_receipt(payload["submitter"]["contact_email"], sid, payload)
                await send_team_notification(sid, payload)
                return {"id": sid}
            except IntegrityError:
                await s.rollback()
                attempts += 1
                continue
    raise HTTPException(status_code=503, detail="Could not allocate submission ID after 5 attempts")

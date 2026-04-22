import secrets
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from sqlalchemy import select

from .db import session_scope
from .models import Draft
from .notify import send_magic_link


router = APIRouter(prefix="/api", tags=["drafts"])

DRAFT_TTL_DAYS = 60


@router.post("/drafts")
async def create_or_update_draft(request: Request, payload: dict[str, Any]) -> dict[str, str | int]:
    email = None
    submitter = payload.get("submitter")
    if isinstance(submitter, dict):
        email = submitter.get("contact_email")
    if not email:
        raise HTTPException(status_code=400, detail="contact_email required to save server-side draft")

    token = secrets.token_urlsafe(32)
    now = datetime.utcnow()
    async with session_scope() as s:
        draft = Draft(
            token=token, email=email, state_json=payload,
            created_at=now, last_touch_at=now,
            expires_at=now + timedelta(days=DRAFT_TTL_DAYS)
        )
        s.add(draft)
        await s.commit()
    await send_magic_link(email, token)
    return {"token": token, "expires_in_days": DRAFT_TTL_DAYS}


@router.get("/drafts/{token}")
async def get_draft(token: str) -> dict[str, Any]:
    async with session_scope() as s:
        row = (await s.execute(select(Draft).where(Draft.token == token))).scalar_one_or_none()
        if row is None or row.expires_at < datetime.utcnow():
            raise HTTPException(status_code=404, detail="Draft not found or expired")
        row.last_touch_at = datetime.utcnow()
        await s.commit()
        return {"state": row.state_json, "expires_at": row.expires_at.isoformat()}

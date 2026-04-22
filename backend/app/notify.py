import json
from email.message import EmailMessage
from pathlib import Path
from typing import Any

import aiosmtplib
from jinja2 import Environment, FileSystemLoader, select_autoescape

from .config import get_settings


_env = Environment(
    loader=FileSystemLoader(Path(__file__).parent / "templates"),
    autoescape=select_autoescape()
)


async def _send(to: str, subject: str, body: str, attach_json: dict[str, Any] | None = None) -> None:
    settings = get_settings()
    msg = EmailMessage()
    msg["From"] = settings.smtp_from
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)
    if attach_json is not None:
        msg.add_attachment(
            json.dumps(attach_json, indent=2).encode(),
            maintype="application", subtype="json",
            filename="submission.json"
        )
    if not settings.smtp_host or not settings.smtp_user:
        # Dev mode — no SMTP configured; skip silently
        return
    await aiosmtplib.send(
        msg,
        hostname=settings.smtp_host, port=settings.smtp_port,
        username=settings.smtp_user, password=settings.smtp_password,
        start_tls=True
    )


async def send_submitter_receipt(to: str, submission_id: str, payload: dict[str, Any]) -> None:
    body = _env.get_template("submitter_receipt.txt.j2").render(
        submission_id=submission_id, tier=payload["tier"],
        submitter=payload["submitter"], taxonomy=payload["taxonomy"],
        base_url=get_settings().base_url
    )
    await _send(to, f"Contribution received — {submission_id}", body, attach_json=payload)


async def send_team_notification(submission_id: str, payload: dict[str, Any]) -> None:
    settings = get_settings()
    from datetime import datetime
    body = _env.get_template("team_notification.txt.j2").render(
        submission_id=submission_id, tier=payload["tier"],
        submitter=payload["submitter"], taxonomy=payload["taxonomy"],
        submitted_at=datetime.utcnow().isoformat()
    )
    body += "\n\n" + json.dumps(payload, indent=2)
    await _send(settings.team_notify_email, f"[contribute] {submission_id}", body)


async def send_magic_link(email: str, token: str) -> None:
    settings = get_settings()
    body = _env.get_template("magic_link.txt.j2").render(
        base_url=settings.base_url, token=token, ttl_days=60
    )
    await _send(email, "Your contribution draft — recovery link", body)

import pytest
from unittest.mock import patch

from app.notify import send_submitter_receipt


@pytest.mark.asyncio
async def test_template_renders_and_no_smtp_in_dev(monkeypatch):
    monkeypatch.setenv("SMTP_HOST", "")
    from app.config import get_settings
    get_settings.cache_clear()

    called = {"n": 0}

    async def fake_send(*a, **k):
        called["n"] += 1

    with patch("aiosmtplib.send", fake_send):
        await send_submitter_receipt("test@example.org", "SLA-contrib-2026-0001", {
            "tier": "T1",
            "submitter": {"pi_name": "J", "institution": "U", "contact_email": "test@example.org"},
            "taxonomy": {"kingdom": "Bacteria", "species": "capsulatum"}
        })
    assert called["n"] == 0  # dev mode short-circuits

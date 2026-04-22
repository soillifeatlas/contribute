import pytest


@pytest.mark.asyncio
async def test_create_and_fetch_draft(client):
    payload = {"submitter": {"contact_email": "jane@example.org"}, "step": 3, "tier": "T1"}
    r = await client.post("/api/drafts", json=payload)
    assert r.status_code == 200
    token = r.json()["token"]
    r2 = await client.get(f"/api/drafts/{token}")
    assert r2.status_code == 200
    assert r2.json()["state"]["tier"] == "T1"


@pytest.mark.asyncio
async def test_missing_email_fails(client):
    r = await client.post("/api/drafts", json={"step": 2})
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_unknown_token_404(client):
    r = await client.get("/api/drafts/not-a-real-token")
    assert r.status_code == 404

import json
from pathlib import Path

import pytest


FIXTURES = Path(__file__).parent.parent.parent / "schemas" / "tests" / "fixtures"


@pytest.mark.asyncio
async def test_valid_t1_returns_id(client):
    payload = json.loads((FIXTURES / "valid-t1-bacteria.json").read_text())
    r = await client.post("/api/submissions", json=payload)
    assert r.status_code == 200
    body = r.json()
    assert body["id"].startswith("SLA-contrib-")


@pytest.mark.asyncio
async def test_invalid_returns_422(client):
    payload = json.loads((FIXTURES / "invalid-t2-no-is.json").read_text())
    r = await client.post("/api/submissions", json=payload)
    assert r.status_code == 422
    assert "validation_errors" in r.json()["detail"]


@pytest.mark.asyncio
async def test_two_submissions_increment(client):
    p1 = json.loads((FIXTURES / "valid-t1-bacteria.json").read_text())
    p2 = json.loads((FIXTURES / "valid-t2-fungi.json").read_text())
    r1 = await client.post("/api/submissions", json=p1)
    r2 = await client.post("/api/submissions", json=p2)
    assert r1.json()["id"] != r2.json()["id"]
    s1 = int(r1.json()["id"].split("-")[-1])
    s2 = int(r2.json()["id"].split("-")[-1])
    assert s2 == s1 + 1

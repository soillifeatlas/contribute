import json
from pathlib import Path

import pytest

from app.validation import validate_submission, load_schema, get_validator


FIXTURES = Path(__file__).parent.parent.parent / "schemas" / "tests" / "fixtures"


@pytest.fixture(autouse=True)
def _clear_caches():
    load_schema.cache_clear()
    get_validator.cache_clear()
    yield


def test_valid_t1_passes():
    payload = json.loads((FIXTURES / "valid-t1-bacteria.json").read_text())
    assert validate_submission(payload) == []


def test_valid_t2_passes():
    payload = json.loads((FIXTURES / "valid-t2-fungi.json").read_text())
    assert validate_submission(payload) == []


def test_t2_without_is_fails():
    payload = json.loads((FIXTURES / "invalid-t2-no-is.json").read_text())
    errors = validate_submission(payload)
    assert any("internal_standard" in e for e in errors)

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator

from .config import get_settings


@lru_cache(maxsize=1)
def load_schema() -> dict[str, Any]:
    settings = get_settings()
    return json.loads(Path(settings.schema_path).read_text())


@lru_cache(maxsize=1)
def get_validator() -> Draft202012Validator:
    return Draft202012Validator(load_schema())


def validate_submission(payload: dict[str, Any]) -> list[str]:
    v = get_validator()
    return [
        f"{'.'.join(str(p) for p in e.absolute_path) or '<root>'}: {e.message}"
        for e in sorted(v.iter_errors(payload), key=lambda e: list(e.absolute_path))
    ]

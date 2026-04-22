from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    db_path: str = "./contribute.sqlite"
    schema_path: str = "../schemas/submission.schema.json"
    cors_origins: list[str] = ["https://soillifeatlas.org", "http://localhost:4321"]
    rate_limit_submissions: str = "10/hour"
    rate_limit_drafts: str = "60/hour"
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "contribute@soillifeatlas.org"
    team_notify_email: str = "rahul.samrat@univie.ac.at"
    base_url: str = "https://soillifeatlas.org"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

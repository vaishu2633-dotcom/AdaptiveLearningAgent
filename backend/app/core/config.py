import json
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "Adaptive Learning Path Agent"
    API_V1_STR: str = "/api/v1"

    # Database Configuration
    DATABASE_URL: Optional[str] = None

    # CORS settings - allows Expo mobile & web dev servers
    CORS_ORIGINS: List[str] = [
        "http://localhost:8081",
        "http://localhost:19006",
        "http://localhost:8080",
        "http://127.0.0.1:8081",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str):
            return json.loads(v)
        return v

    # Future AI / Agent Infrastructure
    OPENAI_API_KEY: Optional[str] = None
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()

import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # API Keys & Third Party Tokens
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    DISCORD_BOT_TOKEN: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    TOGETHER_API_KEY: Optional[str] = None

    # Vector & Cache Database
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: Optional[str] = None
    REDIS_URL: str = "redis://localhost:6379/0"

    # Gmail & Pub/Sub
    GMAIL_OAUTH_CREDENTIALS: Optional[str] = None
    GMAIL_PUBSUB_TOPIC: Optional[str] = None

    # Server configurations
    WEBHOOK_BASE_URL: str = "http://localhost:8000"

    # User Preferences
    FORMALITY_LEVEL: int = 3  # Scale from 1 (casual) to 5 (professional)
    REPLY_DELAY_MIN: int = 30  # in seconds
    REPLY_DELAY_MAX: int = 120  # in seconds

    model_config = SettingsConfigDict(
        env_file=os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"
        ),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

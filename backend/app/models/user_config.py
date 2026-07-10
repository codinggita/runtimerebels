from pydantic import BaseModel, Field
from typing import List, Dict, Any


class UserConfig(BaseModel):
    name: str = "User"
    formality_level: int = Field(default=3, ge=1, le=5)
    reply_delay_min: int = 30
    reply_delay_max: int = 120
    active_platforms: List[str] = Field(
        default_factory=lambda: ["telegram", "discord", "gmail"]
    )
    identity_facts: Dict[str, Any] = Field(default_factory=dict)

from pydantic import BaseModel, Field
from typing import Literal, Dict, Any, List, Optional
from datetime import datetime


class IncomingMessage(BaseModel):
    platform: Literal["telegram", "discord", "gmail"]
    sender_id: str
    sender_name: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class OutgoingMessage(BaseModel):
    platform: Literal["telegram", "discord", "gmail"]
    recipient_id: str
    content: str
    delay_seconds: float = 0.0
    bubble_splits: List[str] = Field(default_factory=list)


class ClassificationResult(BaseModel):
    route: Literal["factual", "vibe", "unknown"]
    confidence: float

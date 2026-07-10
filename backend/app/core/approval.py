import os
import json
import uuid
import time
import logging
from typing import List, Dict, Any, Optional
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)

APPROVALS_FILE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "approvals.json",
)


class ApprovalManager:
    """Manages the pending approval queue for low-confidence autopilot replies."""

    def __init__(self):
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        os.makedirs(os.path.dirname(APPROVALS_FILE_PATH), exist_ok=True)
        if not os.path.exists(APPROVALS_FILE_PATH):
            with open(APPROVALS_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump([], f)

    def load_queue(self) -> List[Dict[str, Any]]:
        """Loads all pending approvals from JSON file."""
        self._ensure_file_exists()
        try:
            with open(APPROVALS_FILE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load approvals.json: {e}")
            return []

    def save_queue(self, queue: List[Dict[str, Any]]):
        """Saves queue list to JSON file."""
        try:
            with open(APPROVALS_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump(queue, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save approvals.json: {e}")

    def add_to_queue(
        self,
        platform: str,
        sender_id: str,
        sender_name: str,
        query: str,
        ai_reply: str,
        confidence: float,
    ) -> str:
        """Adds a message item to the pending approvals queue."""
        queue = self.load_queue()
        item_id = f"appr_{uuid.uuid4().hex[:8]}"

        new_item = {
            "id": item_id,
            "platform": platform,
            "sender_id": sender_id,
            "sender": sender_name,
            "query": query,
            "ai_reply": ai_reply,
            "confidence": confidence,
            "timestamp": "Just now",
            "created_at": time.time(),
        }

        queue.append(new_item)
        self.save_queue(queue)
        logger.info(
            f"Added low-confidence reply ({item_id}) to approval queue. Confidence: {confidence:.2f}"
        )
        return item_id

    def remove_from_queue(self, item_id: str) -> Optional[Dict[str, Any]]:
        """Removes and returns an item from the queue."""
        queue = self.load_queue()
        match = next((x for x in queue if x["id"] == item_id), None)
        if match:
            queue = [x for x in queue if x["id"] != item_id]
            self.save_queue(queue)
            logger.info(f"Removed item {item_id} from approval queue.")
        return match


# Singleton instance of approval manager
approval_manager = ApprovalManager()

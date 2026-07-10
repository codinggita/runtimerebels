import unittest
import os
from app.core.approval import approval_manager, APPROVALS_FILE_PATH


class TestApprovalManager(unittest.TestCase):

    def setUp(self):
        # Backup existing queue file if any
        self.backup_exists = os.path.exists(APPROVALS_FILE_PATH)
        self.backup_data = []
        if self.backup_exists:
            try:
                with open(APPROVALS_FILE_PATH, "r", encoding="utf-8") as f:
                    self.backup_data = f.read()
            except Exception:
                pass
        # Reset queue for clean testing
        approval_manager.save_queue([])

    def tearDown(self):
        # Restore backup
        if self.backup_exists:
            try:
                with open(APPROVALS_FILE_PATH, "w", encoding="utf-8") as f:
                    f.write(self.backup_data)
            except Exception:
                pass
        elif os.path.exists(APPROVALS_FILE_PATH):
            os.remove(APPROVALS_FILE_PATH)

    def test_add_and_remove_from_queue(self):
        # 1. Add to queue
        item_id = approval_manager.add_to_queue(
            platform="telegram",
            sender_id="7788",
            sender_name="John",
            query="Who are you?",
            ai_reply="I am Nitish clone",
            confidence=0.45,
        )

        self.assertTrue(item_id.startswith("appr_"))

        # Load queue and verify
        queue = approval_manager.load_queue()
        self.assertEqual(len(queue), 1)
        self.assertEqual(queue[0]["id"], item_id)
        self.assertEqual(queue[0]["sender"], "John")
        self.assertEqual(queue[0]["confidence"], 0.45)

        # 2. Remove from queue
        removed_item = approval_manager.remove_from_queue(item_id)
        self.assertIsNotNone(removed_item)
        self.assertEqual(removed_item["id"], item_id)

        # Queue should be empty now
        queue_after = approval_manager.load_queue()
        self.assertEqual(len(queue_after), 0)


if __name__ == "__main__":
    unittest.main()

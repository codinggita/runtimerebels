import unittest
import base64
import json
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.api.routes import app


class TestGmailWebhook(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    @patch("app.api.webhooks.email.process_message_task.delay")
    @patch("app.api.webhooks.email.get_new_emails")
    def test_webhook_receives_pubsub_and_queues(
        self, mock_get_emails, mock_celery_delay
    ):
        # Mock get_new_emails to return one message
        mock_get_emails.return_value = [
            {
                "message_id": "msg123",
                "from": "friend@example.com",
                "subject": "Hey",
                "content": "What are you doing?",
            }
        ]

        # Pub/Sub payload data must be base64 encoded
        pubsub_data = json.dumps(
            {"emailAddress": "me@example.com", "historyId": "998877"}
        )
        b64_data = base64.b64encode(pubsub_data.encode("utf-8")).decode("utf-8")

        payload = {"message": {"data": b64_data, "messageId": "pubsub_msg_1"}}

        response = self.client.post("/webhook/email", json=payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(), {"status": "queued", "processed_count": 1}
        )

        # Assert correct calls
        mock_get_emails.assert_called_once_with("998877")
        mock_celery_delay.assert_called_once_with(
            {
                "platform": "gmail",
                "sender_id": "friend@example.com",
                "sender_name": "friend@example.com",
                "content": "What are you doing?",
            }
        )

    def test_webhook_ignores_no_data(self):
        payload = {"message": {"messageId": "pubsub_msg_2"}}  # No 'data' field

        response = self.client.post("/webhook/email", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ignored"})


if __name__ == "__main__":
    unittest.main()

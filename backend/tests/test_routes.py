import unittest
from fastapi.testclient import TestClient
from app.api.routes import app


from app.core.approval import approval_manager

class TestDashboardRoutes(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        # Seed approval queue with test values
        approval_manager.save_queue([
            {
                "id": "appr_1",
                "platform": "telegram",
                "sender_id": "12345",
                "sender": "Manoj",
                "query": "NIT?",
                "ai_reply": "i studied at NIT",
                "confidence": 0.42,
                "timestamp": "Just now",
                "created_at": 1782348920
            },
            {
                "id": "appr_2",
                "platform": "gmail",
                "sender_id": "boss@innovate.co",
                "sender": "Boss",
                "query": "Logs?",
                "ai_reply": "Will send shortly",
                "confidence": 0.35,
                "timestamp": "1 hour ago",
                "created_at": 1782348910
            }
        ])

    def test_get_stats(self):
        response = self.client.get("/api/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("messages_replied", data)
        self.assertIn("active_platforms", data)
        self.assertIn("pending_approvals", data)

    def test_get_activity(self):
        response = self.client.get("/api/activity")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.json(), list))

    def test_get_and_post_config(self):
        # GET config
        get_res = self.client.get("/api/config")
        self.assertEqual(get_res.status_code, 200)

        # POST config
        payload = {
            "name": "TestUser",
            "formality_level": 4,
            "reply_delay_min": 15,
            "reply_delay_max": 90,
        }
        post_res = self.client.post("/api/config", json=payload)
        self.assertEqual(post_res.status_code, 200)
        self.assertEqual(post_res.json()["status"], "updated")

    def test_toggle_platform(self):
        response = self.client.post("/api/platforms/telegram/toggle")
        self.assertEqual(response.status_code, 200)
        self.assertIn("status", response.json())

    def test_approve_reply(self):
        payload = {"content": "this is approved text"}
        response = self.client.post("/api/approvals/appr_1/approve", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "approved")

    def test_reject_reply(self):
        response = self.client.post("/api/approvals/appr_2/reject")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "rejected")

    from unittest.mock import patch, MagicMock

    @patch("app.api.routes.call_llm")
    @patch("app.api.routes.graph.ainvoke")
    def test_compare_endpoint(self, mock_ainvoke, mock_call_llm):
        mock_call_llm.return_value = "This is a generic LLM helpful response."
        mock_ainvoke.return_value = {"final_response": ["tbh kind of custom response", "lol"]}

        payload = {"prompt": "What do you think of coding?"}
        response = self.client.post("/api/compare", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["chatgpt"], "This is a generic LLM helpful response.")
        self.assertEqual(data["clone"], "tbh kind of custom response lol")


if __name__ == "__main__":
    unittest.main()

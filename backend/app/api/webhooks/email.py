from fastapi import APIRouter, Request, HTTPException
import base64
import json
import logging
from app.services.gmail import get_new_emails
from app.workers.tasks import process_message_task

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/email", tags=["email"])


@router.post("")
async def email_webhook(request: Request):
    """Webhook endpoint to receive push notifications from Google Pub/Sub."""
    try:
        payload = await request.json()
    except Exception as e:
        logger.error(f"Failed to parse incoming Pub/Sub JSON: {e}")
        raise HTTPException(status_code=400, detail="Invalid JSON")

    logger.info(f"Received Google Pub/Sub push payload: {payload}")

    message = payload.get("message", {})
    b64_data = message.get("data")
    if not b64_data:
        logger.warning("Pub/Sub message contains no data field. Ignoring.")
        return {"status": "ignored"}

    try:
        # Decode base64 data envelope
        decoded_bytes = base64.b64decode(b64_data)
        decoded_str = decoded_bytes.decode("utf-8")
        data = json.loads(decoded_str)
    except Exception as e:
        logger.error(f"Failed to decode base64 Pub/Sub payload data: {e}")
        raise HTTPException(status_code=400, detail="Data decoding failed")

    email_address = data.get("emailAddress")
    history_id = data.get("historyId")

    if not history_id:
        logger.warning("Pub/Sub payload does not contain historyId. Ignoring.")
        return {"status": "ignored"}

    logger.info(
        f"Processing new Gmail activity for {email_address} (historyId: {history_id})"
    )

    # Reconcile new emails since history_id
    new_emails = get_new_emails(str(history_id))
    if not new_emails:
        logger.info("No new messages found to process.")
        return {"status": "no_new_emails"}

    for email_item in new_emails:
        sender = email_item.get("from")
        content = email_item.get("content")

        # Create IncomingMessage format
        incoming_payload = {
            "platform": "gmail",
            "sender_id": sender,
            "sender_name": sender,
            "content": content,
        }

        # Queue processing tasks
        process_message_task.delay(incoming_payload)
        logger.info(f"Queued background processing for email from {sender}")

    return {"status": "queued", "processed_count": len(new_emails)}

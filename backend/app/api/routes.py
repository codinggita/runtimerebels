import logging
import json
import os
from contextlib import asynccontextmanager
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.config import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("digital-twin-autopilot")

USER_CONFIG_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "user_config.json",
)

# In-memory states for Dashboard (resets on reload, dev only)
active_platforms = ["telegram", "discord", "gmail"]
mock_activities = [
    {
        "id": 1,
        "platform": "telegram",
        "sender": "Ananya",
        "query": "Bro are you free tonight?",
        "reply": "yeah probably, just chilling at home. what's up?",
        "verified": True,
        "timestamp": "Just now",
    },
    {
        "id": 2,
        "platform": "discord",
        "sender": "CodeRebel_9",
        "query": "Hey did you run the latest migration?",
        "reply": "idk about that one, ask the sysops lead",
        "verified": False,
        "timestamp": "5 mins ago",
    },
    {
        "id": 3,
        "platform": "gmail",
        "sender": "hiring@innovate.co",
        "query": "Hello, we reviewed your autopilot profile and wanted to follow up.",
        "reply": "Dear sender,\n\nThank you for reaching out. I appreciate the follow-up.\n\nBest regards,",
        "verified": True,
        "timestamp": "20 mins ago",
    },
]

mock_approvals = [
    {
        "id": "appr_1",
        "sender": "Manoj Kumar",
        "platform": "telegram",
        "query": "Which college did you study in?",
        "ai_reply": "i studied at National Institute of Technology, i think?",
        "confidence": 0.42,
        "timestamp": "10 mins ago",
    },
    {
        "id": "appr_2",
        "sender": "boss@innovate.co",
        "platform": "gmail",
        "query": "Please forward the Q2 performance logs.",
        "ai_reply": "Dear sender,\n\nI will send the logs to you shortly.\n\nBest regards,",
        "confidence": 0.35,
        "timestamp": "1 hour ago",
    },
]


def load_user_config() -> Dict[str, Any]:
    """Helper to load config preferences from local json storage."""
    if os.path.exists(USER_CONFIG_PATH):
        try:
            with open(USER_CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading user_config.json: {e}")
    # Default config schema template
    return {
        "name": "User",
        "formality_level": settings.FORMALITY_LEVEL,
        "reply_delay_min": settings.REPLY_DELAY_MIN,
        "reply_delay_max": settings.REPLY_DELAY_MAX,
    }


def save_user_config(config_data: Dict[str, Any]):
    """Helper to save config preferences to local json storage."""
    try:
        os.makedirs(os.path.dirname(USER_CONFIG_PATH), exist_ok=True)
        with open(USER_CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(config_data, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving user_config.json: {e}")


import asyncio
from app.services.discord import bot_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    # App startup logic
    logger.info("Starting Digital Twin Autopilot Backend...")
    discord_task = None
    if settings.DISCORD_BOT_TOKEN:
        logger.info("Starting Discord bot client...")
        discord_task = asyncio.create_task(
            bot_client.start(settings.DISCORD_BOT_TOKEN)
        )
    yield
    # App shutdown logic
    logger.info("Shutting down Digital Twin Autopilot Backend...")
    if discord_task:
        logger.info("Closing Discord bot client...")
        await bot_client.close()
        discord_task.cancel()


app = FastAPI(
    title="Digital Twin Autopilot API",
    version="1.0-dev",
    lifespan=lifespan,
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include webhook routers
from app.api.webhooks.telegram import router as telegram_router
from app.api.webhooks.email import router as email_router

app.include_router(telegram_router, prefix="/webhook")
app.include_router(email_router, prefix="/webhook")


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "version": "1.0-dev",
        "config": {
            "formality_level": settings.FORMALITY_LEVEL,
            "reply_delay_range": f"{settings.REPLY_DELAY_MIN}s - {settings.REPLY_DELAY_MAX}s",
        },
    }


# ==========================================
# DASHBOARD REST API ENDPOINTS
# ==========================================


class ConfigUpdatePayload(BaseModel):
    name: str
    formality_level: int
    reply_delay_min: int
    reply_delay_max: int


class ApprovalActionPayload(BaseModel):
    content: str


from app.core.approval import approval_manager
from app.services.telegram import send_message as tg_send
from app.services.discord import send_message as ds_send
from app.services.gmail import send_email as gm_send

@app.get("/api/stats")
async def get_dashboard_stats():
    return {
        "messages_replied": len(mock_activities),
        "avg_response_time": f"{(settings.REPLY_DELAY_MIN + settings.REPLY_DELAY_MAX) // 2}s",
        "active_platforms": active_platforms,
        "pending_approvals": len(approval_manager.load_queue()),
        "confidence_score": "88%",
    }


@app.get("/api/activity")
async def get_dashboard_activities():
    return mock_activities


@app.get("/api/config")
async def get_dashboard_config():
    return load_user_config()


@app.post("/api/config")
async def update_dashboard_config(payload: ConfigUpdatePayload):
    config_dict = payload.model_dump()
    save_user_config(config_dict)

    # Sync update parameters inside global runtime settings
    settings.FORMALITY_LEVEL = payload.formality_level
    settings.REPLY_DELAY_MIN = payload.reply_delay_min
    settings.REPLY_DELAY_MAX = payload.reply_delay_max

    return {"status": "updated", "config": config_dict}


@app.post("/api/platforms/{platform}/toggle")
async def toggle_platform_channel(platform: str):
    if platform not in ["telegram", "discord", "gmail"]:
        raise HTTPException(status_code=400, detail="Invalid platform channel name")

    if platform in active_platforms:
        active_platforms.remove(platform)
        status = "disabled"
    else:
        active_platforms.append(platform)
        status = "enabled"

    logger.info(f"Platform channel {platform} is now {status}.")
    return {"platform": platform, "status": status, "active_list": active_platforms}


@app.get("/api/approvals")
async def get_pending_approvals():
    return approval_manager.load_queue()


@app.post("/api/approvals/{id}/approve")
async def approve_pending_reply(id: str, payload: ApprovalActionPayload):
    # Remove from approvals queue
    item = approval_manager.remove_from_queue(id)
    if not item:
        raise HTTPException(status_code=404, detail="Approval task item not found or already processed")

    logger.info(
        f"Approved reply override for {id} ({item['platform']}): {payload.content}"
    )

    # Dispatch to appropriate channel service client
    platform = item.get("platform")
    sender_id = item.get("sender_id")

    try:
        if platform == "telegram":
            await tg_send(sender_id, payload.content)
        elif platform == "discord":
            await ds_send(sender_id, payload.content)
        elif platform == "gmail":
            subject = "Re: Digital Twin Autopilot"
            await gm_send(sender_id, subject, payload.content)
    except Exception as e:
        logger.error(f"Failed to dispatch approved response to {platform}: {e}")

    # Append to recent activity feed
    mock_activities.insert(
        0,
        {
            "id": len(mock_activities) + 1,
            "platform": platform,
            "sender": item.get("sender"),
            "query": item.get("query"),
            "reply": payload.content,
            "verified": False,
            "timestamp": "Just now",
        },
    )

    return {"status": "approved", "dispatched": payload.content}


@app.post("/api/approvals/{id}/reject")
async def reject_pending_reply(id: str):
    item = approval_manager.remove_from_queue(id)
    if not item:
        raise HTTPException(status_code=404, detail="Approval task item not found or already processed")

    logger.info(f"Rejected and discarded autopilot reply for {id}")
    return {"status": "rejected"}

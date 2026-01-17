from fastapi import FastAPI
from pydantic import BaseModel
import logging

# Setup logging to verify alerts in your Docker logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Notification Service")

class NotificationPayload(BaseModel):
    user_id: int
    message: str


@app.get("/")
async def root():
    return {"message": "Service is running", "service_name": "notification service"}

@app.get("/health")
async def health():
    return {"status": "active"}

@app.post("/notify")
async def send_notification(payload: NotificationPayload):
    # This simulates sending an SMS or Email
    logger.info(f">>> NOTIFICATION SENT TO USER {payload.user_id}: {payload.message}")
    return {"status": "success", "user_id": payload.user_id}

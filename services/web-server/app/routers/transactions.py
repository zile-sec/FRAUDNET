# services/web-server/app/routers/transactions.py
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import httpx
import time

from .. import schemas, models
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
)

def get_http_client(request: Request) -> httpx.AsyncClient:
    """Dependency to get the shared httpx client."""
    return request.app.state.http_client

@router.post("/", response_model=schemas.TransactionResponse, status_code=status.HTTP_201_CREATED, summary="Create and Process a Transaction")
async def create_and_process_transaction(
    transaction_data: schemas.TransactionCreate, 
    db: Session = Depends(get_db),
    client: httpx.AsyncClient = Depends(get_http_client),
    user: dict = Depends(get_current_user) # Re-introducing auth dependency
):
    """
    Receives transaction data, creates a record, and processes it for fraud.
    
    - **Creates** a transaction record in the database with a `PENDING` status.
    - **Calls** the ML service to check for fraud.
    - **Updates** the transaction status to `APPROVED` or `DECLINED`.
    - **Notifies** the user if fraud is detected.
    """
    if user["user_id"] != transaction_data.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID in token does not match user ID in transaction payload."
        )

    # 1. Create a new DB entry with PENDING status
    db_transaction = models.Transaction(
        **transaction_data.model_dump(), 
        status="PENDING",
        is_fraud_predicted=False
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    # Microservice URLs
    extraction_service_url = "http://transaction-extraction-service:8000/detect_fraud"
    notification_service_url = "http://notification-service:8000/notify"

    try:
        # 2. Call Fraud Detection Service
        ml_payload = {
            "amount": transaction_data.amount,
            "time": time.time(), # ML model expects a 'time' feature
            "description": transaction_data.merchant
        }
        response = await client.post(extraction_service_url, json=ml_payload)
        response.raise_for_status()
        fraud_result = response.json()

        # 3. Update transaction based on fraud result
        if fraud_result.get("is_fraud"):
            db_transaction.is_fraud_predicted = True
            db_transaction.status = "DECLINED"
            # 4. If fraud, send notification
            await client.post(
                notification_service_url, 
                json={"user_id": db_transaction.user_id, "message": f"A suspicious transaction for merchant '{db_transaction.merchant}' was blocked."}
            )
        else:
            db_transaction.status = "APPROVED"

    except (httpx.HTTPStatusError, httpx.RequestError):
        db_transaction.status = "PROCESSING_ERROR"
        # In a real system, you would add detailed logging here
    finally:
        # 5. Commit final status to DB and return the result
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    
    # 1. Create a new DB entry
    db_transaction = models.Transaction(
        **transaction_data.model_dump(), 
        status="PENDING"
    )
    
    # 2. Commit to Database
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    # 3. Return the created transaction
    return db_transaction

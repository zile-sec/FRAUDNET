from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..dependencies import get_db, get_current_user, redis_client
from typing import Optional
import json
from datetime import datetime

router = APIRouter(prefix="/transactions", tags=["transactions"])

# Assume you have a Transaction model (copy from web_server or define here)
from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    amount = Column(Float)
    description = Column(String)
    location = Column(String(100))
    transaction_time = Column(DateTime)
    category_id = Column(Integer)
    is_fraud = Column(Boolean, default=False)
    fraud_details = Column(JSON)

@router.get("/")
async def get_transactions(
    user = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, le=100),
    is_fraud: Optional[bool] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    cache_key = f"transactions:user:{user['username']}:page:{page}:fraud:{is_fraud}:start:{start_date}:end:{end_date}"
    
    # Try cache first
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    # Query DB (replace user_id lookup with real logic)
    query = db.query(Transaction).filter(Transaction.user_id == 1)  # TODO: map username → user_id

    if is_fraud is not None:
        query = query.filter(Transaction.is_fraud == is_fraud)
    if start_date:
        query = query.filter(Transaction.transaction_time >= start_date)
    if end_date:
        query = query.filter(Transaction.transaction_time <= end_date)

    total = query.count()
    transactions = query.order_by(desc(Transaction.transaction_time))\
                        .offset((page - 1) * page_size)\
                        .limit(page_size)\
                        .all()

    result = {
        "total": total,
        "page": page,
        "page_size": page_size,
        "data": [
            {
                "id": t.id,
                "amount": t.amount,
                "description": t.description,
                "location": t.location,
                "time": t.transaction_time.isoformat(),
                "is_fraud": t.is_fraud,
                "fraud_details": t.fraud_details
            } for t in transactions
        ]
    }

    # Cache for 5 minutes
    redis_client.setex(cache_key, 300, json.dumps(result))

    return result

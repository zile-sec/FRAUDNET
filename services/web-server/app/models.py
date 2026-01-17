# services/web-server/app/models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from .database import Base 

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    balance = Column(Float, default=0.0)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    
    # Core Transaction Data
    user_id = Column(Integer, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    merchant = Column(String, nullable=False)
    
    # Detection & Status
    is_fraud_predicted = Column(Boolean, default=False)
    status = Column(String, default="PENDING") # PENDING, APPROVED, DECLINED
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

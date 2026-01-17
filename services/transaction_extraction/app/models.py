# Similar to web_server's models.py - add if this service needs direct DB access
from sqlalchemy import Column, Integer, Float, Boolean, JSON, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TransactionLog(Base):  # Example for logging predictions
    __tablename__ = "transaction_logs"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    is_fraud = Column(Boolean, default=False)
    fraud_details = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())

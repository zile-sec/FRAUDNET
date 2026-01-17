from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

app = FastAPI(title="Fraud Detection System - Web Server")

origins = [
    "http://localhost:3000",  # Default Next.js development port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Setup ---
# Connection string based on docker-compose.yaml credentials
SQLALCHEMY_DATABASE_URL = "postgresql://zile:za@postgres/fraud"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- SQLAlchemy Model ---
class TransactionDB(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    amount = Column(Float)
    currency = Column(String)
    source_account = Column(String)
    destination_account = Column(String)
    timestamp = Column(String)
    is_fraudulent = Column(Boolean, default=False)

# Create tables (if they don't exist)
Base.metadata.create_all(bind=engine)

# --- Seed Data (for development) ---
def seed_data():
    with SessionLocal() as db:
        if db.query(TransactionDB).count() == 0:
            seed_transactions = [
                TransactionDB(id="tx123", amount=150.0, currency="USD", source_account="acc1", destination_account="acc2", timestamp="2025-12-21T10:00:00Z", is_fraudulent=False),
                TransactionDB(id="tx124", amount=2500.0, currency="EUR", source_account="acc3", destination_account="acc4", timestamp="2025-12-21T10:05:00Z", is_fraudulent=True),
                TransactionDB(id="tx125", amount=10.50, currency="USD", source_account="acc1", destination_account="acc3", timestamp="2025-12-21T10:06:00Z", is_fraudulent=False),
            ]
            db.add_all(seed_transactions)
            db.commit()
seed_data()

# --- Pydantic Schema ---
class Transaction(BaseModel):
    id: str
    amount: float
    currency: str
    source_account: str
    destination_account: str
    timestamp: str
    is_fraudulent: Optional[bool] = None

    class Config:
        from_attributes = True

# --- Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    """Root endpoint for the Web Server."""
    return {"message": "Welcome to the Fraud Detection System Web Server"}

@app.get("/transactions/", response_model=List[Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve a list of transactions."""
    transactions = db.query(TransactionDB).offset(skip).limit(limit).all()
    return transactions

@app.get("/transactions/{transaction_id}", response_model=Transaction)
def read_transaction(transaction_id: str, db: Session = Depends(get_db)):
    """Retrieve a single transaction by its ID."""
    transaction = db.query(TransactionDB).filter(TransactionDB.id == transaction_id).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

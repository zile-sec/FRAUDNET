# services/web-server/app/schemas.py
from pydantic import BaseModel

# Schema for the incoming request data
class TransactionCreate(BaseModel):
    user_id: int
    amount: float
    merchant: str
    
    class Config:
        # Allows reading SQLAlchemy models as Pydantic objects
        from_attributes = True

# Schema for the data returned by the API
class TransactionResponse(TransactionCreate):
    id: int
    is_fraud_predicted: bool
    status: str

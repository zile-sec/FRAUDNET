# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional # Import this
import numpy as np
from fraud_model import detect_fraud  

app = FastAPI(title="Transaction Extraction Service - Mock Mode")

class Transaction(BaseModel):
    amount: float
    time: float
    description: Optional[str] = None # Add this line!

#health check endpoint
@app.get("/")
async def root():
    return {"message": "Service is running", "service_name": "Extraction Service"}


@app.post("/detect_fraud")
async def process_fraud_detection(transaction: Transaction):
    try:
        data = np.array([[transaction.amount, transaction.time]])  # Expand to match your features
        result = detect_fraud(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

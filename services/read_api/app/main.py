from fastapi import FastAPI
from .routers import transactions

app = FastAPI(title="Read API - Fraud Detection System")

app.include_router(transactions.router)

@app.get("/")
def health():
    return {"status": "Read API is healthy", "service": "read_api"}

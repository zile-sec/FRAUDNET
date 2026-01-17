from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from . import models, schemas
from .database import engine, get_db

app = FastAPI(title="Accounts Service")

# This ensures the 'users' table is created if it doesn't exist when the app starts.
# The web-server also does this, which is fine.
models.Base.metadata.create_all(bind=engine)

@app.get("/")
async def health_check():
    return {"message": "Accounts Service is running"}


@app.get("/users/{user_id}", response_model=schemas.User)
async def get_user_details(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieves user details from the PostgreSQL database.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

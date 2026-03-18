from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import SessionLocal
from typing_extensions import Annotated

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DatabaseSession = Annotated[Session, Depends(get_db)]
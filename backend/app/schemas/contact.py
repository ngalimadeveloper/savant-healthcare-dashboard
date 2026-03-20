from pydantic import BaseModel, Field
from typing_extensions import Annotated
from datetime import datetime, date


class ContactBase(BaseModel):
    email:str
    phone_number: str

class ContactCreate(ContactBase):
    pass

class ContactResponse(ContactBase):
    id:int

    model_config = {"from_attributes": True}

class ContactUpdate(BaseModel):
    email:str | None = None
    phone_number: str | None = None
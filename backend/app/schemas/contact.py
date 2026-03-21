from pydantic import BaseModel


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
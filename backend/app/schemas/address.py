from pydantic import BaseModel

class AddressBase(BaseModel): 
    street:str
    unit_number:str | None = None
    city:str 
    state:str
    zip_code:str
    country:str = "United States"
    
class AddressCreate(AddressBase):
    pass

class AddressUpdate(BaseModel):
    street:str | None = None
    unit_number:str | None = None
    city:str | None = None
    state:str | None = None
    zip_code:str | None = None
    country:str | None = None

class AddressResponse(AddressBase):
    id:int

    model_config = {"from_attributes": True}


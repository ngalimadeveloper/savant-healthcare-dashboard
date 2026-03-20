from pydantic import BaseModel
from datetime import datetime

class AllergyBase(BaseModel):
    allergy_name:str

class AllergyCreate(AllergyBase):
    pass

class AllergyResponse(AllergyBase):
    id:int
    created_at: datetime

    model_config = {"from_attributes": True}

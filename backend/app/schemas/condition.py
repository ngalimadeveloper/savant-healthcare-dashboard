from pydantic import BaseModel
import datetime

class ConditionBase(BaseModel):
    condition_name:str

class ConditionCreate(ConditionBase):
    pass

class ConditionResponse(ConditionBase):
    id:int
    created_at:datetime

    model_config = {"from_attributes": True}


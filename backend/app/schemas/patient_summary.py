from pydantic import BaseModel
from .patient import BloodTypeEnum
from .condition import ConditionBase
from .allergy import AllergyBase

class PatientSummaryResponse(BaseModel):
    id:int
    full_name: str
    age: int
    bloodtype:BloodTypeEnum | None = None
    summary:str
    conditions:list[ConditionBase] = []
    allergies:list[AllergyBase] = []

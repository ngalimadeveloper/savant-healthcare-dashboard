from pydantic import BaseModel
from typing import List
from .patient import BloodTypeEnum
from .condition import ConditionBase
from .allergy import AllergyBase

class PatientSummaryResponse(BaseModel):
    full_name: str
    age: int
    bloodtype:BloodTypeEnum | None = None
    summary:str
    conditions:List[ConditionBase] = []
    allergies:List[AllergyBase] = []

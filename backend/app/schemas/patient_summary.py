from pydantic import BaseModel
from typing import List
from .patient import BloodTypeEnum
from .condition import ConditionBase
from .allergy import AllergyBase


FALLBACK_SUMMARY = "Patient summary service is down, please check back later please"

class PatientSummaryResponse(BaseModel):
    full_name: str
    age: int
    bloodtype: BloodTypeEnum | None = None
    summary: str
    conditions: List[ConditionBase] = []
    allergies: List[AllergyBase] = []

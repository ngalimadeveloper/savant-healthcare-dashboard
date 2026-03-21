import enum
from pydantic import BaseModel, Field, computed_field, field_validator
from datetime import datetime, date
from .contact import ContactCreate, ContactResponse, ContactUpdate
from .address import AddressCreate, AddressResponse, AddressUpdate
from .allergy import AllergyCreate
from .condition import ConditionCreate
from typing import List, Literal

def get_age(dob:date):
    current = date.today()
    return current.year - dob.year - ((current.month, current.day) < (dob.month, dob.day))



class BloodTypeEnum(str, enum.Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"

class PatientStatus(str, enum.Enum):
    ACTIVE = "active"
    IN_ACTIVE = "inactive"


class PatientBase(BaseModel):
    first_name:str
    middle_name:str | None = None
    last_name:str
    dob:date
    blood_type:BloodTypeEnum | None = None
    status: PatientStatus = PatientStatus.ACTIVE
    


class PatientResponse(PatientBase):
    id:int
    last_visit: datetime | None
    created_at:datetime
    address: AddressResponse
    contact: ContactResponse
   
    @computed_field
    @property
    def age(self) -> int:
        return get_age(self.dob)

    model_config = {"from_attributes": True}


class PatientUpdate(BaseModel):
    first_name:str | None = None
    middle_name:str | None = None
    last_name:str | None = None
    dob:date | None = None
    blood_type:BloodTypeEnum | None = None
    status: PatientStatus | None = None
    address: AddressUpdate | None = None
    contact: ContactUpdate | None = None




class PatientCreate(PatientBase):
    contact:ContactCreate
    address:AddressCreate
    allergies:List[AllergyCreate] = []
    conditions: List[ConditionCreate] = []


class PatientListQueryParams(BaseModel):
    search: str | None = None
    status: PatientStatus | None = None
    limit: int = Field(default=20, ge=1, le=100)
    offset: int | None = Field(default=None, ge=0)
    sort_order: Literal["asc", "desc"] = "asc"

    @field_validator("search")
    @classmethod
    def validate_search(cls, value: str | None) -> str | None:
        return value.strip() or None if value else None


class PatientListResponse(BaseModel):
    items: List[PatientResponse]
    next_cursor: int | None
    has_more: bool


class PatientStatsResponse(BaseModel):
    total: int
    active: int
    inactive: int
    by_status: dict[str, int]










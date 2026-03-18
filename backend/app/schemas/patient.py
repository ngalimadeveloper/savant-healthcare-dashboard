import enum
from pydantic import BaseModel, Field, computed_field
from datetime import datetime, date
from .contact import ContactCreate, ContactResponse, ContactUpdate
from .address import AddressCreate, AddressResponse, AddressUpdate
from .allergy import AllergyCreate
from .condition import ConditionCreate

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
    DECEASED = "deceased"


class PatientBase(BaseModel):
    first_name:str
    middle_name:str | None = None
    last_name:str
    dob:date
    blood_type:BloodTypeEnum | None = None
    status: PatientStatus = PatientStatus.ACTIVE
    


class PatientResponse(PatientBase):
    id:int
    last_visit: datetime
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
    allergies:list[AllergyCreate] = []
    conditions: list[ConditionCreate] = []










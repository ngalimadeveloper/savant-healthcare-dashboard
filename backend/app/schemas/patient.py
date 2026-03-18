import enum
from pydantic import BaseModel, Field, computed_field
from datetime import datetime, date
from .contact import ContactCreate, ContactResponse, ContactUpdate
from .address import AddressCreate, AddressResponse, AddressUpdate
from .allergy import AllergyCreate
from .condition import ConditionCreate

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


"""
- `GET /patients` — List patients with pagination
- `GET /patients/{id}` — Get a specific patient
- `POST /patients` — Create a patient
    **Tasks:**
        1. **Build a patient form** with:
            - Personal information (name, DOB, contact, address)
            - Medical information (allergies, conditions, blood type, status)
        2. **Implement form features**:
            - Client-side and server-side validation
            - Meaningful error messages displayed to the user
        3. **Error handling** for:
            - Network failures
            - Validation errors
- `PUT /patients/{id}` — Update a patient
- `DELETE /patients/{id}` — Delete a patient
"""

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
        current = date.today()
        return current.year - self.dob.year - ((current.month, current.day) < (self.dob.month, self.dob.day))

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










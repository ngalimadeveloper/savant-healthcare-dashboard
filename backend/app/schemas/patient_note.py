from pydantic import BaseModel
from datetime import datetime

class PatientNoteBase(BaseModel):
    text:str 

class PatientNoteResponse(PatientNoteBase):
    id:int
    timestamp:datetime

    model_config = {"from_attributes": True}

class PatientNoteCreate(PatientNoteBase):
    pass
    

    
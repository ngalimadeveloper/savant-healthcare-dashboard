from sqlalchemy.orm import Session, joinedload
from app.models.patient import Patient
from app.models.patient_note import PatientNote

"""
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

"""

class PatientRepository:
    def __init__(self, db:Session):
        self.db
    
    def get_all_patients(self):
        return self.db.query(Patient).all()
    
    def get_all_patient_notes(self):
        return self.db.query(PatientNote).all()
    
    """
    Need to optimize the search by name potentially? Would be good to show that it can maybe handle searching across 100,000 or something. 
    Also need to account for pagination too.
    """

    def search_by_name(self, search_input:str):
        return ( 
            self.db.query(Patient)
            .filter(
                Patient.first_name.ilike(f"%{search_input}%") |
                Patient.middle_name.ilike(f"%{search_input}%") |
                Patient.last_name.ilike(f"%{search_input}%")
            )
            .all()
        )
    def get_patient_by_id(self, patient_id:int):
        return ( 
                self.db.query(Patient)
                .options(joinedload(Patient.contact), joinedload(Patient.address))
                .filter(Patient.id == patient_id)
                .first()
        )
    
    def get_patient_note_by_id(self, note_id:str):
        return (
                self.db.query(PatientNote)
                .filter(PatientNote.id == note_id)
                .first()
        )

    
    def create_patient(self, patient: Patient):
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient
    
    def create_patient_note(self, patient_note:PatientNote):
        self.db.add(patient_note)
        self.db.commit()
        self.db.refresh(patient_note)
        return patient_note


    def delete_patient(self, patient:Patient):
        self.db.delete(patient)
        self.db.commit()
    
        
    def update_patient(self, patient:Patient):
        self.db.commit()
        self.db.refresh(patient)
        return patient
    


    

    
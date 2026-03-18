from sqlalchemy.orm import Session, joinedload
from app.models.patient import Patient

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
    
    """
    Need to optimize the search by name potentially? Would be good to show that it can maybe handle searching across 100,000 or something. 
    Also need to account for pagination too.
    """

    def search_by_name(self, search_query:str):
        return ( 
            self.db.query(Patient)
            .filter(
                Patient.first_name.ilike(f"%{search_query}%") |
                Patient.middle_name.ilike(f"%{search_query}%") |
                Patient.last_name.ilike(f"%{search_query}%")
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
    
    def get_allergies_by_patient_id(self, patient_id:int):
        return (
            self.db.query(Patient)
            .options(joinedload(Patient.allergies))
            .filter(Patient.id == patient_id)
            .first()
        )
    
    def get_conditions_by_patient_id(self, patient_id:int):
        return (
            self.db.query(Patient)
            .options(joinedload(Patient.conditions))
            .filter(Patient.id == patient_id)
            .first()
        )
    
    
    def create_patient(self, patient: Patient):
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient
    

    def delete_patient(self, patient:Patient):
        self.db.delete(patient)
        self.db.commit()
    
        
    def update_patient(self, patient:Patient):
        self.db.commit()
        self.db.refresh(patient)
        return patient
    
    


    

    
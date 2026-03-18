
from sqlalchemy.orm import Session
from app.repositories.patient_repo import PatientRepository
from app.schemas.patient import PatientCreate, PatientUpdate



class PatientService:
    def __init__(self, db:Session):
        self.db = db
        self.repo = PatientRepository(db)

    def get_all_patients(self):
        return self.repo.get_all_patients()
    
    def search_by_name(self, search_query:str):
        search_query = search_query.strip()
        if not search_query:
            return []
        return self.repo.search_by_name(search_query)
    
    # Come back to figure out exceptions
    def get_patient_by_id(self, patient_id:int):
        patient = self.repo.get_patient_by_id(patient_id)
        if not patient:
            raise #Patient doesn't exist error
        return patient
    
    #def create_patient(self, patient: PatientCreate):
    #    if self.repo.
    #  
    #    return patient
    

    def delete_patient(self, patient_id:int):
        patient = self.repo.get_patient_by_id(patient_id)
        if not patient:
            raise #Patient not found 
        self.repo.delete_patient(patient)
    
        
    def update_patient(self, patient_id:int, patient_data:PatientUpdate):
        patient = self.repo.get_patient_by_id(patient_id)
        if not patient:
            raise #Patient not found error
        patient_update_data = patient_data.model_dump(exclude_unset=True)

        for key, value in patient_update_data.items():
            setattr(patient, key, value)
        
        return self.repo.update(patient_data)
    
    



from sqlalchemy.orm import Session
from app.repositories.patient_repo import PatientRepository
from app.schemas.patient import PatientCreate, PatientUpdate
from app.models.patient import Patient
from app.models.allergy import Allergy
from app.models.condition import Condition
from app.models.address import Address
from app.models.contact import Contact
from app.exceptions import ConflictException, NotFoundException


class PatientService:
    def __init__(self, db:Session):
        self.db = db
        self.repo = PatientRepository(db)

    def get_all_patients(self):
        return self.repo.get_all_patients()
    
    def search_by_patient_name(self, search_query:str):
        search_query = search_query.strip()
        if not search_query:
            return []
        return self.repo.search_by_patient_name(search_query)
    
    def get_patient_by_id(self, patient_id:int):
        patient = self.repo.get_patient_by_id(patient_id)
        if not patient:
            raise NotFoundException("Patient", patient_id)
        return patient
    
    def create_patient(self, create_patient_data: PatientCreate):
        patient = self.repo.get_patient_by_email(create_patient_data.contact.email.strip().lower())
        if patient:
            raise ConflictException("Patient", patient.id)

        patient_data = create_patient_data.model_dump(exclude={"address", "contact", "allergies", "conditions"})
        new_patient = Patient(**patient_data)

        new_patient.address = Address(**create_patient_data.address.model_dump())
        new_patient.contact = Contact(**create_patient_data.contact.model_dump())

        if create_patient_data.allergies:
            for allergy in create_patient_data.allergies:
                new_patient.allergies.append(Allergy(**allergy.model_dump()))

        if create_patient_data.conditions:
            for condition in create_patient_data.conditions:
                new_patient.conditions.append(Condition(**condition.model_dump()))

        return self.repo.create_patient(new_patient)
    

    def delete_patient(self, patient_id:int):
        patient = self.repo.get_patient_by_id(patient_id)
        if not patient:
            raise NotFoundException("Patient", patient_id)
        self.repo.delete_patient(patient)
    
        
    def update_patient(self, patient_id:int, patient_data:PatientUpdate):
        patient = self.repo.get_patient_by_id(patient_id)
        if not patient:
            raise NotFoundException("Patient", patient_id)
        patient_update_data = patient_data.model_dump(exclude_unset=True)

        address_update_data = patient_update_data.pop("address", None)
        contact_update_data = patient_update_data.pop("contact", None)

        for key, value in patient_update_data.items():
            setattr(patient, key, value)

        if address_update_data and patient.address:
            for key, value in address_update_data.items():
                setattr(patient.address, key, value)

        if contact_update_data and patient.contact:
            for key, value in contact_update_data.items():
                setattr(patient.contact, key, value)
        
        return self.repo.update_patient(patient)
    
    


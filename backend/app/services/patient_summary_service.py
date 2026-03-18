from sqlalchemy.orm import Session
from app.repositories.patient_note_repo import PatientNoteRepository
from app.repositories.patient_repo import PatientRepository
from app.models.patient_note import PatientNote
from app.schemas.patient import get_age


class PatientSummaryService:
    def __init__(self, db:Session):
        self.patient_repo = PatientRepository(db)
        self.patient_note_repo = PatientNoteRepository(db)

    async def get_patient_summary(self, patient_id:int):
        patient = self.patient_repo.get_patient_by_id(patient_id)
        if not patient:
            raise #No patient found error must handle

        patient_notes = self.patient_note_repo.get_notes_by_patient_id(patient_id)
        allergies = self.patient_repo.get_allergies_by_patient_id(patient_id)
        conditions = self.patient_repo.get_conditions_by_patient_id(patient_id)
        summary = await self.create_summary(patient_notes)

        return {
            "name": f"{patient.first_name} {patient.middle_name + ' ' if patient.middle_name else ''}{patient.last_name}",
            "bloodtype": patient.bloodtype if patient.bloodtype else None,
            "age": get_age(patient.dob),
            "allergies": [{"name": allergy.allergy_name} for allergy in allergies] if allergies else [],
            "conditions": [{"name": condition.condition_name} for condition in conditions] if conditions else [],
            "summary": summary
        }
    
    async def create_summary(patient_notes:list[PatientNote]):
        if not patient_notes:
            return "No summary avaiable, please create a note for the patient"
        ##Prompt for LLM to be able to handle this



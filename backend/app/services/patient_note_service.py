from sqlalchemy.orm import Session
from app.repositories.patient_note_repo import PatientNoteRepository
from app.models.patient_note import PatientNote
from app.repositories.patient_repo import PatientRepository
from app.schemas.patient_note import PatientNoteCreate


class PatientNoteService:
    def __init__(self, db:Session):
        self.db = db
        self.patient_repo = PatientRepository(db)
        self.patient_note_repo = PatientNoteRepository(db)
    
    def get_notes_by_patient_id(self, patient_id:int):
        patient = self.patient_repo.get_patient_by_id(patient_id)
        if not patient:
            raise #Patient not found error 
        return self.patient_note_repo.get_notes_by_patient_id(patient_id)
    
    def create_note(self, patient_id:int, note_data:PatientNoteCreate):
        patient = self.patient_repo.get_patient_by_id(patient_id)
        if not patient:
            raise #Patient not found error
        note_data = PatientNote(patient_id=patient_id, **note_data.model_dump())
        return self.patient_note_repo.create_note(note_data)

    def delete_note(self, note_id:int):
        patient_note = self.patient_note_repo.get_note_by_id(note_id)
        if not patient_note:
            raise ## Patient note not found error
        return self.patient_note_repo.delete_note(patient_note)

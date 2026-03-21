from sqlalchemy.orm import Session
from app.models.patient_note import PatientNote
from app.schemas.patient_note import PatientNotesQueryParams


class PatientNoteRepository:
    def __init__(self, db:Session):
        self.db = db
 
    def get_note_by_id(self, note_id:int):
        return self.db.query(PatientNote).filter(PatientNote.id == note_id).first()
    
    def get_notes_by_patient_id(self, patient_id:int, query_params: PatientNotesQueryParams):
        query = self.db.query(PatientNote).filter(PatientNote.patient_id == patient_id)

        if query_params.cursor:
            query = query.filter(PatientNote.id > query_params.cursor)

        rows = query.order_by(PatientNote.id.asc()).limit(query_params.limit + 1).all()
        has_more = len(rows) > query_params.limit
        items = rows[: query_params.limit]
        return items, has_more
    
    
    def create_note(self, patient_note: PatientNote):
        self.db.add(patient_note)
        self.db.commit()
        self.db.refresh(patient_note)
        return patient_note
    
    def delete_note(self, patient_note:PatientNote):
        self.db.delete(patient_note)
        self.db.commit()
    
"""
In case I want to add additional functionality for deleting or updating a note.

    def update_patient_note(self, patient_note:PatientNote):
        self.db.commit()
        self.db.refresh(patient_note)
        return patient_note   
"""


    

    
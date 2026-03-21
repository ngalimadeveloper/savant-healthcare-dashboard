from sqlalchemy.orm import Session
from typing import List
from app.repositories.patient_note_repo import PatientNoteRepository
from app.repositories.patient_repo import PatientRepository
from app.models.patient_note import PatientNote
from app.schemas.patient_note import PatientNotesQueryParams
from app.schemas.patient import get_age
from app.schemas.patient_summary import PatientSummaryResponse
from app.exceptions import NotFoundException
from app.schemas.patient_summary import FALLBACK_SUMMARY
from openai import AsyncOpenAI
import os





class PatientSummaryService:
    def __init__(self, db:Session):
        self.patient_repo = PatientRepository(db)
        self.patient_note_repo = PatientNoteRepository(db)
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


    async def get_patient_summary(self, patient_id:int) -> PatientSummaryResponse:
        patient = self.patient_repo.get_patient_by_id(patient_id)
        if not patient:
            raise NotFoundException("Patient", patient_id)

        patient_notes, _ = self.patient_note_repo.get_notes_by_patient_id(
            patient_id,
            PatientNotesQueryParams(limit=5, cursor=None),
        )
        summary = await self.create_summary(patient_notes) or FALLBACK_SUMMARY

        return PatientSummaryResponse(
            full_name=f"{patient.first_name} {patient.middle_name + ' ' if patient.middle_name else ''}{patient.last_name}",
            bloodtype=patient.blood_type if patient.blood_type else None,
            age=get_age(patient.dob),
            allergies=[{"allergy_name": allergy.allergy_name} for allergy in patient.allergies],
            conditions=[{"condition_name": condition.condition_name} for condition in patient.conditions],
            summary=summary,
        )
    
    async def create_summary(self, patient_notes:List[PatientNote]) -> str:
        if not patient_notes:
            return "No summary avaiable, please create a note for the patient"

        notes_text = "\n".join(f"- {note.text}" for note in patient_notes)

        try:
            response = await self.client.responses.create(
                model="gpt-4o-mini",
                instructions="You are a summarizer of clinical notes. You are tasked with only providing an overview of patient health based on notes. Do not speculate or provide any medical advice. Keep summary to no more than 3 concise sentences",
                input=notes_text,
            )
            return response.output_text
        except Exception as e:
            print(f"[PatientSummaryService] Failed to generate summary: {e}")
            return FALLBACK_SUMMARY

       



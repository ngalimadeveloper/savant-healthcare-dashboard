from sqlalchemy.orm import Session
from typing import List
from app.repositories.patient_note_repo import PatientNoteRepository
from app.repositories.patient_repo import PatientRepository
from app.models.patient_note import PatientNote
from app.schemas.patient import get_age
from app.schemas.patient_summary import PatientSummaryResponse
from app.exceptions import NotFoundException
from openai import AsyncOpenAI
import os
import json


class PatientSummaryService:
    def __init__(self, db: Session):
        self.patient_repo = PatientRepository(db)
        self.patient_note_repo = PatientNoteRepository(db)
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def get_patient_summary(self, patient_id: int) -> PatientSummaryResponse:
        patient = self.patient_repo.get_patient_with_clinical_data(patient_id)
        if not patient:
            raise NotFoundException("Patient", patient_id)

        patient_notes = self.patient_note_repo.get_recent_notes(patient_id, 5)

        allergies = [a.allergy_name for a in patient.allergies]
        conditions = [c.condition_name for c in patient.conditions]
        full_name = f"{patient.first_name} {patient.middle_name + ' ' if patient.middle_name else ''}{patient.last_name}"

        notes_summary = await self.generate_notes_summary(patient_notes)

        return PatientSummaryResponse(
            full_name=full_name,
            bloodtype=patient.blood_type if patient.blood_type else None,
            age=get_age(patient.dob),
            allergies=[{"allergy_name": a} for a in allergies],
            conditions=[{"condition_name": c} for c in conditions],
            notes_summary=notes_summary,
        )

    async def generate_notes_summary(self, patient_notes: List[PatientNote]) -> str:
        if not patient_notes:
            return "No notes have been recorded for this patient yet."

        notes_input = json.dumps({"notes": [note.text for note in patient_notes]})

        try:
            response = await self.client.responses.create(
                model="gpt-4o-mini",
                instructions="You are a clinical notes summarizer. Write a concise 2-3 sentence narrative based only on the notes provided. Do not speculate or provide medical advice.",
                input=notes_input,
            )
            return response.output_text
        except Exception as e:
            print(f"[PatientSummaryService] Failed to generate summary: {e}")
            return "Summary service is down, try again later."

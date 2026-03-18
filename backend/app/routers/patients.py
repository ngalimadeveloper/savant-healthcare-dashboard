from fastapi import APIRouter
from app.services.patient_service import PatientService
from app.services.patient_note_service import PatientNoteService
from app.services.patient_summary_service import PatientSummaryService
from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse
)
from app.schemas.patient_note import (
    PatientNoteCreate,
    PatientNoteResponse
)
from app.schemas.patient_summary import (
    PatientSummaryResponse
)
from fastapi import APIRouter, Depends
from typing import List, Annotated
from app.services.patient_service import PatientService
from app.services.patient_note_service import PatientNoteService
from app.services.patient_summary_service import PatientSummaryService
from app.dependencies import DatabaseSession
from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    PatientListQueryParams,
    PatientListResponse,
    PatientStatsResponse,
)
from app.schemas.patient_note import (
    PatientNoteCreate,
    PatientNoteResponse,
    PatientNotesQueryParams,
    PatientNotesListResponse
)
from app.schemas.patient_summary import (
    PatientSummaryResponse
)


router = APIRouter(tags=["patients"])

@router.post("/patients", status_code=201)
def create_patient(db:DatabaseSession, patient_data:PatientCreate) -> PatientResponse:
    patient_service = PatientService(db)
    return patient_service.create_patient(patient_data)

@router.get("/patients")
def get_all_patients(
    db: DatabaseSession,
    query_params: Annotated[PatientListQueryParams, Depends()],
) -> PatientListResponse:
    patient_service = PatientService(db)
    return patient_service.get_all_patients(query_params)

@router.get("/patients/stats")
def get_patient_stats(db: DatabaseSession) -> PatientStatsResponse:
    patient_service = PatientService(db)
    return patient_service.get_patient_stats()

@router.get("/patients/{patient_id}")
def get_patient_by_id(db:DatabaseSession, patient_id:int) -> PatientResponse:
    patient_service = PatientService(db)
    return patient_service.get_patient_by_id(patient_id)

@router.patch("/patients/{patient_id}")
def update_patient(db:DatabaseSession, patient_id:int, patient_data:PatientUpdate) -> PatientResponse:
    patient_service = PatientService(db)
    return patient_service.update_patient(patient_id, patient_data)

@router.delete("/patients/{patient_id}", status_code=204)
def delete_patient(db:DatabaseSession, patient_id:int):
    patient_service = PatientService(db)
    return patient_service.delete_patient(patient_id)



@router.post("/patients/{patient_id}/notes", status_code=201)
def create_patient_note(db:DatabaseSession, patient_id:int, note_data:PatientNoteCreate):
    note_service = PatientNoteService(db)
    return note_service.create_note(patient_id, note_data)

@router.get("/patients/{patient_id}/notes")
def get_notes_by_patient_id(
    db:DatabaseSession,
    patient_id:int,
    query_params: Annotated[PatientNotesQueryParams, Depends()],
) -> PatientNotesListResponse:
    note_service = PatientNoteService(db)
    return note_service.get_notes_by_patient_id(patient_id, query_params)

@router.delete("/patients/{patient_id}/notes/{note_id}", status_code = 204)
def delete_note(db:DatabaseSession, patient_id:int, note_id:int):
    note_service = PatientNoteService(db)
    return note_service.delete_note(patient_id, note_id)

@router.get("/patients/{patient_id}/summary")
async def get_summary(db:DatabaseSession, patient_id:int) -> PatientSummaryResponse:
    summary_service = PatientSummaryService(db)
    return await summary_service.get_patient_summary(patient_id)






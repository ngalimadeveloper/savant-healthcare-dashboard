from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List

class PatientNoteBase(BaseModel):
    text:str = Field(min_length=1)

    @field_validator("text")
    @classmethod
    def validate_text_not_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Text cannot be empty")
        return stripped

class PatientNoteResponse(PatientNoteBase):
    id:int
    timestamp:datetime

    model_config = {"from_attributes": True}

class PatientNoteCreate(PatientNoteBase):
    pass


class PatientNotesQueryParams(BaseModel):
    limit: int = Field(default=20, ge=1, le=100)
    cursor: int | None = Field(default=None, ge=1)


class PatientNotesListResponse(BaseModel):
    items: List[PatientNoteResponse]
    next_cursor: int | None
    has_more: bool
    

    
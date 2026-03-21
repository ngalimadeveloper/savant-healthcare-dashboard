from app.database import Base
from sqlalchemy import Column, ForeignKey, Integer, DateTime, Text, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class PatientNote(Base):
    __tablename__= "patientnotes"
    __table_args__ = (
        CheckConstraint("char_length(btrim(text)) > 0", name="ck_patientnotes_text_not_blank"),
    )

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())

    patient = relationship("Patient", back_populates="patientnotes")
    


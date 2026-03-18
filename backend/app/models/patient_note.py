from app.database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class PatientNote(Base):
    __tablename__= "patientnotes"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    text = Column(String, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())

    patient = relationship("Patient", back_populates="patientnotes")
    


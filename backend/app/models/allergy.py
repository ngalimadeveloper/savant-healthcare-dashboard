from app.database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

class Allergy(Base):
    __tablename__= "allergies"
    __table_args__ = (
        UniqueConstraint("patient_id", "allergy_name", name="uq_patient_allergy"),
)

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    allergy_name = Column(String(255), nullable=False)

    patient = relationship("Patient", back_populates="allergies")


from app.database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint, func, DateTime
from sqlalchemy.orm import relationship

class Condition(Base):
    __tablename__= "conditions"
    __table_args__ = (
        UniqueConstraint("patient_id", "condition_name", name="uq_patient_condition"),
)

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    condition_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    patient = relationship("Patient", back_populates="conditions")


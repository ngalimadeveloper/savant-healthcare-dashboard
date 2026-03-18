from app.database import Base
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

class Address(Base):
    __tablename__= "addresses"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, unique=True) 
    street = Column(String(100), nullable=False)
    unit_number = Column(String(20), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    zip_code = Column(String(10), nullable=False)
    country = Column(String(100), default="US", nullable=False)

    patient = relationship("Patient", back_populates="address")



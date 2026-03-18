from sqlalchemy import Column, Integer, String, Date, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Patient(Base):
    __tablename__="patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=False)
    blood_type = Column(String(3), nullable=False)
    status = Column(String(10),default="active", nullable=False)
    last_visit= Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    address = relationship("Address", back_populates="patient", uselist=False, cascade="all, delete-orphan")
    allergies = relationship("Allergy", back_populates="patient", cascade="all, delete-orphan")
    conditions = relationship("Condition", back_populates="patient", cascade="all, delete-orphan")
    patientnotes = relationship("PatientNote", back_populates="patient", cascade="all, delete-orphan")
    contact = relationship("Contact", back_populates="patient", uselist=False, cascade="all, delete-orphan")


    

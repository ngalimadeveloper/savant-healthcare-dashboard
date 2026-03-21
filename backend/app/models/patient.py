from sqlalchemy import Column, Integer, String, Date, DateTime, CheckConstraint, Index, text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Patient(Base):
    __tablename__="patients"
    __table_args__ = (
        CheckConstraint("status IN ('active', 'inactive')", name="ck_patients_status_active_inactive"),
        CheckConstraint("blood_type IS NULL OR blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')", name="ck_patients_blood_type_valid"),
        CheckConstraint("dob <= CURRENT_DATE", name="ck_patients_dob_not_future"),
        CheckConstraint("last_visit IS NULL OR last_visit <= CURRENT_DATE", name="ck_patients_last_visit_not_future"),
        CheckConstraint("char_length(btrim(first_name)) > 0", name="ck_patients_first_name_not_blank"),
        CheckConstraint("middle_name IS NULL OR char_length(btrim(middle_name)) > 0", name="ck_patients_middle_name_not_blank"),
        CheckConstraint("char_length(btrim(last_name)) > 0", name="ck_patients_last_name_not_blank"),
        Index("ix_patients_status", "status"),
        Index("ix_patients_first_name_lower", text("lower(first_name)")),
        Index("ix_patients_middle_name_lower", text("lower(middle_name)")),
        Index("ix_patients_last_name_lower", text("lower(last_name)")),
    )

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=False)
    blood_type = Column(String(3), nullable=True)
    status = Column(String(10),default="active", nullable=False)
    last_visit= Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    address = relationship("Address", back_populates="patient", uselist=False, cascade="all, delete-orphan")
    allergies = relationship("Allergy", back_populates="patient", cascade="all, delete-orphan")
    conditions = relationship("Condition", back_populates="patient", cascade="all, delete-orphan")
    patientnotes = relationship("PatientNote", back_populates="patient", cascade="all, delete-orphan")
    contact = relationship("Contact", back_populates="patient", uselist=False, cascade="all, delete-orphan")


    

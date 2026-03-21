from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from app.models.patient import Patient
from app.models.contact import Contact
from app.schemas.patient import PatientListQueryParams


class PatientRepository:
    def __init__(self, db:Session):
        self.db = db
    
    def get_all_patients(self, query_params: PatientListQueryParams):
        query = self.db.query(Patient).options(
            joinedload(Patient.address),
            joinedload(Patient.contact),
        )

        if query_params.status:
            query = query.filter(Patient.status == query_params.status.value)
        else:
            query = query.filter(Patient.status.in_(["active", "inactive"]))

        if query_params.search:
            search_terms = [term for term in query_params.search.lower().split() if term]
            for term in search_terms:
                search_value = f"{term}%"
                query = query.filter(
                    func.lower(Patient.first_name).like(search_value)
                    | func.lower(Patient.middle_name).like(search_value)
                    | func.lower(Patient.last_name).like(search_value)
                )

        sort_col = func.lower(Patient.last_name)
        if query_params.sort_order == "desc":
            query = query.order_by(sort_col.desc(), Patient.id.asc())
        else:
            query = query.order_by(sort_col.asc(), Patient.id.asc())

        offset = query_params.offset or 0
        rows = query.offset(offset).limit(query_params.limit + 1).all()

        has_more = len(rows) > query_params.limit
        items = rows[: query_params.limit]
        return items, has_more

    def get_patient_stats(self):
        grouped_counts = (
            self.db.query(Patient.status, func.count(Patient.id))
            .filter(Patient.status.in_(["active", "inactive"]))
            .group_by(Patient.status)
            .all()
        )

        by_status = {"active": 0, "inactive": 0}
        for status, count in grouped_counts:
            by_status[status] = count

        total = sum(by_status.values())

        return {
            "total": total,
            "active": by_status["active"],
            "inactive": by_status["inactive"],
            "by_status": by_status,
        }

    def get_patient_by_id(self, patient_id:int):
        return (
                self.db.query(Patient)
                .options(joinedload(Patient.contact), joinedload(Patient.address))
                .filter(Patient.id == patient_id)
                .first()
        )

    def get_patient_by_email(self, email:str):
        return (
                self.db.query(Patient)
                .filter(Patient.contact.has(email=email))
                .join(Contact, Contact.patient_id == Patient.id)
                .first()
        )

    def get_patient_with_clinical_data(self, patient_id:int):
        return (
            self.db.query(Patient)
            .options(
                joinedload(Patient.allergies),
                joinedload(Patient.conditions),
            )
            .filter(Patient.id == patient_id)
            .first()
        )

    def create_patient(self, patient: Patient):
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient
    

    def delete_patient(self, patient:Patient):
        self.db.delete(patient)
        self.db.commit()
    
        
    def update_patient(self, patient:Patient):
        self.db.commit()
        self.db.refresh(patient)
        return patient
    
    


    

    
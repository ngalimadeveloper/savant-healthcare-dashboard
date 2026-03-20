"""populate tables

Revision ID: 4f10e563cd03
Revises: a1d856d9fca7
Create Date: 2026-03-18 17:51:50.546762

"""
from typing import Sequence, Union
from datetime import date, datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4f10e563cd03'
down_revision: Union[str, Sequence[str], None] = 'a1d856d9fca7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    patients_table = sa.table(
        "patients",
        sa.column("id", sa.Integer),
        sa.column("first_name", sa.String),
        sa.column("middle_name", sa.String),
        sa.column("last_name", sa.String),
        sa.column("dob", sa.Date),
        sa.column("blood_type", sa.String),
        sa.column("last_visit", sa.DateTime),
        sa.column("status", sa.String),
    )

    addresses_table = sa.table(
        "addresses",
        sa.column("id", sa.Integer),
        sa.column("patient_id", sa.Integer),
        sa.column("street", sa.String),
        sa.column("unit_number", sa.String),
        sa.column("city", sa.String),
        sa.column("state", sa.String),
        sa.column("zip_code", sa.String),
        sa.column("country", sa.String),
    )

    contacts_table = sa.table(
        "contacts",
        sa.column("id", sa.Integer),
        sa.column("patient_id", sa.Integer),
        sa.column("email", sa.String),
        sa.column("phone_number", sa.String),
    )

    allergies_table = sa.table(
        "allergies",
        sa.column("id", sa.Integer),
        sa.column("patient_id", sa.Integer),
        sa.column("allergy_name", sa.String),
    )

    conditions_table = sa.table(
        "conditions",
        sa.column("id", sa.Integer),
        sa.column("patient_id", sa.Integer),
        sa.column("condition_name", sa.String),
    )

    patientnotes_table = sa.table(
        "patientnotes",
        sa.column("id", sa.Integer),
        sa.column("patient_id", sa.Integer),
        sa.column("text", sa.String),
    )

    
    op.bulk_insert(
        patients_table,
        [
            {
                "first_name": "John",
                "middle_name": "Michael",
                "last_name": "Doe",
                "dob": date(1991, 5, 14),
                "blood_type": "O+",
                "status": "active",
                "last_visit": datetime(2026, 2, 10, 9, 30),
            },
            {
                "first_name": "Sarah",
                "middle_name": "Anne",
                "last_name": "Williams",
                "dob": date(1987, 11, 2),
                "blood_type": "A-",
                "status": "active",
                "last_visit": datetime(2026, 1, 18, 14, 0),
            },
            {
                "first_name": "David",
                "middle_name": None,
                "last_name": "Brown",
                "dob": date(1978, 8, 21),
                "blood_type": "B+",
                "status": "inactive",
                "last_visit": datetime(2025, 12, 5, 11, 15),
            },
            {
                "first_name": "Emily",
                "middle_name": "Rose",
                "last_name": "Johnson",
                "dob": date(1995, 3, 9),
                "blood_type": None,
                "status": "active",
                "last_visit": datetime(2026, 3, 1, 10, 45),
            },
            {
                "first_name": "Michael",
                "middle_name": "James",
                "last_name": "Taylor",
                "dob": date(1982, 7, 30),
                "blood_type": "O-",
                "status": "active",
                "last_visit": datetime(2026, 2, 21, 16, 20),
            },
            {
                "first_name": "Jessica",
                "middle_name": None,
                "last_name": "Martinez",
                "dob": date(1990, 12, 11),
                "blood_type": "A+",
                "status": "active",
                "last_visit": datetime(2026, 2, 3, 8, 50),
            },
            {
                "first_name": "Christopher",
                "middle_name": "Lee",
                "last_name": "Anderson",
                "dob": date(1974, 4, 25),
                "blood_type": "B-",
                "status": "deceased",
                "last_visit": datetime(2025, 10, 14, 13, 10),
            },
            {
                "first_name": "Ashley",
                "middle_name": "Nicole",
                "last_name": "Thomas",
                "dob": date(2001, 6, 17),
                "blood_type": None,
                "status": "active",
                "last_visit": datetime(2026, 3, 7, 15, 5),
            },
            {
                "first_name": "Daniel",
                "middle_name": "Robert",
                "last_name": "Jackson",
                "dob": date(1989, 1, 6),
                "blood_type": "O+",
                "status": "active",
                "last_visit": datetime(2026, 1, 29, 9, 0),
            },
            {
                "first_name": "Olivia",
                "middle_name": "Grace",
                "last_name": "White",
                "dob": date(1997, 9, 23),
                "blood_type": "A+",
                "status": "active",
                "last_visit": datetime(2026, 2, 27, 12, 40),
            },
            {
                "first_name": "Matthew",
                "middle_name": None,
                "last_name": "Harris",
                "dob": date(1984, 2, 13),
                "blood_type": "B+",
                "status": "inactive",
                "last_visit": datetime(2025, 11, 19, 10, 10),
            },
            {
                "first_name": "Sophia",
                "middle_name": "Marie",
                "last_name": "Clark",
                "dob": date(1993, 10, 4),
                "blood_type": None,
                "status": "active",
                "last_visit": datetime(2026, 3, 10, 11, 55),
            },
            {
                "first_name": "James",
                "middle_name": "Allen",
                "last_name": "Lewis",
                "dob": date(1971, 5, 28),
                "blood_type": "A-",
                "status": "active",
                "last_visit": datetime(2026, 1, 12, 14, 45),
            },
            {
                "first_name": "Mia",
                "middle_name": None,
                "last_name": "Walker",
                "dob": date(2000, 8, 8),
                "blood_type": "AB+",
                "status": "active",
                "last_visit": datetime(2026, 3, 12, 9, 25),
            },
            {
                "first_name": "Benjamin",
                "middle_name": "Scott",
                "last_name": "Hall",
                "dob": date(1986, 11, 19),
                "blood_type": "O+",
                "status": "active",
                "last_visit": datetime(2026, 2, 14, 13, 35),
            },
        ],
    )
    op.bulk_insert(
        addresses_table,
        [
            {"patient_id": 1, "street": "123 Main St", "unit_number": "Apt 5B", "city": "Oakland", "state": "CA", "zip_code": "94612", "country": "US"},
            {"patient_id": 2, "street": "456 Pine Ave", "unit_number": None, "city": "San Francisco", "state": "CA", "zip_code": "94107", "country": "US"},
            {"patient_id": 3, "street": "789 Market Blvd", "unit_number": "Suite 210", "city": "San Jose", "state": "CA", "zip_code": "95113", "country": "US"},
            {"patient_id": 4, "street": "82 Lakeview Dr", "unit_number": None, "city": "Berkeley", "state": "CA", "zip_code": "94704", "country": "US"},
            {"patient_id": 5, "street": "910 Redwood Rd", "unit_number": None, "city": "Walnut Creek", "state": "CA", "zip_code": "94596", "country": "US"},
            {"patient_id": 6, "street": "14 Elm Street", "unit_number": "Unit 2A", "city": "Dublin", "state": "CA", "zip_code": "94568", "country": "US"},
            {"patient_id": 7, "street": "200 Sunset Ave", "unit_number": None, "city": "Richmond", "state": "CA", "zip_code": "94801", "country": "US"},
            {"patient_id": 8, "street": "65 College Way", "unit_number": "Dorm 4C", "city": "Palo Alto", "state": "CA", "zip_code": "94301", "country": "US"},
            {"patient_id": 9, "street": "340 Cedar Lane", "unit_number": None, "city": "Fremont", "state": "CA", "zip_code": "94538", "country": "US"},
            {"patient_id": 10, "street": "77 Mission St", "unit_number": "Apt 9", "city": "San Francisco", "state": "CA", "zip_code": "94105", "country": "US"},
            {"patient_id": 11, "street": "415 Willow Ave", "unit_number": None, "city": "Hayward", "state": "CA", "zip_code": "94541", "country": "US"},
            {"patient_id": 12, "street": "999 Blossom Hill Rd", "unit_number": None, "city": "San Jose", "state": "CA", "zip_code": "95123", "country": "US"},
            {"patient_id": 13, "street": "52 Vineyard Ct", "unit_number": None, "city": "Livermore", "state": "CA", "zip_code": "94550", "country": "US"},
            {"patient_id": 14, "street": "18 Harbor Point", "unit_number": "Unit 7", "city": "Alameda", "state": "CA", "zip_code": "94501", "country": "US"},
            {"patient_id": 15, "street": "600 Grand Ave", "unit_number": None, "city": "South San Francisco", "state": "CA", "zip_code": "94080", "country": "US"},
        ],
    )

    op.bulk_insert(
        contacts_table,
        [
            {"patient_id": 1, "email": "john.doe@example.com", "phone_number": "510-555-0101"},
            {"patient_id": 2, "email": "sarah.williams@example.com", "phone_number": "415-555-0202"},
            {"patient_id": 3, "email": "david.brown@example.com", "phone_number": "408-555-0303"},
            {"patient_id": 4, "email": "emily.johnson@example.com", "phone_number": "510-555-0404"},
            {"patient_id": 5, "email": "michael.taylor@example.com", "phone_number": "925-555-0505"},
            {"patient_id": 6, "email": "jessica.martinez@example.com", "phone_number": "925-555-0606"},
            {"patient_id": 7, "email": "christopher.anderson@example.com", "phone_number": "510-555-0707"},
            {"patient_id": 8, "email": "ashley.thomas@example.com", "phone_number": "650-555-0808"},
            {"patient_id": 9, "email": "daniel.jackson@example.com", "phone_number": "510-555-0909"},
            {"patient_id": 10, "email": "olivia.white@example.com", "phone_number": "415-555-1010"},
            {"patient_id": 11, "email": "matthew.harris@example.com", "phone_number": "510-555-1111"},
            {"patient_id": 12, "email": "sophia.clark@example.com", "phone_number": "408-555-1212"},
            {"patient_id": 13, "email": "james.lewis@example.com", "phone_number": "925-555-1313"},
            {"patient_id": 14, "email": "mia.walker@example.com", "phone_number": "510-555-1414"},
            {"patient_id": 15, "email": "benjamin.hall@example.com", "phone_number": "650-555-1515"},
        ],
    )

    op.bulk_insert(
        allergies_table,
        [
            {"patient_id": 1, "allergy_name": "Peanuts"},
            {"patient_id": 1, "allergy_name": "Penicillin"},
            {"patient_id": 2, "allergy_name": "Shellfish"},
            {"patient_id": 3, "allergy_name": "Latex"},
            {"patient_id": 4, "allergy_name": "Dust"},
            {"patient_id": 5, "allergy_name": "Ibuprofen"},
            {"patient_id": 6, "allergy_name": "Pollen"},
            {"patient_id": 7, "allergy_name": "Sulfa Drugs"},
            {"patient_id": 8, "allergy_name": "Eggs"},
            {"patient_id": 9, "allergy_name": "Peanuts"},
            {"patient_id": 10, "allergy_name": "Milk"},
            {"patient_id": 11, "allergy_name": "Soy"},
            {"patient_id": 12, "allergy_name": "Bee Stings"},
            {"patient_id": 13, "allergy_name": "Mold"},
            {"patient_id": 14, "allergy_name": "Tree Nuts"},
            {"patient_id": 15, "allergy_name": "Amoxicillin"},
            {"patient_id": 5, "allergy_name": "Shellfish"},
            {"patient_id": 12, "allergy_name": "Penicillin"},
        ],
    )

    op.bulk_insert(
        conditions_table,
        [
            {"patient_id": 1, "condition_name": "Hypertension"},
            {"patient_id": 1, "condition_name": "Asthma"},
            {"patient_id": 2, "condition_name": "Type 2 Diabetes"},
            {"patient_id": 3, "condition_name": "Chronic Migraine"},
            {"patient_id": 4, "condition_name": "Anxiety"},
            {"patient_id": 5, "condition_name": "High Cholesterol"},
            {"patient_id": 6, "condition_name": "Seasonal Allergic Rhinitis"},
            {"patient_id": 7, "condition_name": "Coronary Artery Disease"},
            {"patient_id": 8, "condition_name": "Iron Deficiency Anemia"},
            {"patient_id": 9, "condition_name": "GERD"},
            {"patient_id": 10, "condition_name": "Hypothyroidism"},
            {"patient_id": 11, "condition_name": "Sleep Apnea"},
            {"patient_id": 12, "condition_name": "Depression"},
            {"patient_id": 13, "condition_name": "Osteoarthritis"},
            {"patient_id": 14, "condition_name": "Vitamin D Deficiency"},
            {"patient_id": 15, "condition_name": "Obesity"},
            {"patient_id": 5, "condition_name": "Hypertension"},
            {"patient_id": 13, "condition_name": "Type 2 Diabetes"},
        ],
    )

    op.bulk_insert(
        patientnotes_table,
        [
            {"patient_id": 1, "text": "Patient reports occasional shortness of breath during exercise."},
            {"patient_id": 1, "text": "Blood pressure slightly elevated during last checkup."},
            {"patient_id": 2, "text": "Patient advised to monitor blood glucose levels daily."},
            {"patient_id": 3, "text": "Patient experiences migraines approximately twice per month."},
            {"patient_id": 4, "text": "Patient has been responding well to counseling and lifestyle changes."},
            {"patient_id": 5, "text": "Recommended dietary modifications and repeat lipid panel in three months."},
            {"patient_id": 6, "text": "Symptoms worsen during spring months; continue antihistamine as needed."},
            {"patient_id": 7, "text": "Historical chart review completed and cardiac medications reconciled."},
            {"patient_id": 8, "text": "Encouraged iron-rich diet and repeat CBC at next visit."},
            {"patient_id": 9, "text": "Reflux symptoms controlled with current medication regimen."},
            {"patient_id": 10, "text": "Patient reports improved energy since starting thyroid replacement therapy."},
            {"patient_id": 11, "text": "Sleep study results reviewed; patient using CPAP inconsistently."},
            {"patient_id": 12, "text": "Mood has improved; continue current treatment plan and follow-up."},
            {"patient_id": 13, "text": "Joint pain most pronounced in knees and hands, especially in the morning."},
            {"patient_id": 14, "text": "Patient started vitamin D supplementation two weeks ago."},
            {"patient_id": 15, "text": "Discussed weight management goals and referral to nutrition services."},
            {"patient_id": 8, "text": "College immunization records reviewed and updated in chart."},
            {"patient_id": 4, "text": "Patient requested refill for anxiety medication; no adverse effects reported."},
        ],
    )
    
    
    
    

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DELETE from patientnotes")
    op.execute("DELETE from conditions")
    op.execute("DELETE from contacts")
    op.execute("DELETE from addresses")
    op.execute("DELETE from allergies")
    op.execute("DELETE from patients")


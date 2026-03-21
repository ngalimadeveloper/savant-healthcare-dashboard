export interface AllergyItem {
  allergy_name: string;
}

export interface ConditionItem {
  condition_name: string;
}

export interface PatientSummary {
  full_name: string;
  age: number;
  bloodtype: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null;
  allergies: AllergyItem[];
  conditions: ConditionItem[];
  notes_summary: string;
}
